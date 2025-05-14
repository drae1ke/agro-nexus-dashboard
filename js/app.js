
/**
 * Main App for AgroVet Dashboard
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the app
  const app = new AgrovetApp();
  app.init();
});

class AgrovetApp {
  constructor() {
    this.currentPage = 'dashboard';
    this.pages = {
      dashboard: DashboardPage,
      inventory: InventoryPage,
      customers: CustomersPage,
      sales: SalesPage,
      reports: ReportsPage
    };
    this.currentPageInstance = null;
  }
  
  init() {
    // Initialize data
    dataService.initializeData();
    
    // Create layout
    this.createLayout();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Load default page
    this.loadPage(this.currentPage);
  }
  
  createLayout() {
    const appContainer = document.getElementById('app');
    
    // Create main layout structure
    appContainer.innerHTML = `
      <div class="app-container">
        <aside class="sidebar">
          <div class="sidebar-header">
            <div class="logo-container">
              <div class="logo">A</div>
              <div class="logo-text">
                <h1>AgroVet</h1>
                <p>Management System</p>
              </div>
            </div>
          </div>
          
          <div class="sidebar-nav">
            <ul class="nav-list">
              <li class="nav-item">
                <a href="#" class="nav-link active" data-page="dashboard">
                  <i class="fa-solid fa-chart-line"></i>
                  <span>Dashboard</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link" data-page="inventory">
                  <i class="fa-solid fa-box"></i>
                  <span>Inventory</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link" data-page="customers">
                  <i class="fa-solid fa-users"></i>
                  <span>Customers</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link" data-page="sales">
                  <i class="fa-solid fa-coins"></i>
                  <span>Sales</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link" data-page="reports">
                  <i class="fa-solid fa-chart-bar"></i>
                  <span>Reports</span>
                </a>
              </li>
            </ul>
          </div>
          
          <div class="sidebar-footer">
            <div class="user-info">
              <div class="user-avatar">
                <i class="fa-solid fa-user"></i>
              </div>
              <div class="user-details">
                <p>Admin User</p>
                <p>admin@agrovet.com</p>
              </div>
            </div>
          </div>
        </aside>
        
        <main class="main-content" id="main-content">
          <!-- Page content will be loaded here -->
        </main>
      </div>
    `;
  }
  
  setupEventListeners() {
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.currentTarget.dataset.page;
        this.loadPage(page);
      });
    });
  }
  
  loadPage(page) {
    this.currentPage = page;
    
    // Update active navigation link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      if (link.dataset.page === page) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
    
    // Create page instance and render
    const mainContent = document.getElementById('main-content');
    
    // Clear current content
    mainContent.innerHTML = '';
    
    // Load the selected page
    if (this.pages[page]) {
      this.currentPageInstance = new this.pages[page](mainContent);
      this.currentPageInstance.render();
    }
  }
}

/**
 * Dashboard Page
 */
class DashboardPage {
  constructor(container) {
    this.container = container;
  }
  
  render() {
    const inventoryValue = dataService.getInventoryValue();
    const lowStockItems = dataService.getLowStockItems();
    const sales = dataService.getSales();
    const recentSales = sales.slice(-5).reverse();
    const topProducts = dataService.getTopSellingProducts(5);
    const customers = dataService.getCustomers();
    
    // Format date for display
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);
    
    this.container.innerHTML = `
      <div class="page-header">
        <h1>Dashboard Overview</h1>
        <p>${formattedDate}</p>
      </div>
      
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon inventory-icon">
              <i class="fa-solid fa-box"></i>
            </div>
            <h3 class="stat-title">Inventory Value</h3>
          </div>
          <p class="stat-value">$${inventoryValue}</p>
          <div class="stat-change">
            <span class="change-up"><i class="fa-solid fa-arrow-up"></i> 12%</span>
            <span class="change-text">from last month</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon lowstock-icon">
              <i class="fa-solid fa-exclamation-triangle"></i>
            </div>
            <h3 class="stat-title">Low Stock Items</h3>
          </div>
          <p class="stat-value">${lowStockItems.length}</p>
          <div class="stat-change">
            <span class="change-text">Needs attention</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon customers-icon">
              <i class="fa-solid fa-users"></i>
            </div>
            <h3 class="stat-title">Total Customers</h3>
          </div>
          <p class="stat-value">${customers.length}</p>
          <div class="stat-change">
            <span class="change-up"><i class="fa-solid fa-plus"></i> 2</span>
            <span class="change-text">this week</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon sales-icon">
              <i class="fa-solid fa-coins"></i>
            </div>
            <h3 class="stat-title">Total Sales</h3>
          </div>
          <p class="stat-value">${sales.length}</p>
          <div class="stat-change">
            <span class="change-up"><i class="fa-solid fa-arrow-up"></i> 5%</span>
            <span class="change-text">from last week</span>
          </div>
        </div>
      </div>
      
      <!-- Charts -->
      <div class="charts-grid">
        <div class="chart-card">
          <h3 class="chart-header">Sales Activity</h3>
          <div class="chart-container" id="sales-chart">
            <div class="simple-bar-chart">
              <div class="chart-bar" style="height: 40%"><span class="chart-label">Mon</span></div>
              <div class="chart-bar" style="height: 65%"><span class="chart-label">Tue</span></div>
              <div class="chart-bar" style="height: 45%"><span class="chart-label">Wed</span></div>
              <div class="chart-bar" style="height: 80%"><span class="chart-label">Thu</span></div>
              <div class="chart-bar" style="height: 60%"><span class="chart-label">Fri</span></div>
              <div class="chart-bar" style="height: 30%"><span class="chart-label">Sat</span></div>
              <div class="chart-bar" style="height: 20%"><span class="chart-label">Sun</span></div>
            </div>
          </div>
        </div>
        
        <div class="chart-card">
          <h3 class="chart-header">Stock Categories</h3>
          <div class="chart-container" id="categories-chart">
            ${this.renderCategoryChart()}
          </div>
        </div>
      </div>
      
      <!-- Tables -->
      <div class="tables-grid">
        <div class="table-card">
          <div class="table-header">
            <h3 class="table-title">Recent Sales</h3>
            <a href="#" class="table-link" data-page="sales">View All</a>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Date</th>
                  <th class="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${recentSales.map(sale => `
                  <tr>
                    <td>${sale.customer}</td>
                    <td>${sale.date}</td>
                    <td class="text-right">$${sale.total.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="table-card">
          <div class="table-header">
            <h3 class="table-title">Top Selling Products</h3>
            <a href="#" class="table-link" data-page="reports">View Report</a>
          </div>
          <div class="product-ranking-list">
            ${topProducts.map((product, index) => {
              const percentage = Math.min(product.totalQuantity * 5, 100);
              return `
                <div class="product-ranking">
                  <div class="rank-number">${index + 1}</div>
                  <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-progress-bg">
                      <div class="product-progress" style="width: ${percentage}%"></div>
                    </div>
                  </div>
                  <div class="product-units">${product.totalQuantity} units</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
    
    // Add event listeners for page links
    const pageLinks = this.container.querySelectorAll('[data-page]');
    pageLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.currentTarget.dataset.page;
        document.querySelector(`.nav-link[data-page="${page}"]`).click();
      });
    });
  }
  
  renderCategoryChart() {
    // Calculate category distribution
    const inventory = dataService.getInventory();
    const categories = {};
    
    inventory.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = 0;
      }
      categories[item.category] += item.quantity;
    });
    
    const totalItems = Object.values(categories).reduce((sum, val) => sum + val, 0);
    const categoryData = Object.entries(categories).map(([name, count]) => ({
      name,
      percentage: Math.round((count / totalItems) * 100)
    }));
    
    return `
      <div class="category-chart">
        ${categoryData.map(cat => `
          <div class="category-item">
            <div class="category-header">
              <span class="category-name">${cat.name}</span>
              <span class="category-percentage">${cat.percentage}%</span>
            </div>
            <div class="category-bar-bg">
              <div class="category-bar" style="width: ${cat.percentage}%"></div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

/**
 * Inventory Page
 */
class InventoryPage {
  constructor(container) {
    this.container = container;
    this.inventory = [];
    this.filteredInventory = [];
    this.searchTerm = '';
    this.categoryFilter = 'all';
    this.stockFilter = 'all';
  }
  
  render() {
    // Load inventory data
    this.inventory = dataService.getInventory();
    this.applyFilters();
    
    // Create unique categories list for filter
    const categories = [...new Set(this.inventory.map(item => item.category))];
    
    this.container.innerHTML = `
      <div class="page-header">
        <h1>Inventory Management</h1>
        <p>Manage your products and stock levels</p>
      </div>
      
      <div class="page-actions">
        <div class="search-bar">
          <i class="fa-solid fa-search search-icon"></i>
          <input type="text" id="inventory-search" class="search-input" placeholder="Search inventory...">
        </div>
        
        <div class="filter-container">
          <span class="filter-label">Category:</span>
          <select id="category-filter" class="filter-select">
            <option value="all">All Categories</option>
            ${categories.map(category => `<option value="${category}">${category}</option>`).join('')}
          </select>
          
          <span class="filter-label">Stock:</span>
          <select id="stock-filter" class="filter-select">
            <option value="all">All</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>
        
        <button id="add-product-btn" class="button primary-button">
          <i class="fa-solid fa-plus"></i> Add Product
        </button>
      </div>
      
      <div class="table-card">
        <table class="inventory-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Value</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody id="inventory-table-body">
            ${this.renderInventoryRows()}
          </tbody>
        </table>
        <div id="empty-inventory-message" class="${this.filteredInventory.length > 0 ? 'hidden' : ''}">
          <p class="text-center p-4 text-muted">No products match your search criteria.</p>
        </div>
      </div>
      
      <!-- Add/Edit Product Modal -->
      <div id="product-modal" class="modal-overlay hidden">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title" id="modal-title">Add New Product</h3>
            <button class="modal-close" id="close-modal-btn">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <form id="product-form">
              <input type="hidden" id="product-id">
              <div class="form-grid">
                <div class="form-group full-width">
                  <label class="form-label" for="product-name">Product Name</label>
                  <input type="text" id="product-name" class="form-input" required>
                </div>
                
                <div class="form-group">
                  <label class="form-label" for="product-category">Category</label>
                  <select id="product-category" class="form-select">
                    ${categories.map(category => `<option value="${category}">${category}</option>`).join('')}
                    <option value="new">+ Add New Category</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label class="form-label" for="product-sku">SKU</label>
                  <input type="text" id="product-sku" class="form-input" required>
                </div>
                
                <div class="form-group">
                  <label class="form-label" for="product-price">Price ($)</label>
                  <input type="number" id="product-price" class="form-input" step="0.01" min="0" required>
                </div>
                
                <div class="form-group">
                  <label class="form-label" for="product-quantity">Quantity</label>
                  <input type="number" id="product-quantity" class="form-input" min="0" required>
                </div>
                
                <div class="form-group">
                  <label class="form-label" for="product-min-stock">Min. Stock Level</label>
                  <input type="number" id="product-min-stock" class="form-input" min="0" required>
                </div>
                
                <div class="form-group full-width">
                  <label class="form-label" for="product-description">Description</label>
                  <textarea id="product-description" class="form-input" rows="3"></textarea>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button id="cancel-product-btn" class="button secondary-button">Cancel</button>
            <button id="save-product-btn" class="button primary-button">Save Product</button>
          </div>
        </div>
      </div>
      
      <!-- Delete Confirmation Modal -->
      <div id="delete-confirm-modal" class="modal-overlay hidden">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">Delete Product</h3>
            <button class="modal-close" id="close-delete-modal-btn">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this product? This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button id="cancel-delete-btn" class="button secondary-button">Cancel</button>
            <button id="confirm-delete-btn" class="button danger-button">Delete Product</button>
          </div>
        </div>
      </div>
    `;
    
    this.setupEventListeners();
  }
  
  renderInventoryRows() {
    if (this.filteredInventory.length === 0) {
      return '';
    }
    
    return this.filteredInventory.map(item => {
      let stockStatus = '';
      let stockClass = '';
      
      if (item.quantity === 0) {
        stockStatus = 'Out of Stock';
        stockClass = 'out-of-stock';
      } else if (item.quantity <= item.minStock) {
        stockStatus = 'Low Stock';
        stockClass = 'low-stock';
      } else {
        stockStatus = 'In Stock';
        stockClass = 'in-stock';
      }
      
      return `
        <tr data-id="${item.id}">
          <td>
            <div class="product-cell">
              <div class="product-image">
                <i class="fa-solid fa-box"></i>
              </div>
              <div>
                <div class="product-name-cell">${item.name}</div>
                <div class="product-code">ID: ${item.id.toString().padStart(4, '0')}</div>
              </div>
            </div>
          </td>
          <td>${item.category}</td>
          <td>${item.sku}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td>
            <span class="stock-badge ${stockClass}">
              ${stockStatus} (${item.quantity})
            </span>
          </td>
          <td>$${(item.price * item.quantity).toFixed(2)}</td>
          <td class="action-buttons">
            <button class="action-button edit-button" data-id="${item.id}">
              <i class="fa-solid fa-edit"></i>
            </button>
            <button class="action-button delete-button" data-id="${item.id}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }
  
  applyFilters() {
    this.filteredInventory = this.inventory.filter(item => {
      // Apply search filter
      if (this.searchTerm && !item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) && 
          !item.sku.toLowerCase().includes(this.searchTerm.toLowerCase())) {
        return false;
      }
      
      // Apply category filter
      if (this.categoryFilter !== 'all' && item.category !== this.categoryFilter) {
        return false;
      }
      
      // Apply stock filter
      if (this.stockFilter === 'in-stock' && (item.quantity <= item.minStock || item.quantity === 0)) {
        return false;
      } else if (this.stockFilter === 'low-stock' && (item.quantity > item.minStock || item.quantity === 0)) {
        return false;
      } else if (this.stockFilter === 'out-of-stock' && item.quantity !== 0) {
        return false;
      }
      
      return true;
    });
  }
  
  setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('inventory-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.toLowerCase();
        this.applyFilters();
        this.updateTable();
      });
    }
    
    // Category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', (e) => {
        this.categoryFilter = e.target.value;
        this.applyFilters();
        this.updateTable();
      });
    }
    
    // Stock filter
    const stockFilter = document.getElementById('stock-filter');
    if (stockFilter) {
      stockFilter.addEventListener('change', (e) => {
        this.stockFilter = e.target.value;
        this.applyFilters();
        this.updateTable();
      });
    }
    
    // Add product button
    const addProductBtn = document.getElementById('add-product-btn');
    if (addProductBtn) {
      addProductBtn.addEventListener('click', () => {
        this.openProductModal();
      });
    }
    
    // Close modal buttons
    const closeModalBtn = document.getElementById('close-modal-btn');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        this.closeProductModal();
      });
    }
    
    const cancelProductBtn = document.getElementById('cancel-product-btn');
    if (cancelProductBtn) {
      cancelProductBtn.addEventListener('click', () => {
        this.closeProductModal();
      });
    }
    
    // Save product button
    const saveProductBtn = document.getElementById('save-product-btn');
    if (saveProductBtn) {
      saveProductBtn.addEventListener('click', () => {
        this.saveProduct();
      });
    }
    
    // Close delete modal buttons
    const closeDeleteModalBtn = document.getElementById('close-delete-modal-btn');
    if (closeDeleteModalBtn) {
      closeDeleteModalBtn.addEventListener('click', () => {
        this.closeDeleteModal();
      });
    }
    
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    if (cancelDeleteBtn) {
      cancelDeleteBtn.addEventListener('click', () => {
        this.closeDeleteModal();
      });
    }
    
    // Confirm delete button
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener('click', () => {
        this.deleteProduct();
      });
    }
    
    // Setup row action buttons
    this.setupRowEventListeners();
  }
  
  setupRowEventListeners() {
    // Edit buttons
    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        this.editProduct(id);
      });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        this.openDeleteModal(id);
      });
    });
  }
  
  updateTable() {
    const tableBody = document.getElementById('inventory-table-body');
    const emptyMessage = document.getElementById('empty-inventory-message');
    
    tableBody.innerHTML = this.renderInventoryRows();
    
    if (this.filteredInventory.length === 0) {
      emptyMessage.classList.remove('hidden');
    } else {
      emptyMessage.classList.add('hidden');
    }
    
    this.setupRowEventListeners();
  }
  
  openProductModal(product = null) {
    const modal = document.getElementById('product-modal');
    const form = document.getElementById('product-form');
    const title = document.getElementById('modal-title');
    
    // Reset form
    form.reset();
    
    if (product) {
      // Edit mode
      title.textContent = 'Edit Product';
      document.getElementById('product-id').value = product.id;
      document.getElementById('product-name').value = product.name;
      document.getElementById('product-category').value = product.category;
      document.getElementById('product-sku').value = product.sku;
      document.getElementById('product-price').value = product.price;
      document.getElementById('product-quantity').value = product.quantity;
      document.getElementById('product-min-stock').value = product.minStock;
      document.getElementById('product-description').value = product.description;
    } else {
      // Add mode
      title.textContent = 'Add New Product';
      document.getElementById('product-id').value = '';
    }
    
    modal.classList.remove('hidden');
  }
  
  closeProductModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.add('hidden');
  }
  
  openDeleteModal(id) {
    const modal = document.getElementById('delete-confirm-modal');
    modal.classList.remove('hidden');
    
    const confirmButton = document.getElementById('confirm-delete-btn');
    confirmButton.dataset.id = id;
  }
  
  closeDeleteModal() {
    const modal = document.getElementById('delete-confirm-modal');
    modal.classList.add('hidden');
  }
  
  saveProduct() {
    // Collect form data
    const id = document.getElementById('product-id').value;
    const productData = {
      name: document.getElementById('product-name').value,
      category: document.getElementById('product-category').value,
      sku: document.getElementById('product-sku').value,
      price: parseFloat(document.getElementById('product-price').value),
      quantity: parseInt(document.getElementById('product-quantity').value),
      minStock: parseInt(document.getElementById('product-min-stock').value),
      description: document.getElementById('product-description').value
    };
    
    // Validate form
    if (!productData.name || !productData.category || !productData.sku) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Handle new category option
    if (productData.category === 'new') {
      const newCategory = prompt('Enter new category name:');
      if (!newCategory) {
        return;
      }
      productData.category = newCategory;
    }
    
    try {
      if (id) {
        // Update existing product
        dataService.updateInventoryItem(id, productData);
      } else {
        // Add new product
        dataService.addInventoryItem(productData);
      }
      
      // Reload data and refresh table
      this.inventory = dataService.getInventory();
      this.applyFilters();
      this.updateTable();
      this.closeProductModal();
      
      // Show success message
      alert(id ? 'Product updated successfully!' : 'Product added successfully!');
    } catch (error) {
      alert('Error saving product: ' + error.message);
    }
  }
  
  editProduct(id) {
    const product = dataService.getInventoryItemById(id);
    if (product) {
      this.openProductModal(product);
    }
  }
  
  deleteProduct() {
    const confirmButton = document.getElementById('confirm-delete-btn');
    const id = confirmButton.dataset.id;
    
    try {
      dataService.deleteInventoryItem(id);
      
      // Reload data and refresh table
      this.inventory = dataService.getInventory();
      this.applyFilters();
      this.updateTable();
      this.closeDeleteModal();
      
      // Show success message
      alert('Product deleted successfully!');
    } catch (error) {
      alert('Error deleting product: ' + error.message);
    }
  }
}

/**
 * Customers Page
 */
class CustomersPage {
  constructor(container) {
    this.container = container;
    this.customers = [];
    this.filteredCustomers = [];
    this.searchTerm = '';
  }
  
  render() {
    // Load customers data
    this.customers = dataService.getCustomers();
    this.applyFilters();
    
    this.container.innerHTML = `
      <div class="page-header">
        <h1>Customer Management</h1>
        <p>View and manage your customer database</p>
      </div>
      
      <div class="page-actions">
        <div class="search-bar">
          <i class="fa-solid fa-search search-icon"></i>
          <input type="text" id="customer-search" class="search-input" placeholder="Search customers...">
        </div>
        
        <button id="add-customer-btn" class="button primary-button">
          <i class="fa-solid fa-plus"></i> Add Customer
        </button>
      </div>
      
      <div class="table-card">
        <table class="inventory-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact Details</th>
              <th>Last Purchase</th>
              <th>Total Spent</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody id="customers-table-body">
            ${this.renderCustomerRows()}
          </tbody>
        </table>
        <div id="empty-customers-message" class="${this.filteredCustomers.length > 0 ? 'hidden' : ''}">
          <p class="text-center p-4 text-muted">No customers match your search criteria.</p>
        </div>
      </div>
      
      <!-- Add/Edit Customer Modal -->
      <div id="customer-modal" class="modal-overlay hidden">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title" id="customer-modal-title">Add New Customer</h3>
            <button class="modal-close" id="close-customer-modal-btn">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <form id="customer-form">
              <input type="hidden" id="customer-id">
              <div class="form-grid">
                <div class="form-group full-width">
                  <label class="form-label" for="customer-name">Customer Name</label>
                  <input type="text" id="customer-name" class="form-input" required>
                </div>
                
                <div class="form-group">
                  <label class="form-label" for="customer-phone">Phone Number</label>
                  <input type="text" id="customer-phone" class="form-input" required>
                </div>
                
                <div class="form-group">
                  <label class="form-label" for="customer-email">Email Address</label>
                  <input type="email" id="customer-email" class="form-input">
                </div>
                
                <div class="form-group full-width">
                  <label class="form-label" for="customer-address">Address</label>
                  <input type="text" id="customer-address" class="form-input">
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button id="cancel-customer-btn" class="button secondary-button">Cancel</button>
            <button id="save-customer-btn" class="button primary-button">Save Customer</button>
          </div>
        </div>
      </div>
      
      <!-- Delete Confirmation Modal -->
      <div id="delete-customer-modal" class="modal-overlay hidden">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">Delete Customer</h3>
            <button class="modal-close" id="close-delete-customer-btn">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this customer? This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button id="cancel-delete-customer-btn" class="button secondary-button">Cancel</button>
            <button id="confirm-delete-customer-btn" class="button danger-button">Delete Customer</button>
          </div>
        </div>
      </div>
    `;
    
    this.setupEventListeners();
  }
  
  renderCustomerRows() {
    if (this.filteredCustomers.length === 0) {
      return '';
    }
    
    return this.filteredCustomers.map(customer => {
      return `
        <tr data-id="${customer.id}">
          <td>
            <div class="customer-details">
              <div class="font-medium">${customer.name}</div>
              <div class="customer-id">ID: CUST-${customer.id.toString().padStart(4, '0')}</div>
            </div>
          </td>
          <td>
            <div class="contact-details">
              <div>${customer.phone}</div>
              <div class="contact-email">${customer.email}</div>
            </div>
          </td>
          <td>${customer.lastPurchase}</td>
          <td>$${customer.totalSpent.toFixed(2)}</td>
          <td class="action-buttons">
            <button class="action-button edit-customer-button" data-id="${customer.id}">
              <i class="fa-solid fa-edit"></i>
            </button>
            <button class="action-button delete-customer-button" data-id="${customer.id}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }
  
  applyFilters() {
    this.filteredCustomers = this.customers.filter(customer => {
      // Apply search filter
      if (this.searchTerm && 
          !customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
          !customer.phone.includes(this.searchTerm) &&
          !customer.email.toLowerCase().includes(this.searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }
  
  setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('customer-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.toLowerCase();
        this.applyFilters();
        this.updateTable();
      });
    }
    
    // Add customer button
    const addCustomerBtn = document.getElementById('add-customer-btn');
    if (addCustomerBtn) {
      addCustomerBtn.addEventListener('click', () => {
        this.openCustomerModal();
      });
    }
    
    // Close modal buttons
    const closeModalBtn = document.getElementById('close-customer-modal-btn');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        this.closeCustomerModal();
      });
    }
    
    const cancelCustomerBtn = document.getElementById('cancel-customer-btn');
    if (cancelCustomerBtn) {
      cancelCustomerBtn.addEventListener('click', () => {
        this.closeCustomerModal();
      });
    }
    
    // Save customer button
    const saveCustomerBtn = document.getElementById('save-customer-btn');
    if (saveCustomerBtn) {
      saveCustomerBtn.addEventListener('click', () => {
        this.saveCustomer();
      });
    }
    
    // Close delete modal buttons
    const closeDeleteModalBtn = document.getElementById('close-delete-customer-btn');
    if (closeDeleteModalBtn) {
      closeDeleteModalBtn.addEventListener('click', () => {
        this.closeDeleteModal();
      });
    }
    
    const cancelDeleteBtn = document.getElementById('cancel-delete-customer-btn');
    if (cancelDeleteBtn) {
      cancelDeleteBtn.addEventListener('click', () => {
        this.closeDeleteModal();
      });
    }
    
    // Confirm delete button
    const confirmDeleteBtn = document.getElementById('confirm-delete-customer-btn');
    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener('click', () => {
        this.deleteCustomer();
      });
    }
    
    // Setup row action buttons
    this.setupRowEventListeners();
  }
  
  setupRowEventListeners() {
    // Edit buttons
    const editButtons = document.querySelectorAll('.edit-customer-button');
    editButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        this.editCustomer(id);
      });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('.delete-customer-button');
    deleteButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        this.openDeleteModal(id);
      });
    });
  }
  
  updateTable() {
    const tableBody = document.getElementById('customers-table-body');
    const emptyMessage = document.getElementById('empty-customers-message');
    
    tableBody.innerHTML = this.renderCustomerRows();
    
    if (this.filteredCustomers.length === 0) {
      emptyMessage.classList.remove('hidden');
    } else {
      emptyMessage.classList.add('hidden');
    }
    
    this.setupRowEventListeners();
  }
  
  openCustomerModal(customer = null) {
    const modal = document.getElementById('customer-modal');
    const form = document.getElementById('customer-form');
    const title = document.getElementById('customer-modal-title');
    
    // Reset form
    form.reset();
    
    if (customer) {
      // Edit mode
      title.textContent = 'Edit Customer';
      document.getElementById('customer-id').value = customer.id;
      document.getElementById('customer-name').value = customer.name;
      document.getElementById('customer-phone').value = customer.phone;
      document.getElementById('customer-email').value = customer.email;
      document.getElementById('customer-address').value = customer.address;
    } else {
      // Add mode
      title.textContent = 'Add New Customer';
      document.getElementById('customer-id').value = '';
    }
    
    modal.classList.remove('hidden');
  }
  
  closeCustomerModal() {
    const modal = document.getElementById('customer-modal');
    modal.classList.add('hidden');
  }
  
  openDeleteModal(id) {
    const modal = document.getElementById('delete-customer-modal');
    modal.classList.remove('hidden');
    
    const confirmButton = document.getElementById('confirm-delete-customer-btn');
    confirmButton.dataset.id = id;
  }
  
  closeDeleteModal() {
    const modal = document.getElementById('delete-customer-modal');
    modal.classList.add('hidden');
  }
  
  saveCustomer() {
    // Collect form data
    const id = document.getElementById('customer-id').value;
    const customerData = {
      name: document.getElementById('customer-name').value,
      phone: document.getElementById('customer-phone').value,
      email: document.getElementById('customer-email').value,
      address: document.getElementById('customer-address').value
    };
    
    // Validate form
    if (!customerData.name || !customerData.phone) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      if (id) {
        // Update existing customer
        dataService.updateCustomer(id, customerData);
      } else {
        // Add new customer with default values
        customerData.lastPurchase = '-';
        customerData.totalSpent = 0;
        dataService.addCustomer(customerData);
      }
      
      // Reload data and refresh table
      this.customers = dataService.getCustomers();
      this.applyFilters();
      this.updateTable();
      this.closeCustomerModal();
      
      // Show success message
      alert(id ? 'Customer updated successfully!' : 'Customer added successfully!');
    } catch (error) {
      alert('Error saving customer: ' + error.message);
    }
  }
  
  editCustomer(id) {
    const customer = dataService.getCustomerById(id);
    if (customer) {
      this.openCustomerModal(customer);
    }
  }
  
  deleteCustomer() {
    const confirmButton = document.getElementById('confirm-delete-customer-btn');
    const id = confirmButton.dataset.id;
    
    try {
      dataService.deleteCustomer(id);
      
      // Reload data and refresh table
      this.customers = dataService.getCustomers();
      this.applyFilters();
      this.updateTable();
      this.closeDeleteModal();
      
      // Show success message
      alert('Customer deleted successfully!');
    } catch (error) {
      alert('Error deleting customer: ' + error.message);
    }
  }
}

/**
 * Sales Page
 */
class SalesPage {
  constructor(container) {
    this.container = container;
    this.sales = [];
    this.filteredSales = [];
    this.searchTerm = '';
  }
  
  render() {
    // Load sales data
    this.sales = dataService.getSales();
    this.applyFilters();
    
    // Calculate total sales value
    const totalSales = this.sales.reduce((sum, sale) => sum + sale.total, 0).toFixed(2);
    
    this.container.innerHTML = `
      <div class="page-header">
        <h1>Sales Management</h1>
        <p>View and manage your sales transactions</p>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon sales-icon">
              <i class="fa-solid fa-coins"></i>
            </div>
            <h3 class="stat-title">Total Sales</h3>
          </div>
          <p class="stat-value">$${totalSales}</p>
          <div class="stat-change">
            <span class="change-up"><i class="fa-solid fa-arrow-up"></i> 8%</span>
            <span class="change-text">from last month</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon inventory-icon">
              <i class="fa-solid fa-receipt"></i>
            </div>
            <h3 class="stat-title">Transactions</h3>
          </div>
          <p class="stat-value">${this.sales.length}</p>
          <div class="stat-change">
            <span class="change-up"><i class="fa-solid fa-arrow-up"></i> 12%</span>
            <span class="change-text">from last month</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon customers-icon">
              <i class="fa-solid fa-users"></i>
            </div>
            <h3 class="stat-title">Customers Served</h3>
          </div>
          <p class="stat-value">${new Set(this.sales.map(sale => sale.customer)).size}</p>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon lowstock-icon">
              <i class="fa-solid fa-chart-line"></i>
            </div>
            <h3 class="stat-title">Avg. Sale Value</h3>
          </div>
          <p class="stat-value">$${(totalSales / this.sales.length).toFixed(2)}</p>
        </div>
      </div>
      
      <div class="page-actions">
        <div class="search-bar">
          <i class="fa-solid fa-search search-icon"></i>
          <input type="text" id="sales-search" class="search-input" placeholder="Search sales...">
        </div>
        
        <button id="new-sale-btn" class="button primary-button">
          <i class="fa-solid fa-plus"></i> New Sale
        </button>
      </div>
      
      <div class="table-card">
        <table class="inventory-table">
          <thead>
            <tr>
              <th>Sale ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody id="sales-table-body">
            ${this.renderSalesRows()}
          </tbody>
        </table>
        <div id="empty-sales-message" class="${this.filteredSales.length > 0 ? 'hidden' : ''}">
          <p class="text-center p-4 text-muted">No sales match your search criteria.</p>
        </div>
      </div>
    `;
    
    this.setupEventListeners();
  }
  
  renderSalesRows() {
    if (this.filteredSales.length === 0) {
      return '';
    }
    
    return this.filteredSales.map(sale => {
      return `
        <tr data-id="${sale.id}">
          <td>
            <div class="font-medium">INV-${sale.id.toString().padStart(4, '0')}</div>
          </td>
          <td>${sale.date}</td>
          <td>${sale.customer}</td>
          <td>${sale.items.length} items</td>
          <td>$${sale.total.toFixed(2)}</td>
          <td>
            <span class="stock-badge in-stock">${sale.status}</span>
          </td>
          <td class="action-buttons">
            <button class="action-button view-sale-button" data-id="${sale.id}">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="action-button print-sale-button" data-id="${sale.id}">
              <i class="fa-solid fa-print"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }
  
  applyFilters() {
    this.filteredSales = this.sales.filter(sale => {
      // Apply search filter
      if (this.searchTerm && 
          !sale.customer.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
          !`INV-${sale.id.toString().padStart(4, '0')}`.includes(this.searchTerm)) {
        return false;
      }
      
      return true;
    });
  }
  
  setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('sales-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.toLowerCase();
        this.applyFilters();
        this.updateTable();
      });
    }
    
    // New sale button
    const newSaleBtn = document.getElementById('new-sale-btn');
    if (newSaleBtn) {
      newSaleBtn.addEventListener('click', () => {
        alert('New sale functionality to be implemented');
      });
    }
    
    // Setup row action buttons
    this.setupRowEventListeners();
  }
  
  setupRowEventListeners() {
    // View buttons
    const viewButtons = document.querySelectorAll('.view-sale-button');
    viewButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        this.viewSale(id);
      });
    });
    
    // Print buttons
    const printButtons = document.querySelectorAll('.print-sale-button');
    printButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        this.printSale(id);
      });
    });
  }
  
  updateTable() {
    const tableBody = document.getElementById('sales-table-body');
    const emptyMessage = document.getElementById('empty-sales-message');
    
    tableBody.innerHTML = this.renderSalesRows();
    
    if (this.filteredSales.length === 0) {
      emptyMessage.classList.remove('hidden');
    } else {
      emptyMessage.classList.add('hidden');
    }
    
    this.setupRowEventListeners();
  }
  
  viewSale(id) {
    alert(`View sale details for ID: ${id}`);
    // This would open a modal with sale details
  }
  
  printSale(id) {
    alert(`Print invoice for ID: ${id}`);
    // This would open a print preview or print directly
  }
}

/**
 * Reports Page
 */
class ReportsPage {
  constructor(container) {
    this.container = container;
  }
  
  render() {
    this.container.innerHTML = `
      <div class="page-header">
        <h1>Reports</h1>
        <p>View and generate business reports</p>
      </div>
      
      <div class="reports-grid">
        <div class="report-card">
          <div class="report-header">
            <div class="report-icon">
              <i class="fa-solid fa-coins"></i>
            </div>
            <h3 class="report-title">Sales Report</h3>
          </div>
          <p class="report-description">
            Generate comprehensive sales reports with various filters and date ranges.
          </p>
          <button class="button primary-button">Generate Report</button>
        </div>
        
        <div class="report-card">
          <div class="report-header">
            <div class="report-icon">
              <i class="fa-solid fa-box"></i>
            </div>
            <h3 class="report-title">Inventory Report</h3>
          </div>
          <p class="report-description">
            View stock levels, inventory value, and product performance metrics.
          </p>
          <button class="button primary-button">Generate Report</button>
        </div>
        
        <div class="report-card">
          <div class="report-header">
            <div class="report-icon">
              <i class="fa-solid fa-users"></i>
            </div>
            <h3 class="report-title">Customer Analysis</h3>
          </div>
          <p class="report-description">
            Analyze customer purchase behavior and identify key clients.
          </p>
          <button class="button primary-button">Generate Report</button>
        </div>
        
        <div class="report-card">
          <div class="report-header">
            <div class="report-icon">
              <i class="fa-solid fa-chart-line"></i>
            </div>
            <h3 class="report-title">Performance Metrics</h3>
          </div>
          <p class="report-description">
            Track business performance with key metrics and growth indicators.
          </p>
          <button class="button primary-button">Generate Report</button>
        </div>
      </div>
    `;
    
    // Add event listeners for report buttons
    const reportButtons = this.container.querySelectorAll('.button');
    reportButtons.forEach(button => {
      button.addEventListener('click', () => {
        alert('Report generation functionality to be implemented');
      });
    });
  }
}

/**
 * Add CSS styles for simple bar chart since we're using vanilla CSS
 */
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .simple-bar-chart {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      height: 100%;
      padding-top: 20px;
    }
    
    .chart-bar {
      width: 40px;
      background-color: var(--primary);
      border-radius: 4px 4px 0 0;
      position: relative;
      transition: height 0.3s ease;
    }
    
    .chart-label {
      position: absolute;
      bottom: -25px;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 0.75rem;
      color: var(--muted-foreground);
    }
  `;
  
  document.head.appendChild(style);
});
