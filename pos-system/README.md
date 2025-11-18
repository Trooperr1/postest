# سیستەمی فرۆشتن - Modern POS System

A modern, offline-capable Point of Sale (POS) system built with React, designed specifically for Kurdish language support with RTL (Right-to-Left) layout.

## Features

### 🛒 Sales/Cashier Screen
- **Product Search**: Search products by name or barcode
- **Shopping Cart**: Add, remove, and adjust quantities
- **Real-time Calculations**: Automatic subtotal, tax, and total calculations
- **Stock Validation**: Prevent overselling with real-time stock checking
- **Touch-Friendly UI**: Large buttons optimized for touchscreen devices

### 📦 Product Management
- **CRUD Operations**: Add, edit, and delete products
- **Stock Tracking**: Monitor inventory levels
- **Low Stock Warnings**: Automatic alerts for products with stock < 10
- **Search & Filter**: Quick product search by name or barcode
- **Barcode Support**: Optional barcode for each product

### 📊 Sales History
- **Transaction History**: View all past sales
- **Daily Summary**: Automated daily sales reports with totals
- **Date Filter**: Filter sales by specific date
- **Transaction Details**: View complete details of each sale
- **Statistics Dashboard**: Total sales, transactions, and items sold

### 🖨️ Thermal Receipt Printing
- **ESC/POS Compatible**: Formatted for 80mm thermal printers
- **Browser Print API**: Direct printing from browser
- **Kurdish Receipt**: Full Kurdish language support
- **Detailed Information**: Store name, date, time, items, and totals

### 💾 Offline Support
- **IndexedDB Storage**: All data stored locally in browser
- **No Internet Required**: Works completely offline
- **Fast Performance**: Instant data access with Dexie.js
- **Auto Stock Management**: Automatic inventory updates on sale

## Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Database**: IndexedDB (via Dexie.js)
- **Icons**: Lucide React
- **Language**: Kurdish (Sorani) with RTL support

## Installation

### Prerequisites
- Node.js 18+ and npm

### Setup Instructions

1. **Navigate to project directory**:
   ```bash
   cd pos-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   - The app will automatically open at `http://localhost:3000`
   - Or manually open the URL shown in terminal

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Usage Guide

### 1. Product Management

**Adding a Product**:
1. Click "زیادکردنی بەرهەم" (Add Product)
2. Enter product details:
   - Name (required)
   - Barcode (optional)
   - Price (required)
   - Stock quantity (required)
3. Click "پاشەکەوتکردن" (Save)

**Editing a Product**:
1. Find the product in the grid
2. Click "دەستکاری" (Edit) button
3. Update the information
4. Click "پاشەکەوتکردن" (Save)

**Deleting a Product**:
1. Find the product in the grid
2. Click "سڕینەوە" (Delete) button
3. Confirm deletion

### 2. Making a Sale

**Adding Items to Cart**:
1. Use the search bar to find products by name or barcode
2. Click on a product to add it to cart
3. Use + and - buttons to adjust quantities
4. Click trash icon to remove items

**Completing a Sale**:
1. Review cart items and total
2. Click "پارەدان" (Payment) button
3. Receipt will automatically print (if printer is connected)
4. Cart will be cleared for next customer

### 3. Viewing Sales History

**Daily Summary**:
1. Navigate to "مێژوو" (History) tab
2. Select a date using the date picker
3. View summary cards showing:
   - Total sales amount
   - Number of transactions
   - Total items sold

**Transaction Details**:
1. Click on any transaction in the list
2. View complete details including all items
3. See subtotal, tax, and total

## Printing Setup

### For Thermal Receipt Printers

1. **Install Printer Drivers**:
   - Install manufacturer's drivers for your thermal printer
   - Most ESC/POS printers work with standard drivers

2. **Configure Browser**:
   - Allow browser to access printers
   - Set thermal printer as default (or select when printing)

3. **Printer Settings**:
   - Paper width: 80mm (default) or 58mm
   - Auto-cut: Enabled (if supported)
   - Character set: UTF-8 for Kurdish support

4. **Test Printing**:
   - Make a test sale
   - Click payment button
   - Browser print dialog should appear
   - Select your thermal printer
   - Verify Kurdish text prints correctly

### Troubleshooting Printing

- **Kurdish text not showing**: Install fonts supporting Kurdish on the printer
- **Wrong paper size**: Adjust `@page size` in `receiptPrinter.js`
- **Print preview appears**: Normal behavior; select printer and confirm
- **Nothing prints**: Check printer connection and drivers

## Project Structure

```
pos-system/
├── src/
│   ├── components/
│   │   ├── ProductManagement.jsx   # Product CRUD interface
│   │   ├── SalesScreen.jsx         # Main cashier screen
│   │   └── SalesHistory.jsx        # Sales history & reports
│   ├── services/
│   │   └── db.js                   # IndexedDB database service
│   ├── utils/
│   │   ├── translations.js         # Kurdish translations
│   │   └── receiptPrinter.js       # Receipt printing utility
│   ├── App.jsx                     # Main app component
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Global styles + Tailwind
├── index.html                      # HTML entry point
├── package.json                    # Dependencies
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind configuration
└── postcss.config.js               # PostCSS configuration
```

## Database Schema

### Products Table
```javascript
{
  id: number,              // Auto-increment primary key
  name: string,            // Product name (Kurdish)
  barcode: string,         // Optional barcode
  price: number,           // Price in IQD
  stock: number,           // Current stock quantity
  searchTerms: array,      // Indexed search terms
  createdAt: string,       // ISO date
  updatedAt: string        // ISO date
}
```

### Sales Table
```javascript
{
  id: number,              // Auto-increment primary key
  date: string,            // ISO date and time
  items: array,            // Array of sold items
  subtotal: number,        // Subtotal amount
  tax: number,             // Tax amount
  total: number            // Total amount
}
```

## Customization

### Changing Store Name
Edit `src/utils/translations.js`:
```javascript
receipt: {
  storeName: 'ناوی کۆمپانیاکەت',
  // ...
}
```

### Adjusting Tax Rate
Edit `src/components/SalesScreen.jsx`:
```javascript
const [taxRate, setTaxRate] = useState(0); // Change 0 to desired percentage
```

### Modifying Low Stock Threshold
Edit `src/services/db.js`:
```javascript
async getLowStockProducts() {
  return await db.products.filter(product => product.stock < 10).toArray();
  // Change 10 to desired threshold
}
```

### Changing Color Scheme
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    // Change these color values
    600: '#2563eb',
    700: '#1d4ed8',
  },
}
```

## Sample Data

The system automatically initializes with sample Kurdish products:
- چای (Tea)
- قاوە (Coffee)
- شیر (Milk)
- نان (Bread)
- پەنیر (Cheese)

Sample data is only added if the database is empty (first run).

## Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Requirements**:
- IndexedDB support
- ES6+ JavaScript support
- Print API support (for receipt printing)

## Offline Capability

This POS system works completely offline:
- All data stored in browser's IndexedDB
- No server or internet connection required
- Data persists between sessions
- Safe from network issues

**Note**: Data is stored per browser/device. Use browser export/import features or implement backup system for data migration.

## Performance

- **Fast Load**: Optimized with Vite
- **Instant Search**: Indexed database queries
- **Smooth UI**: React 18 with optimized rendering
- **Low Memory**: Efficient IndexedDB usage

## Security Considerations

- No user authentication (single-user system)
- Data stored locally in browser
- No cloud synchronization
- Suitable for single-device, trusted environment

For multi-user or networked setup, additional authentication and backend would be needed.

## Future Enhancements

Potential features to add:
- [ ] Export sales data to Excel/CSV
- [ ] Product categories
- [ ] Customer management
- [ ] Discount and promotions
- [ ] Multiple payment methods
- [ ] Employee tracking
- [ ] Barcode scanner integration
- [ ] Cloud backup option
- [ ] Multi-language support (English, Arabic)

## Contributing

This is a production-ready POS system. Feel free to fork and customize for your needs.

## License

Open source for educational and commercial use.

## Support

For issues or questions, please refer to the code comments or create an issue in the repository.

---

**Built with ❤️ for Kurdish businesses**

سیستەمێکی تایبەت بۆ بازرگانە کوردییەکان
