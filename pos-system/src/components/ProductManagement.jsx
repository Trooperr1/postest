import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { productService } from '../services/db';
import { t } from '../utils/translations';
import { Package, Edit, Trash2, Plus, Search, AlertTriangle } from 'lucide-react';

/**
 * Product Management Component
 * Handles adding, editing, and deleting products
 */
export default function ProductManagement() {
  // State management
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    price: '',
    stock: '',
  });

  // Live query to get all products from IndexedDB
  const products = useLiveQuery(
    () => productService.getAllProducts(),
    []
  );

  // Filter products based on search query
  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.barcode?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Get low stock products
  const lowStockProducts = products?.filter(p => p.stock < 10) || [];

  /**
   * Handle form input changes
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Open modal for adding new product
   */
  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      barcode: '',
      price: '',
      stock: '',
    });
    setShowModal(true);
  };

  /**
   * Open modal for editing existing product
   */
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      barcode: product.barcode || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
    setShowModal(true);
  };

  /**
   * Save product (add or update)
   */
  const handleSaveProduct = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!formData.name || !formData.price || !formData.stock) {
      alert('تکایە هەموو خانەکان پڕبکەرەوە');
      return;
    }

    const productData = {
      name: formData.name.trim(),
      barcode: formData.barcode.trim(),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
    };

    try {
      if (editingProduct) {
        // Update existing product
        await productService.updateProduct(editingProduct.id, productData);
      } else {
        // Add new product
        await productService.addProduct(productData);
      }

      // Close modal and reset form
      setShowModal(false);
      setFormData({
        name: '',
        barcode: '',
        price: '',
        stock: '',
      });
    } catch (error) {
      console.error('Error saving product:', error);
      alert('هەڵە لە پاشەکەوتکردن');
    }
  };

  /**
   * Delete product with confirmation
   */
  const handleDeleteProduct = async (product) => {
    if (window.confirm(`${t('products.confirmDelete')}\n"${product.name}"`)) {
      try {
        await productService.deleteProduct(product.id);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('هەڵە لە سڕینەوە');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Package size={32} />
              {t('products.title')}
            </h1>
            <p className="text-gray-600 mt-1">
              {t('products.totalProducts')}: {products?.length || 0}
            </p>
          </div>
          <button
            onClick={handleAddProduct}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            {t('products.addProduct')}
          </button>
        </div>

        {/* Low Stock Warning */}
        {lowStockProducts.length > 0 && (
          <div className="mt-4 bg-yellow-50 border-r-4 border-yellow-400 p-4 rounded">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle size={20} />
              <span className="font-bold">{t('products.lowStockWarning')}</span>
              <span>({lowStockProducts.length} بەرهەم)</span>
            </div>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={t('products.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pr-12"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredProducts.length === 0 ? (
          <div className="card text-center py-12">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-xl">{t('products.noProducts')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className={`card hover:shadow-xl transition-shadow ${
                  product.stock < 10 ? 'border-2 border-yellow-400' : ''
                }`}
              >
                {/* Product Info */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {product.name}
                  </h3>
                  {product.barcode && (
                    <p className="text-sm text-gray-600 mb-1">
                      {t('products.barcode')}: {product.barcode}
                    </p>
                  )}
                  <p className="text-2xl font-bold text-primary-600 mb-2">
                    {product.price.toLocaleString()} {t('common.currency')}
                  </p>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                    product.stock < 10 ? 'bg-yellow-100 text-yellow-800' :
                    product.stock < 50 ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {t('products.stock')}: {product.stock}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Edit size={16} />
                    {t('products.edit')}
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Trash2 size={16} />
                    {t('products.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" dir="rtl">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingProduct ? t('products.editProduct') : t('products.addProduct')}
              </h2>

              <form onSubmit={handleSaveProduct}>
                {/* Product Name */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    {t('products.name')} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t('products.namePlaceholder')}
                    className="input-field"
                    required
                  />
                </div>

                {/* Barcode */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    {t('products.barcode')}
                  </label>
                  <input
                    type="text"
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleInputChange}
                    placeholder={t('products.barcodePlaceholder')}
                    className="input-field"
                  />
                </div>

                {/* Price */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    {t('products.price')} *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder={t('products.pricePlaceholder')}
                    className="input-field"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                {/* Stock */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-bold mb-2">
                    {t('products.stock')} *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder={t('products.stockPlaceholder')}
                    className="input-field"
                    min="0"
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    {t('products.save')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    {t('products.cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
