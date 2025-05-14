
/**
 * Agrovet Dashboard Data Service
 * Handles data persistence using localStorage
 */

// Initial seed data
const initialData = {
  inventory: [
    { id: 1, name: "Animal Feed - Dairy", category: "Feed", quantity: 150, price: 25.50, supplier: "FarmSupplies Ltd", reorderLevel: 30, lastUpdated: "2025-05-10" },
    { id: 2, name: "Antibiotics - Livestock", category: "Medicine", quantity: 75, price: 45.00, supplier: "VetPharma Inc", reorderLevel: 20, lastUpdated: "2025-05-08" },
    { id: 3, name: "Pesticide - General", category: "Crop Care", quantity: 50, price: 35.75, supplier: "AgriChem Co", reorderLevel: 15, lastUpdated: "2025-05-12" },
    { id: 4, name: "Milking Equipment", category: "Equipment", quantity: 10, price: 120.00, supplier: "FarmTech Solutions", reorderLevel: 5, lastUpdated: "2025-05-01" },
    { id: 5, name: "Fertilizer - NPK", category: "Crop Care", quantity: 200, price: 30.25, supplier: "AgriChem Co", reorderLevel: 40, lastUpdated: "2025-05-09" },
    { id: 6, name: "Vitamins - Poultry", category: "Supplements", quantity: 85, price: 18.50, supplier: "VetPharma Inc", reorderLevel: 25, lastUpdated: "2025-05-07" },
    { id: 7, name: "Seeds - Maize", category: "Seeds", quantity: 300, price: 5.75, supplier: "SeedTech", reorderLevel: 50, lastUpdated: "2025-05-05" },
    { id: 8, name: "Dewormers - Cattle", category: "Medicine", quantity: 60, price: 42.00, supplier: "VetPharma Inc", reorderLevel: 20, lastUpdated: "2025-05-11" }
  ],
  customers: [
    { id: 1, name: "John Farmer", phone: "123-456-7890", email: "john@farm.com", address: "Rural Route 5", lastPurchase: "2025-05-09", totalSpent: 1250.75 },
    { id: 2, name: "Sarah Fields", phone: "234-567-8901", email: "sarah@fields.com", address: "County Road 8", lastPurchase: "2025-05-10", totalSpent: 875.50 },
    { id: 3, name: "Green Acres Ltd", phone: "345-678-9012", email: "info@greenacres.com", address: "Farm Valley, Plot 23", lastPurchase: "2025-05-01", totalSpent: 5430.25 },
    { id: 4, name: "Michael Ranch", phone: "456-789-0123", email: "mike@ranch.com", address: "Livestock Lane 12", lastPurchase: "2025-05-08", totalSpent: 2340.00 }
  ],
  sales: [
    { id: 1, date: "2025-05-10", customer: "John Farmer", items: [{ productId: 1, quantity: 5, price: 25.50 }, { productId: 8, quantity: 2, price: 42.00 }], total: 211.50, paymentMethod: "Cash" },
    { id: 2, date: "2025-05-10", customer: "Sarah Fields", items: [{ productId: 3, quantity: 1, price: 35.75 }, { productId: 5, quantity: 3, price: 30.25 }], total: 126.50, paymentMethod: "Credit" },
    { id: 3, date: "2025-05-09", customer: "Green Acres Ltd", items: [{ productId: 2, quantity: 10, price: 45.00 }, { productId: 7, quantity: 20, price: 5.75 }], total: 565.00, paymentMethod: "Bank Transfer" },
    { id: 4, date: "2025-05-08", customer: "Michael Ranch", items: [{ productId: 1, quantity: 8, price: 25.50 }, { productId: 4, quantity: 1, price: 120.00 }], total: 324.00, paymentMethod: "Cash" }
  ]
};

// Initialize data in local storage if not exists
const initializeData = () => {
  if (!localStorage.getItem('agrovetData')) {
    localStorage.setItem('agrovetData', JSON.stringify(initialData));
  }
};

// Get all data
const getAllData = () => {
  return JSON.parse(localStorage.getItem('agrovetData') || '{}');
};

// Save all data
const saveAllData = (data) => {
  localStorage.setItem('agrovetData', JSON.stringify(data));
};

// Inventory Operations
const getInventory = () => {
  const data = getAllData();
  return data.inventory || [];
};

const getInventoryItem = (id) => {
  const inventory = getInventory();
  return inventory.find(item => item.id === Number(id));
};

const addInventoryItem = (item) => {
  const data = getAllData();
  const inventory = data.inventory || [];
  
  // Generate new ID
  const newId = inventory.length > 0 
    ? Math.max(...inventory.map(item => item.id)) + 1 
    : 1;
  
  const newItem = {
    ...item,
    id: newId,
    lastUpdated: new Date().toISOString().split('T')[0]
  };
  
  inventory.push(newItem);
  data.inventory = inventory;
  saveAllData(data);
  return newItem;
};

const updateInventoryItem = (id, updates) => {
  const data = getAllData();
  const inventory = data.inventory || [];
  const index = inventory.findIndex(item => item.id === Number(id));
  
  if (index !== -1) {
    inventory[index] = { 
      ...inventory[index], 
      ...updates,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    data.inventory = inventory;
    saveAllData(data);
    return inventory[index];
  }
  return null;
};

const deleteInventoryItem = (id) => {
  const data = getAllData();
  const inventory = data.inventory || [];
  const index = inventory.findIndex(item => item.id === Number(id));
  
  if (index !== -1) {
    inventory.splice(index, 1);
    data.inventory = inventory;
    saveAllData(data);
    return true;
  }
  return false;
};

// Customer Operations
const getCustomers = () => {
  const data = getAllData();
  return data.customers || [];
};

const getCustomer = (id) => {
  const customers = getCustomers();
  return customers.find(customer => customer.id === Number(id));
};

const addCustomer = (customer) => {
  const data = getAllData();
  const customers = data.customers || [];
  
  const newId = customers.length > 0 
    ? Math.max(...customers.map(c => c.id)) + 1 
    : 1;
  
  const newCustomer = {
    ...customer,
    id: newId,
  };
  
  customers.push(newCustomer);
  data.customers = customers;
  saveAllData(data);
  return newCustomer;
};

const updateCustomer = (id, updates) => {
  const data = getAllData();
  const customers = data.customers || [];
  const index = customers.findIndex(c => c.id === Number(id));
  
  if (index !== -1) {
    customers[index] = { 
      ...customers[index], 
      ...updates
    };
    data.customers = customers;
    saveAllData(data);
    return customers[index];
  }
  return null;
};

const deleteCustomer = (id) => {
  const data = getAllData();
  const customers = data.customers || [];
  const index = customers.findIndex(c => c.id === Number(id));
  
  if (index !== -1) {
    customers.splice(index, 1);
    data.customers = customers;
    saveAllData(data);
    return true;
  }
  return false;
};

// Sales Operations
const getSales = () => {
  const data = getAllData();
  return data.sales || [];
};

const getSale = (id) => {
  const sales = getSales();
  return sales.find(sale => sale.id === Number(id));
};

const addSale = (sale) => {
  const data = getAllData();
  const sales = data.sales || [];
  
  const newId = sales.length > 0 
    ? Math.max(...sales.map(s => s.id)) + 1 
    : 1;
  
  const newSale = {
    ...sale,
    id: newId,
    date: new Date().toISOString().split('T')[0]
  };
  
  // Update inventory quantities
  const inventory = data.inventory || [];
  newSale.items.forEach(item => {
    const inventoryIndex = inventory.findIndex(i => i.id === Number(item.productId));
    if (inventoryIndex !== -1) {
      inventory[inventoryIndex].quantity -= item.quantity;
      inventory[inventoryIndex].lastUpdated = newSale.date;
    }
  });
  
  // Update customer's last purchase and total spent
  const customers = data.customers || [];
  const customerIndex = customers.findIndex(c => c.name === newSale.customer);
  if (customerIndex !== -1) {
    customers[customerIndex].lastPurchase = newSale.date;
    customers[customerIndex].totalSpent = (parseFloat(customers[customerIndex].totalSpent) || 0) + newSale.total;
  }
  
  sales.push(newSale);
  data.sales = sales;
  data.inventory = inventory;
  data.customers = customers;
  saveAllData(data);
  
  return newSale;
};

// Reports
const getInventoryValue = () => {
  const inventory = getInventory();
  return inventory.reduce((total, item) => {
    return total + (item.quantity * item.price);
  }, 0).toFixed(2);
};

const getLowStockItems = () => {
  const inventory = getInventory();
  return inventory.filter(item => item.quantity <= item.reorderLevel);
};

const getSalesByDate = (startDate, endDate) => {
  const sales = getSales();
  return sales.filter(sale => {
    const saleDate = new Date(sale.date);
    return (!startDate || saleDate >= new Date(startDate)) && 
           (!endDate || saleDate <= new Date(endDate));
  });
};

const getTopSellingProducts = (limit = 5) => {
  const sales = getSales();
  const inventory = getInventory();
  
  // Aggregate quantities sold by product ID
  const productSales = {};
  sales.forEach(sale => {
    sale.items.forEach(item => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = {
          productId: item.productId,
          totalQuantity: 0,
          totalValue: 0
        };
      }
      productSales[item.productId].totalQuantity += item.quantity;
      productSales[item.productId].totalValue += item.quantity * item.price;
    });
  });
  
  // Convert to array and enrich with product names
  const productSalesArray = Object.values(productSales).map(sale => {
    const product = inventory.find(item => item.id === sale.productId);
    return {
      ...sale,
      name: product ? product.name : 'Unknown Product'
    };
  });
  
  // Sort by quantity and limit
  return productSalesArray
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, limit);
};

// Export all methods
const dataService = {
  initializeData,
  getInventory,
  getInventoryItem,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getCustomers,
  getCustomer,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getSales,
  getSale,
  addSale,
  getInventoryValue,
  getLowStockItems,
  getSalesByDate,
  getTopSellingProducts
};

export default dataService;
