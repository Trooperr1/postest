import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { productService, salesService } from '../services/db';
import { t } from '../utils/translations';
import { formatCurrency, printReceipt } from '../utils/receiptPrinter';
import { ShoppingCart, Search, Plus, Minus, Trash2, DollarSign, Printer, AlertCircle } from 'lucide-react';

/**
 * Sales/Cashier Screen Component
 * Handles product selection, cart management, and checkout
 */
export default function SalesScreen() {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [taxRate, setTaxRate] = useState(0); // Tax rate (0 = no tax)

  // Live query to get all products
  const products = useLiveQuery(
    () => productService.getAllProducts(),
    []
  );

  // Filter products based on search query
  const searchResults = products?.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.barcode?.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 8) || []; // Limit to 8 results

  /**
   * Add product to cart or increase quantity
   */
  const addToCart = (product) => {
    // Check if product is in stock
    if (product.stock <= 0) {
      alert(`${product.name} ${t('sales.outOfStock')}`);
      return;
    }

    // Check if product already in cart
    const existingItem = cart.find(item => item.productId === product.id);

    if (existingItem) {
      // Check if we have enough stock
      if (existingItem.quantity >= product.stock) {
        alert(`${product.name} - کۆگا بەسە نییە`);
        return;
      }

      // Increase quantity
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Add new item to cart
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        maxStock: product.stock,
      }]);
    }

    // Clear search after adding
    setSearchQuery('');
  };

  /**
   * Update item quantity in cart
   */
  const updateQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item.productId === productId) {
        const newQuantity = item.quantity + change;

        // Ensure quantity is within valid range
        if (newQuantity <= 0) {
          return null; // Will be filtered out
        }

        if (newQuantity > item.maxStock) {
          alert('کۆگا بەسە نییە');
          return item;
        }

        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean)); // Remove null items
  };

  /**
   * Remove item from cart
   */
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  /**
   * Clear entire cart
   */
  const clearCart = () => {
    if (cart.length > 0 && window.confirm('دڵنیایت لە سڕینەوەی هەموو بەرهەمەکان؟')) {
      setCart([]);
    }
  };

  /**
   * Calculate cart totals
   */
  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;

    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  /**
   * Process payment and print receipt
   */
  const handlePayment = async () => {
    if (cart.length === 0) {
      alert('سەبەتە بەتاڵە');
      return;
    }

    try {
      // Prepare sale data
      const saleData = {
        items: cart,
        subtotal,
        tax,
        total,
        date: new Date().toISOString(),
      };

      // Save sale to database (this will also decrease stock)
      await salesService.addSale(saleData);

      // Print receipt
      printReceipt(saleData);

      // Clear cart
      setCart([]);

      // Show success message
      alert('فرۆشتن سەرکەوتوو بوو!');
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('هەڵە لە فرۆشتن');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 max-w-7xl mx-auto">
        {/* Left Side - Product Search and Selection */}
        <div className="lg:col-span-2">
          {/* Search Bar */}
          <div className="card mb-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Search size={24} />
              {t('sales.searchPlaceholder')}
            </h2>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={t('sales.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pr-12"
                autoFocus
              />
            </div>
          </div>

          {/* Product Grid */}
          {searchQuery && (
            <div className="card">
              <h3 className="text-xl font-bold mb-4">نەتیجەکانی گەڕان</h3>
              {searchResults.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {t('sales.noProducts')}
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {searchResults.map(product => (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      disabled={product.stock <= 0}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        product.stock <= 0
                          ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                          : 'bg-white border-primary-300 hover:border-primary-500 hover:shadow-lg active:scale-95'
                      }`}
                    >
                      <h4 className="font-bold text-lg mb-2">{product.name}</h4>
                      <p className="text-primary-600 font-bold text-xl mb-2">
                        {product.price.toLocaleString()}
                      </p>
                      <div className={`text-sm font-bold ${
                        product.stock <= 0 ? 'text-red-600' :
                        product.stock < 10 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {product.stock <= 0 ? t('sales.outOfStock') :
                         product.stock < 10 ? `${t('sales.lowStock')} (${product.stock})` :
                         `${t('products.stock')}: ${product.stock}`}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Access Products (when no search) */}
          {!searchQuery && products && (
            <div className="card">
              <h3 className="text-xl font-bold mb-4">بەرهەمە بەردەستەکان</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {products.slice(0, 12).map(product => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      product.stock <= 0
                        ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                        : 'bg-white border-primary-300 hover:border-primary-500 hover:shadow-lg active:scale-95'
                    }`}
                  >
                    <h4 className="font-bold text-lg mb-2">{product.name}</h4>
                    <p className="text-primary-600 font-bold text-xl mb-2">
                      {product.price.toLocaleString()}
                    </p>
                    <div className={`text-sm font-bold ${
                      product.stock <= 0 ? 'text-red-600' :
                      product.stock < 10 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {product.stock <= 0 ? t('sales.outOfStock') :
                       product.stock < 10 ? `${t('sales.lowStock')} (${product.stock})` :
                       `کۆگا: ${product.stock}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Shopping Cart */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <ShoppingCart size={24} />
              {t('sales.cart')}
            </h2>

            {/* Cart Items */}
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">{t('sales.empty')}</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.productId} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          {item.price.toLocaleString()} × {item.quantity}
                        </div>
                        <div className="font-bold text-primary-600">
                          {(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.productId, -1)}
                          className="bg-gray-300 hover:bg-gray-400 p-2 rounded transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-bold text-lg px-3">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, 1)}
                          className="bg-primary-500 hover:bg-primary-600 text-white p-2 rounded transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t-2 pt-4 space-y-2">
                  <div className="flex justify-between text-lg">
                    <span>{t('sales.subtotal')}:</span>
                    <span className="font-bold">{formatCurrency(subtotal)}</span>
                  </div>

                  {tax > 0 && (
                    <div className="flex justify-between text-lg">
                      <span>{t('sales.tax')}:</span>
                      <span className="font-bold">{formatCurrency(tax)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-2xl font-bold text-primary-600 pt-2 border-t">
                    <span>{t('sales.total')}:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handlePayment}
                    className="w-full btn-primary flex items-center justify-center gap-2 text-xl"
                  >
                    <Printer size={24} />
                    {t('sales.payment')}
                  </button>

                  <button
                    onClick={clearCart}
                    className="w-full btn-danger flex items-center justify-center gap-2"
                  >
                    <Trash2 size={20} />
                    سڕینەوەی سەبەتە
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
