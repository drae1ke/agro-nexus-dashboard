
/**
 * Data Service for AgroVet Dashboard
 * Handles local storage operations and data management
 */
const dataService = {
  /**
   * Initialize default data if storage is empty
   */
  initializeData() {
    // Check if data exists in local storage
    if (!localStorage.getItem('agrovet_inventory')) {
      // Set up initial inventory data
      const initialInventory = [
        {
          id: 1,
          name: "Cattle Feed - Premium",
          category: "Animal Feed",
          sku: "CF001",
          price: 45.99,
          quantity: 350,
          minStock: 100,
          description: "High quality cattle feed with added nutrients and minerals."
        },
        {
          id: 2,
          name: "Poultry Vaccine - NCD",
          category: "Vaccines",
          sku: "PV002",
          price: 75.50,
          quantity: 48,
          minStock: 50,
          description: "Newcastle disease vaccine for poultry."
        },
        {
          id: 3,
          name: "Dairy Cattle Supplement",
          category: "Supplements",
          sku: "DCS003",
          price: 62.75,
          quantity: 85,
          minStock: 30,
          description: "Mineral and vitamin supplement for dairy cattle."
        },
        {
          id: 4,
          name: "Tick Control Spray",
          category: "Parasiticides",
          sku: "TCS004",
          price: 29.99,
          quantity: 120,
          minStock: 40,
          description: "Effective tick control spray for cattle and goats."
        },
        {
          id: 5,
          name: "Poultry Feed - Layers",
          category: "Animal Feed",
          sku: "PF005",
          price: 38.50,
          quantity: 275,
          minStock: 100,
          description: "High protein feed formulated for egg-laying chickens."
        },
        {
          id: 6,
          name: "Cattle Dewormer",
          category: "Parasiticides",
          sku: "CD006",
          price: 18.25,
          quantity: 15,
          minStock: 30,
          description: "Broad spectrum dewormer for cattle."
        },
        {
          id: 7,
          name: "Pig Growth Enhancer",
          category: "Supplements",
          sku: "PGE007",
          price: 53.99,
          quantity: 42,
          minStock: 25,
          description: "Growth supplement for pigs to improve weight gain."
        },
        {
          id: 8,
          name: "Mastitis Treatment Kit",
          category: "Medications",
          sku: "MTK008",
          price: 85.00,
          quantity: 0,
          minStock: 10,
          description: "Complete kit for treatment and management of bovine mastitis."
        }
      ];
      localStorage.setItem('agrovet_inventory', JSON.stringify(initialInventory));

      // Set up initial customers data
      const initialCustomers = [
        {
          id: 1,
          name: "John Farmer",
          phone: "+254-712-345-678",
          email: "john.farmer@example.com",
          address: "Nakuru County, Kenya",
          lastPurchase: "2023-05-10",
          totalSpent: 1250.75
        },
        {
          id: 2,
          name: "Sarah Dairy",
          phone: "+254-723-456-789",
          email: "sarah.dairy@example.com",
          address: "Kiambu County, Kenya",
          lastPurchase: "2023-05-08",
          totalSpent: 875.50
        },
        {
          id: 3,
          name: "Michael Poultry",
          phone: "+254-734-567-890",
          email: "michael.poultry@example.com",
          address: "Nyeri County, Kenya",
          lastPurchase: "2023-05-15",
          totalSpent: 2340.00
        },
        {
          id: 4,
          name: "Elizabeth Ranch",
          phone: "+254-745-678-901",
          email: "elizabeth.ranch@example.com",
          address: "Laikipia County, Kenya",
          lastPurchase: "2023-05-12",
          totalSpent: 4500.25
        },
        {
          id: 5,
          name: "Robert Grains",
          phone: "+254-756-789-012",
          email: "robert.grains@example.com",
          address: "Uasin Gishu County, Kenya",
          lastPurchase: "2023-05-05",
          totalSpent: 950.00
        }
      ];
      localStorage.setItem('agrovet_customers', JSON.stringify(initialCustomers));

      // Set up initial sales data
      const initialSales = [
        {
          id: 1,
          date: "2023-05-15",
          customer: "John Farmer",
          items: [
            { productId: 1, quantity: 3, price: 45.99 },
            { productId: 4, quantity: 2, price: 29.99 }
          ],
          total: 187.95,
          status: "Completed"
        },
        {
          id: 2,
          date: "2023-05-14",
          customer: "Sarah Dairy",
          items: [
            { productId: 3, quantity: 5, price: 62.75 },
            { productId: 6, quantity: 2, price: 18.25 }
          ],
          total: 350.25,
          status: "Completed"
        },
        {
          id: 3,
          date: "2023-05-14",
          customer: "Michael Poultry",
          items: [
            { productId: 2, quantity: 10, price: 75.50 },
            { productId: 5, quantity: 8, price: 38.50 }
          ],
          total: 1063.00,
          status: "Completed"
        },
        {
          id: 4,
          date: "2023-05-12",
          customer: "Elizabeth Ranch",
          items: [
            { productId: 1, quantity: 15, price: 45.99 },
            { productId: 3, quantity: 8, price: 62.75 },
            { productId: 4, quantity: 5, price: 29.99 }
          ],
          total: 1193.60,
          status: "Completed"
        },
        {
          id: 5,
          date: "2023-05-10",
          customer: "Robert Grains",
          items: [
            { productId: 7, quantity: 4, price: 53.99 }
          ],
          total: 215.96,
          status: "Completed"
        },
        {
          id: 6,
          date: "2023-05-09",
          customer: "John Farmer",
          items: [
            { productId: 6, quantity: 3, price: 18.25 },
            { productId: 4, quantity: 2, price: 29.99 }
          ],
          total: 114.73,
          status: "Completed"
        },
        {
          id: 7,
          date: "2023-05-08",
          customer: "Sarah Dairy",
          items: [
            { productId: 3, quantity: 3, price: 62.75 },
          ],
          total: 188.25,
          status: "Completed"
        }
      ];
      localStorage.setItem('agrovet_sales', JSON.stringify(initialSales));
    }
  },

  /**
   * Get all inventory items
   * @returns {Array} Inventory items
   */
  getInventory() {
    return JSON.parse(localStorage.getItem('agrovet_inventory') || '[]');
  },

  /**
   * Get inventory item by ID
   * @param {number} id The item ID
   * @returns {Object|null} The inventory item or null if not found
   */
  getInventoryItemById(id) {
    const inventory = this.getInventory();
    return inventory.find(item => item.id === parseInt(id)) || null;
  },

  /**
   * Add new inventory item
   * @param {Object} item The inventory item to add
   * @returns {Object} The added item with ID
   */
  addInventoryItem(item) {
    const inventory = this.getInventory();
    const newId = inventory.length > 0 ? Math.max(...inventory.map(i => i.id)) + 1 : 1;
    
    const newItem = {
      id: newId,
      ...item
    };
    
    inventory.push(newItem);
    localStorage.setItem('agrovet_inventory', JSON.stringify(inventory));
    return newItem;
  },

  /**
   * Update inventory item
   * @param {number} id The item ID to update
   * @param {Object} updatedItem The updated item data
   * @returns {boolean} Success indicator
   */
  updateInventoryItem(id, updatedItem) {
    const inventory = this.getInventory();
    const index = inventory.findIndex(item => item.id === parseInt(id));
    
    if (index === -1) {
      return false;
    }
    
    inventory[index] = { ...inventory[index], ...updatedItem };
    localStorage.setItem('agrovet_inventory', JSON.stringify(inventory));
    return true;
  },

  /**
   * Delete inventory item
   * @param {number} id The item ID to delete
   * @returns {boolean} Success indicator
   */
  deleteInventoryItem(id) {
    const inventory = this.getInventory();
    const filteredInventory = inventory.filter(item => item.id !== parseInt(id));
    
    if (filteredInventory.length === inventory.length) {
      return false;
    }
    
    localStorage.setItem('agrovet_inventory', JSON.stringify(filteredInventory));
    return true;
  },

  /**
   * Get low stock items
   * @returns {Array} Low stock items
   */
  getLowStockItems() {
    const inventory = this.getInventory();
    return inventory.filter(item => item.quantity <= item.minStock);
  },

  /**
   * Calculate total inventory value
   * @returns {number} Total inventory value
   */
  getInventoryValue() {
    const inventory = this.getInventory();
    return inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  },

  /**
   * Get all customers
   * @returns {Array} Customers
   */
  getCustomers() {
    return JSON.parse(localStorage.getItem('agrovet_customers') || '[]');
  },

  /**
   * Get customer by ID
   * @param {number} id The customer ID
   * @returns {Object|null} The customer or null if not found
   */
  getCustomerById(id) {
    const customers = this.getCustomers();
    return customers.find(customer => customer.id === parseInt(id)) || null;
  },

  /**
   * Add new customer
   * @param {Object} customer The customer to add
   * @returns {Object} The added customer with ID
   */
  addCustomer(customer) {
    const customers = this.getCustomers();
    const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    
    const newCustomer = {
      id: newId,
      ...customer
    };
    
    customers.push(newCustomer);
    localStorage.setItem('agrovet_customers', JSON.stringify(customers));
    return newCustomer;
  },

  /**
   * Update customer
   * @param {number} id The customer ID to update
   * @param {Object} updatedCustomer The updated customer data
   * @returns {boolean} Success indicator
   */
  updateCustomer(id, updatedCustomer) {
    const customers = this.getCustomers();
    const index = customers.findIndex(customer => customer.id === parseInt(id));
    
    if (index === -1) {
      return false;
    }
    
    customers[index] = { ...customers[index], ...updatedCustomer };
    localStorage.setItem('agrovet_customers', JSON.stringify(customers));
    return true;
  },

  /**
   * Delete customer
   * @param {number} id The customer ID to delete
   * @returns {boolean} Success indicator
   */
  deleteCustomer(id) {
    const customers = this.getCustomers();
    const filteredCustomers = customers.filter(customer => customer.id !== parseInt(id));
    
    if (filteredCustomers.length === customers.length) {
      return false;
    }
    
    localStorage.setItem('agrovet_customers', JSON.stringify(filteredCustomers));
    return true;
  },

  /**
   * Get all sales
   * @returns {Array} Sales
   */
  getSales() {
    return JSON.parse(localStorage.getItem('agrovet_sales') || '[]');
  },

  /**
   * Get sale by ID
   * @param {number} id The sale ID
   * @returns {Object|null} The sale or null if not found
   */
  getSaleById(id) {
    const sales = this.getSales();
    return sales.find(sale => sale.id === parseInt(id)) || null;
  },

  /**
   * Add new sale
   * @param {Object} sale The sale to add
   * @returns {Object} The added sale with ID
   */
  addSale(sale) {
    const sales = this.getSales();
    const newId = sales.length > 0 ? Math.max(...sales.map(s => s.id)) + 1 : 1;
    
    const newSale = {
      id: newId,
      date: new Date().toISOString().split('T')[0],
      ...sale
    };
    
    sales.push(newSale);
    localStorage.setItem('agrovet_sales', JSON.stringify(sales));
    
    // Update inventory quantities
    this.updateInventoryAfterSale(newSale.items);
    
    return newSale;
  },

  /**
   * Update inventory after a sale
   * @param {Array} items Sale items
   */
  updateInventoryAfterSale(items) {
    const inventory = this.getInventory();
    
    items.forEach(item => {
      const inventoryItem = inventory.find(i => i.id === item.productId);
      if (inventoryItem) {
        inventoryItem.quantity -= item.quantity;
      }
    });
    
    localStorage.setItem('agrovet_inventory', JSON.stringify(inventory));
  },

  /**
   * Get top selling products
   * @param {number} limit Number of products to return
   * @returns {Array} Top selling products
   */
  getTopSellingProducts(limit = 5) {
    const sales = this.getSales();
    const inventory = this.getInventory();
    
    // Aggregate product quantities from all sales
    const productSales = {};
    
    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = 0;
        }
        productSales[item.productId] += item.quantity;
      });
    });
    
    // Map to product objects
    const products = Object.entries(productSales).map(([productId, totalQuantity]) => {
      const product = inventory.find(p => p.id === parseInt(productId)) || { name: 'Unknown Product' };
      return {
        id: parseInt(productId),
        name: product.name,
        totalQuantity
      };
    });
    
    // Sort by quantity sold and limit
    return products.sort((a, b) => b.totalQuantity - a.totalQuantity).slice(0, limit);
  },

  /**
   * Get sales by date range
   * @param {string} startDate Start date in YYYY-MM-DD format
   * @param {string} endDate End date in YYYY-MM-DD format
   * @returns {Array} Sales in date range
   */
  getSalesByDateRange(startDate, endDate) {
    const sales = this.getSales();
    return sales.filter(sale => {
      return sale.date >= startDate && sale.date <= endDate;
    });
  }
};
