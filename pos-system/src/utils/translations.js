// Kurdish (Sorani) translations for POS system
export const translations = {
  // Navigation
  nav: {
    sales: 'فرۆشتن',
    products: 'بەرهەمەکان',
    history: 'مێژوو',
  },

  // Sales Screen
  sales: {
    title: 'فرۆشتن',
    searchPlaceholder: 'گەڕان بە ناو یان بارکۆد...',
    cart: 'سەبەتە',
    empty: 'سەبەتە بەتاڵە',
    subtotal: 'کۆی گشتی',
    tax: 'باج',
    total: 'کۆی کۆتایی',
    payment: 'پارەدان',
    printReceipt: 'چاپکردنی وەسڵ',
    addToCart: 'زیادکردن بۆ سەبەتە',
    removeItem: 'لابردن',
    quantity: 'ژمارە',
    price: 'نرخ',
    noProducts: 'هیچ بەرهەمێک نەدۆزرایەوە',
    outOfStock: 'لە کۆگا نییە',
    lowStock: 'کۆگا کەمە',
  },

  // Products Screen
  products: {
    title: 'بەرهەمەکان',
    addProduct: 'زیادکردنی بەرهەم',
    editProduct: 'دەستکاریکردنی بەرهەم',
    deleteProduct: 'سڕینەوەی بەرهەم',
    name: 'ناو',
    barcode: 'بارکۆد',
    price: 'نرخ',
    stock: 'کۆگا',
    actions: 'کردارەکان',
    save: 'پاشەکەوتکردن',
    cancel: 'هەڵوەشاندنەوە',
    edit: 'دەستکاری',
    delete: 'سڕینەوە',
    confirmDelete: 'دڵنیایت لە سڕینەوەی ئەم بەرهەمە؟',
    namePlaceholder: 'ناوی بەرهەم',
    barcodePlaceholder: 'بارکۆد',
    pricePlaceholder: 'نرخ',
    stockPlaceholder: 'ژمارەی کۆگا',
    searchPlaceholder: 'گەڕان بە ناو...',
    noProducts: 'هیچ بەرهەمێک نییە',
    totalProducts: 'کۆی گشتی بەرهەمەکان',
    lowStockWarning: 'ئاگاداری: کۆگا کەمە',
  },

  // Sales History
  history: {
    title: 'مێژووی فرۆشتن',
    date: 'بەروار',
    time: 'کات',
    total: 'کۆی گشتی',
    items: 'بەرهەمەکان',
    viewDetails: 'بینینی وردەکاری',
    dailySummary: 'پوختەی ڕۆژانە',
    totalSales: 'کۆی فرۆشتن',
    totalTransactions: 'کۆی مامەڵەکان',
    totalItems: 'کۆی بەرهەمەکان',
    noSales: 'هیچ فرۆشتنێک نییە',
    today: 'ئەمڕۆ',
    yesterday: 'دوێنێ',
    selectDate: 'هەڵبژاردنی بەروار',
  },

  // Receipt
  receipt: {
    title: 'وەسڵی فرۆشتن',
    storeName: 'کۆمپانیا',
    date: 'بەروار',
    time: 'کات',
    items: 'بەرهەمەکان',
    item: 'بەرهەم',
    quantity: 'ژمارە',
    price: 'نرخ',
    total: 'کۆ',
    subtotal: 'کۆی گشتی',
    tax: 'باج',
    grandTotal: 'کۆی کۆتایی',
    thankYou: 'سوپاس بۆ کڕینەکەت!',
    footer: 'بەخێربێیتەوە',
  },

  // Common
  common: {
    currency: 'دینار',
    save: 'پاشەکەوتکردن',
    cancel: 'هەڵوەشاندنەوە',
    edit: 'دەستکاری',
    delete: 'سڕینەوە',
    close: 'داخستن',
    confirm: 'دڵنیاکردنەوە',
    search: 'گەڕان',
    loading: 'چاوەڕوانبە...',
    error: 'هەڵە',
    success: 'سەرکەوتوو',
    yes: 'بەڵێ',
    no: 'نەخێر',
  },
};

// Helper function to get translation
export const t = (key) => {
  const keys = key.split('.');
  let value = translations;

  for (const k of keys) {
    value = value?.[k];
    if (!value) return key;
  }

  return value;
};
