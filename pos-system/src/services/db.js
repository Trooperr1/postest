import Dexie from 'dexie';

// Initialize IndexedDB database using Dexie
export const db = new Dexie('POSDatabase');

// Define database schema
db.version(1).stores({
  products: '++id, name, barcode, price, stock, *searchTerms', // Products table
  sales: '++id, date, total, items', // Sales transactions table
});

// Product model methods
export const productService = {
  // Add a new product
  async addProduct(product) {
    try {
      const searchTerms = [
        product.name.toLowerCase(),
        product.barcode?.toLowerCase() || '',
      ];

      const id = await db.products.add({
        ...product,
        searchTerms,
        createdAt: new Date().toISOString(),
      });

      return id;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  // Update an existing product
  async updateProduct(id, updates) {
    try {
      const searchTerms = [
        updates.name?.toLowerCase() || '',
        updates.barcode?.toLowerCase() || '',
      ];

      await db.products.update(id, {
        ...updates,
        searchTerms,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete a product
  async deleteProduct(id) {
    try {
      await db.products.delete(id);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Get all products
  async getAllProducts() {
    try {
      return await db.products.toArray();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Search products by name or barcode
  async searchProducts(query) {
    try {
      const searchTerm = query.toLowerCase();

      return await db.products
        .filter(product =>
          product.name.toLowerCase().includes(searchTerm) ||
          (product.barcode && product.barcode.toLowerCase().includes(searchTerm))
        )
        .toArray();
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  // Get product by ID
  async getProductById(id) {
    try {
      return await db.products.get(id);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Update stock quantity
  async updateStock(id, quantity) {
    try {
      const product = await db.products.get(id);
      if (product) {
        await db.products.update(id, {
          stock: product.stock + quantity,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  },

  // Decrease stock on sale
  async decreaseStock(id, quantity) {
    try {
      const product = await db.products.get(id);
      if (product && product.stock >= quantity) {
        await db.products.update(id, {
          stock: product.stock - quantity,
          updatedAt: new Date().toISOString(),
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error decreasing stock:', error);
      throw error;
    }
  },

  // Get low stock products (stock < 10)
  async getLowStockProducts() {
    try {
      return await db.products.filter(product => product.stock < 10).toArray();
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      throw error;
    }
  },
};

// Sales model methods
export const salesService = {
  // Add a new sale transaction
  async addSale(sale) {
    try {
      const saleData = {
        ...sale,
        date: new Date().toISOString(),
      };

      const id = await db.sales.add(saleData);

      // Decrease stock for each item sold
      for (const item of sale.items) {
        await productService.decreaseStock(item.productId, item.quantity);
      }

      return id;
    } catch (error) {
      console.error('Error adding sale:', error);
      throw error;
    }
  },

  // Get all sales
  async getAllSales() {
    try {
      return await db.sales.orderBy('date').reverse().toArray();
    } catch (error) {
      console.error('Error fetching sales:', error);
      throw error;
    }
  },

  // Get sales for a specific date
  async getSalesByDate(date) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      return await db.sales
        .filter(sale => {
          const saleDate = new Date(sale.date);
          return saleDate >= startOfDay && saleDate <= endOfDay;
        })
        .toArray();
    } catch (error) {
      console.error('Error fetching sales by date:', error);
      throw error;
    }
  },

  // Get daily sales summary
  async getDailySalesSummary(date) {
    try {
      const sales = await this.getSalesByDate(date);

      const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
      const totalTransactions = sales.length;
      const totalItems = sales.reduce((sum, sale) =>
        sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
      );

      return {
        date,
        totalSales,
        totalTransactions,
        totalItems,
        sales,
      };
    } catch (error) {
      console.error('Error calculating daily summary:', error);
      throw error;
    }
  },

  // Get sale by ID
  async getSaleById(id) {
    try {
      return await db.sales.get(id);
    } catch (error) {
      console.error('Error fetching sale:', error);
      throw error;
    }
  },
};

// Initialize database with sample data (optional)
export const initializeSampleData = async () => {
  try {
    const productCount = await db.products.count();

    // Only add sample data if database is empty
    if (productCount === 0) {
      const sampleProducts = [
        {
          name: 'چای',
          barcode: '1001',
          price: 5000,
          stock: 50,
          image: '',
        },
        {
          name: 'قاوە',
          barcode: '1002',
          price: 8000,
          stock: 30,
          image: '',
        },
        {
          name: 'شیر',
          barcode: '1003',
          price: 3000,
          stock: 40,
          image: '',
        },
        {
          name: 'نان',
          barcode: '1004',
          price: 2000,
          stock: 100,
          image: '',
        },
        {
          name: 'پەنیر',
          barcode: '1005',
          price: 12000,
          stock: 25,
          image: '',
        },
      ];

      for (const product of sampleProducts) {
        await productService.addProduct(product);
      }

      console.log('Sample data initialized');
    }
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
};
