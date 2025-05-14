
/**
 * Sales Management Component for Agrovet Dashboard
 */

import dataService from '../services/dataService.js';

export default class Sales {
  constructor(container) {
    this.container = container;
    this.sales = [];
    this.filteredSales = [];
    this.searchTerm = '';
    this.dateFilter = {
      start: '',
      end: ''
    };
    
    this.init();
  }
  
  async init() {
    this.loadSales();
    this.render();
    this.setupEventListeners();
  }
  
  loadSales() {
    this.sales = dataService.getSales();
    this.applyFilters();
  }
  
  applyFilters() {
    this.filteredSales = this.sales.filter(sale => {
      // Apply search filter on customer name
      if (this.searchTerm && !sale.customer.toLowerCase().includes(this.searchTerm.toLowerCase())) {
        return false;
      }
      
      // Apply date filters
      if (this.dateFilter.start && new Date(sale.date) < new Date(this.dateFilter.start)) {
        return false;
      }
      
      if (this.dateFilter.end && new Date(sale.date) > new Date(this.dateFilter.end)) {
        return false;
      }
      
      return true;
    });
  }
  
  render() {
    this.container.innerHTML = `
      <div class="p-6 max-w-full">
        <header class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Sales Management</h1>
            <p class="text-gray-500">Track, record and manage all sales transactions</p>
          </div>
          <button id="addSaleBtn" class="bg-agrovet-600 hover:bg-agrovet-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <i class="icon-plus"></i>
            <span>Record New Sale</span>
          </button>
        </header>
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div class="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 md:items-center md:justify-between flex-wrap">
            <div class="flex items-center gap-3 flex-wrap">
              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <i class="icon-search"></i>
                </span>
                <input 
                  id="salesSearch" 
                  type="text" 
                  placeholder="Search by customer..." 
                  class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500"
                >
              </div>
              
              <div class="flex items-center gap-2">
                <span class="text-gray-500">From:</span>
                <input 
                  id="dateStart" 
                  type="date" 
                  class="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500"
                >
              </div>
              
              <div class="flex items-center gap-2">
                <span class="text-gray-500">To:</span>
                <input 
                  id="dateEnd" 
                  type="date" 
                  class="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500"
                >
              </div>
              
              <button id="clearFiltersBtn" class="text-agrovet-600 hover:text-agrovet-700 px-3 py-2 rounded-lg text-sm">
                Clear Filters
              </button>
            </div>
            
            <div>
              <span class="text-gray-500">${this.filteredSales.length} transactions</span>
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th class="px-6 py-3">Transaction ID</th>
                  <th class="px-6 py-3">Customer</th>
                  <th class="px-6 py-3">Date</th>
                  <th class="px-6 py-3">Items</th>
                  <th class="px-6 py-3">Payment Method</th>
                  <th class="px-6 py-3 text-right">Total Amount</th>
                  <th class="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody id="salesTableBody">
                ${this.renderSalesRows()}
              </tbody>
            </table>
          </div>
          
          <div id="noSalesMessage" class="${this.filteredSales.length > 0 ? 'hidden' : ''} p-8 text-center text-gray-500">
            No sales transactions match your search.
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 class="font-bold text-gray-800 mb-4">Payment Methods</h3>
            <div class="space-y-4" id="paymentMethodsChart">
              <!-- Payment methods chart will be rendered here -->
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-2">
            <h3 class="font-bold text-gray-800 mb-4">Sales Summary</h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div class="border border-gray-100 rounded-lg p-4">
                <p class="text-sm text-gray-500 mb-1">Today</p>
                <p class="text-xl font-bold" id="todaySales">$0.00</p>
              </div>
              <div class="border border-gray-100 rounded-lg p-4">
                <p class="text-sm text-gray-500 mb-1">This Week</p>
                <p class="text-xl font-bold" id="weekSales">$0.00</p>
              </div>
              <div class="border border-gray-100 rounded-lg p-4">
                <p class="text-sm text-gray-500 mb-1">This Month</p>
                <p class="text-xl font-bold" id="monthSales">$0.00</p>
              </div>
              <div class="border border-gray-100 rounded-lg p-4">
                <p class="text-sm text-gray-500 mb-1">Total Sales</p>
                <p class="text-xl font-bold" id="totalSales">$0.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- New Sale Modal -->
      <div id="saleModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 hidden items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-4xl m-4">
          <div class="border-b border-gray-200 p-4 flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-800">Record New Sale</h3>
            <button id="closeModalBtn" class="text-gray-500 hover:text-gray-700">
              <i class="icon-x"></i>
            </button>
          </div>
          <form id="saleForm" class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="customerSelect" class="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                <select id="customerSelect" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500">
                  <option value="">Select a customer</option>
                  ${this.renderCustomerOptions()}
                </select>
              </div>
              
              <div>
                <label for="paymentMethod" class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select id="paymentMethod" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500">
                  <option value="Cash">Cash</option>
                  <option value="Credit">Credit</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Mobile Payment">Mobile Payment</option>
                </select>
              </div>
              
              <div class="col-span-1 md:col-span-2">
                <h4 class="font-medium text-gray-800 mb-3">Sale Items</h4>
                <div id="saleItems" class="space-y-3">
                  <div class="sale-item-row grid grid-cols-12 gap-2">
                    <div class="col-span-5">
                      <select class="product-select w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500">
                        <option value="">Select product</option>
                        ${this.renderProductOptions()}
                      </select>
                    </div>
                    <div class="col-span-2">
                      <input type="number" placeholder="Qty" min="1" class="quantity-input w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500">
                    </div>
                    <div class="col-span-3">
                      <input type="number" placeholder="Price" step="0.01" min="0" class="price-input w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500" readonly>
                    </div>
                    <div class="col-span-2">
                      <button type="button" class="remove-item-btn px-3 py-2 text-red-600 hover:text-red-800" disabled>Remove</button>
                    </div>
                  </div>
                </div>
                
                <button type="button" id="addItemBtn" class="mt-3 px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                  + Add Item
                </button>
              </div>
            </div>
            
            <div class="mt-6 flex justify-between">
              <div class="text-lg font-medium">
                Total: <span id="saleTotal" class="font-bold">$0.00</span>
              </div>
              
              <div class="flex space-x-3">
                <button type="button" id="cancelBtn" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" class="px-4 py-2 bg-agrovet-600 text-white rounded-lg hover:bg-agrovet-700">
                  Complete Sale
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Sale Details Modal -->
      <div id="saleDetailsModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 hidden items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl m-4">
          <div class="border-b border-gray-200 p-4 flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-800">Sale Details</h3>
            <button id="closeSaleDetailsBtn" class="text-gray-500 hover:text-gray-700">
              <i class="icon-x"></i>
            </button>
          </div>
          <div class="p-6" id="saleDetailsContent">
            <!-- Sale details will be rendered here -->
          </div>
          <div class="border-t border-gray-200 p-4 flex justify-end">
            <button id="closeSaleDetailsBtn2" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
              Close
            </button>
          </div>
        </div>
      </div>
    `;
    
    this.setupEventListeners();
    this.updateSalesSummary();
    this.renderPaymentMethodsChart();
  }
  
  renderSalesRows() {
    if (this.filteredSales.length === 0) {
      return '';
    }
    
    return this.filteredSales.map(sale => {
      return `
        <tr class="border-b border-gray-100 hover:bg-gray-50">
          <td class="px-6 py-4 font-medium">INV-${sale.id.toString().padStart(4, '0')}</td>
          <td class="px-6 py-4">${sale.customer}</td>
          <td class="px-6 py-4 text-gray-500">${sale.date}</td>
          <td class="px-6 py-4">${sale.items.length} item(s)</td>
          <td class="px-6 py-4">${sale.paymentMethod}</td>
          <td class="px-6 py-4 text-right font-medium">$${sale.total.toFixed(2)}</td>
          <td class="px-6 py-4 text-right">
            <button data-id="${sale.id}" class="view-sale-btn text-agrovet-600 hover:text-agrovet-900">View Details</button>
          </td>
        </tr>
      `;
    }).join('');
  }
  
  renderCustomerOptions() {
    const customers = dataService.getCustomers();
    return customers.map(customer => `
      <option value="${customer.name}">${customer.name}</option>
    `).join('');
  }
  
  renderProductOptions() {
    const products = dataService.getInventory();
    return products.map(product => `
      <option value="${product.id}" data-price="${product.price}" data-max="${product.quantity}">${product.name} - $${product.price.toFixed(2)} (${product.quantity} in stock)</option>
    `).join('');
  }
  
  updateTable() {
    const tableBody = this.container.querySelector('#salesTableBody');
    const noSalesMessage = this.container.querySelector('#noSalesMessage');
    
    tableBody.innerHTML = this.renderSalesRows();
    
    if (this.filteredSales.length === 0) {
      noSalesMessage.classList.remove('hidden');
    } else {
      noSalesMessage.classList.add('hidden');
    }
    
    this.setupRowEventListeners();
  }
  
  updateSalesSummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Calculate sales totals
    let todayTotal = 0;
    let weekTotal = 0;
    let monthTotal = 0;
    let allTotal = 0;
    
    this.sales.forEach(sale => {
      const saleDate = new Date(sale.date);
      saleDate.setHours(0, 0, 0, 0);
      
      // Add to all totals
      allTotal += sale.total;
      
      // Check for today's sales
      if (saleDate.getTime() === today.getTime()) {
        todayTotal += sale.total;
      }
      
      // Check for this week's sales
      if (saleDate >= weekStart) {
        weekTotal += sale.total;
      }
      
      // Check for this month's sales
      if (saleDate >= monthStart) {
        monthTotal += sale.total;
      }
    });
    
    // Update the display
    this.container.querySelector('#todaySales').textContent = `$${todayTotal.toFixed(2)}`;
    this.container.querySelector('#weekSales').textContent = `$${weekTotal.toFixed(2)}`;
    this.container.querySelector('#monthSales').textContent = `$${monthTotal.toFixed(2)}`;
    this.container.querySelector('#totalSales').textContent = `$${allTotal.toFixed(2)}`;
  }
  
  renderPaymentMethodsChart() {
    // Calculate payment method distribution
    const paymentMethods = {};
    this.sales.forEach(sale => {
      if (!paymentMethods[sale.paymentMethod]) {
        paymentMethods[sale.paymentMethod] = 0;
      }
      paymentMethods[sale.paymentMethod] += sale.total;
    });
    
    const totalAmount = Object.values(paymentMethods).reduce((sum, val) => sum + val, 0);
    const chartData = Object.entries(paymentMethods).map(([method, amount]) => ({
      method,
      amount,
      percentage: totalAmount > 0 ? Math.round((amount / totalAmount) * 100) : 0
    }));
    
    const chartContainer = this.container.querySelector('#paymentMethodsChart');
    if (chartContainer) {
      chartContainer.innerHTML = `
        <div class="space-y-4">
          ${chartData.map(item => `
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-sm font-medium">${item.method}</span>
                <span class="text-sm text-gray-500">$${item.amount.toFixed(2)} (${item.percentage}%)</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-agrovet-500 h-2 rounded-full" style="width: ${item.percentage}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  }
  
  setupEventListeners() {
    // Search functionality
    const searchInput = this.container.querySelector('#salesSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value;
        this.applyFilters();
        this.updateTable();
      });
    }
    
    // Date filter start
    const dateStartInput = this.container.querySelector('#dateStart');
    if (dateStartInput) {
      dateStartInput.addEventListener('change', (e) => {
        this.dateFilter.start = e.target.value;
        this.applyFilters();
        this.updateTable();
      });
    }
    
    // Date filter end
    const dateEndInput = this.container.querySelector('#dateEnd');
    if (dateEndInput) {
      dateEndInput.addEventListener('change', (e) => {
        this.dateFilter.end = e.target.value;
        this.applyFilters();
        this.updateTable();
      });
    }
    
    // Clear filters
    const clearFiltersBtn = this.container.querySelector('#clearFiltersBtn');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        this.searchTerm = '';
        this.dateFilter.start = '';
        this.dateFilter.end = '';
        
        // Reset input fields
        if (searchInput) searchInput.value = '';
        if (dateStartInput) dateStartInput.value = '';
        if (dateEndInput) dateEndInput.value = '';
        
        this.applyFilters();
        this.updateTable();
      });
    }
    
    // Add new sale button
    const addButton = this.container.querySelector('#addSaleBtn');
    if (addButton) {
      addButton.addEventListener('click', () => {
        this.openSaleModal();
      });
    }
    
    // Close modal buttons
    const closeModalBtn = this.container.querySelector('#closeModalBtn');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        this.closeSaleModal();
      });
    }
    
    const cancelBtn = this.container.querySelector('#cancelBtn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.closeSaleModal();
      });
    }
    
    // Add item button
    const addItemBtn = this.container.querySelector('#addItemBtn');
    if (addItemBtn) {
      addItemBtn.addEventListener('click', () => {
        this.addSaleItemRow();
      });
    }
    
    // Form submission
    const form = this.container.querySelector('#saleForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveSale();
      });
    }
    
    // Close sale details buttons
    const closeSaleDetailsBtn = this.container.querySelector('#closeSaleDetailsBtn');
    if (closeSaleDetailsBtn) {
      closeSaleDetailsBtn.addEventListener('click', () => {
        this.closeSaleDetailsModal();
      });
    }
    
    const closeSaleDetailsBtn2 = this.container.querySelector('#closeSaleDetailsBtn2');
    if (closeSaleDetailsBtn2) {
      closeSaleDetailsBtn2.addEventListener('click', () => {
        this.closeSaleDetailsModal();
      });
    }
    
    // Initial product select event listener
    this.setupInitialProductSelectListeners();
    
    // View sale buttons
    this.setupRowEventListeners();
  }
  
  setupRowEventListeners() {
    // View sale buttons
    const viewButtons = this.container.querySelectorAll('.view-sale-btn');
    viewButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        this.viewSaleDetails(id);
      });
    });
  }
  
  setupInitialProductSelectListeners() {
    // First product row event listeners
    const firstProductSelect = this.container.querySelector('.product-select');
    const firstQuantityInput = this.container.querySelector('.quantity-input');
    
    if (firstProductSelect && firstQuantityInput) {
      firstProductSelect.addEventListener('change', (e) => {
        this.handleProductSelectChange(e);
      });
      
      firstQuantityInput.addEventListener('input', () => {
        this.calculateTotal();
      });
    }
  }
  
  openSaleModal() {
    const modal = this.container.querySelector('#saleModal');
    const form = this.container.querySelector('#saleForm');
    
    // Reset form
    form.reset();
    
    // Reset sale items to just one row
    const saleItemsContainer = this.container.querySelector('#saleItems');
    saleItemsContainer.innerHTML = `
      <div class="sale-item-row grid grid-cols-12 gap-2">
        <div class="col-span-5">
          <select class="product-select w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500">
            <option value="">Select product</option>
            ${this.renderProductOptions()}
          </select>
        </div>
        <div class="col-span-2">
          <input type="number" placeholder="Qty" min="1" class="quantity-input w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500">
        </div>
        <div class="col-span-3">
          <input type="number" placeholder="Price" step="0.01" min="0" class="price-input w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500" readonly>
        </div>
        <div class="col-span-2">
          <button type="button" class="remove-item-btn px-3 py-2 text-red-600 hover:text-red-800" disabled>Remove</button>
        </div>
      </div>
    `;
    
    // Reset total
    const totalElement = this.container.querySelector('#saleTotal');
    totalElement.textContent = '$0.00';
    
    // Setup initial product select listeners
    this.setupInitialProductSelectListeners();
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
  
  closeSaleModal() {
    const modal = this.container.querySelector('#saleModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  
  addSaleItemRow() {
    const saleItemsContainer = this.container.querySelector('#saleItems');
    
    // Create new row
    const newRow = document.createElement('div');
    newRow.className = 'sale-item-row grid grid-cols-12 gap-2';
    newRow.innerHTML = `
      <div class="col-span-5">
        <select class="product-select w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500">
          <option value="">Select product</option>
          ${this.renderProductOptions()}
        </select>
      </div>
      <div class="col-span-2">
        <input type="number" placeholder="Qty" min="1" class="quantity-input w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500">
      </div>
      <div class="col-span-3">
        <input type="number" placeholder="Price" step="0.01" min="0" class="price-input w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500" readonly>
      </div>
      <div class="col-span-2">
        <button type="button" class="remove-item-btn px-3 py-2 text-red-600 hover:text-red-800">Remove</button>
      </div>
    `;
    
    saleItemsContainer.appendChild(newRow);
    
    // Set up event listeners for the new row
    const productSelect = newRow.querySelector('.product-select');
    productSelect.addEventListener('change', (e) => {
      this.handleProductSelectChange(e);
    });
    
    const quantityInput = newRow.querySelector('.quantity-input');
    quantityInput.addEventListener('input', () => {
      this.calculateTotal();
    });
    
    const removeButton = newRow.querySelector('.remove-item-btn');
    removeButton.addEventListener('click', () => {
      newRow.remove();
      this.calculateTotal();
    });
  }
  
  handleProductSelectChange(e) {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const row = e.target.closest('.sale-item-row');
    const priceInput = row.querySelector('.price-input');
    const quantityInput = row.querySelector('.quantity-input');
    
    if (selectedOption.value) {
      const price = parseFloat(selectedOption.dataset.price);
      const maxQty = parseInt(selectedOption.dataset.max);
      
      priceInput.value = price.toFixed(2);
      quantityInput.max = maxQty;
      
      // Reset quantity to 1 when product changes
      quantityInput.value = 1;
      
      // Recalculate total
      this.calculateTotal();
    } else {
      priceInput.value = '';
      quantityInput.value = '';
      quantityInput.removeAttribute('max');
    }
  }
  
  calculateTotal() {
    const rows = this.container.querySelectorAll('.sale-item-row');
    let total = 0;
    
    rows.forEach(row => {
      const quantity = parseFloat(row.querySelector('.quantity-input').value) || 0;
      const price = parseFloat(row.querySelector('.price-input').value) || 0;
      
      total += quantity * price;
    });
    
    const totalElement = this.container.querySelector('#saleTotal');
    totalElement.textContent = `$${total.toFixed(2)}`;
  }
  
  saveSale() {
    const form = this.container.querySelector('#saleForm');
    const customerSelect = this.container.querySelector('#customerSelect');
    const paymentMethod = this.container.querySelector('#paymentMethod');
    const saleItemRows = this.container.querySelectorAll('.sale-item-row');
    
    try {
      // Validate customer
      if (!customerSelect.value) {
        alert('Please select a customer');
        return;
      }
      
      // Collect sale items
      const items = [];
      let hasItems = false;
      
      saleItemRows.forEach(row => {
        const productSelect = row.querySelector('.product-select');
        const quantityInput = row.querySelector('.quantity-input');
        const priceInput = row.querySelector('.price-input');
        
        if (productSelect.value && quantityInput.value) {
          hasItems = true;
          items.push({
            productId: parseInt(productSelect.value),
            quantity: parseInt(quantityInput.value),
            price: parseFloat(priceInput.value)
          });
        }
      });
      
      if (!hasItems) {
        alert('Please add at least one product');
        return;
      }
      
      // Calculate total
      const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      
      // Create sale object
      const saleData = {
        customer: customerSelect.value,
        paymentMethod: paymentMethod.value,
        items,
        total
      };
      
      // Save sale
      dataService.addSale(saleData);
      
      // Reload data and close modal
      this.loadSales();
      this.updateTable();
      this.updateSalesSummary();
      this.renderPaymentMethodsChart();
      this.closeSaleModal();
      
      // Show success notification
      alert('Sale recorded successfully!');
    } catch (error) {
      alert('Error recording sale: ' + error.message);
    }
  }
  
  viewSaleDetails(id) {
    const sale = this.sales.find(s => s.id === Number(id));
    if (!sale) return;
    
    // Get product details for each item
    const inventory = dataService.getInventory();
    const itemsWithDetails = sale.items.map(item => {
      const product = inventory.find(p => p.id === item.productId) || { name: 'Unknown Product' };
      return {
        ...item,
        name: product.name,
        subtotal: item.quantity * item.price
      };
    });
    
    const modal = this.container.querySelector('#saleDetailsModal');
    const content = this.container.querySelector('#saleDetailsContent');
    
    content.innerHTML = `
      <div class="mb-6">
        <h3 class="font-medium text-lg text-gray-800 mb-1">Invoice #INV-${sale.id.toString().padStart(4, '0')}</h3>
        <p class="text-gray-500">Date: ${sale.date}</p>
      </div>
      
      <div class="mb-6">
        <h4 class="font-medium text-gray-800 mb-2">Customer</h4>
        <p>${sale.customer}</p>
      </div>
      
      <div class="mb-6">
        <h4 class="font-medium text-gray-800 mb-2">Items</h4>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-2 px-2">Product</th>
                <th class="text-center py-2 px-2">Qty</th>
                <th class="text-right py-2 px-2">Price</th>
                <th class="text-right py-2 px-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsWithDetails.map(item => `
                <tr class="border-b border-gray-100">
                  <td class="py-2 px-2">${item.name}</td>
                  <td class="py-2 px-2 text-center">${item.quantity}</td>
                  <td class="py-2 px-2 text-right">$${item.price.toFixed(2)}</td>
                  <td class="py-2 px-2 text-right">$${item.subtotal.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr class="font-medium">
                <td colspan="3" class="py-3 px-2 text-right">Total:</td>
                <td class="py-3 px-2 text-right">$${sale.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      <div class="flex justify-between text-sm text-gray-500">
        <div>Payment Method: ${sale.paymentMethod}</div>
        <div>Payment Status: Completed</div>
      </div>
    `;
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
  
  closeSaleDetailsModal() {
    const modal = this.container.querySelector('#saleDetailsModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}
