
/**
 * Reports Component for Agrovet Dashboard
 */

import dataService from '../services/dataService.js';

export default class Reports {
  constructor(container) {
    this.container = container;
    this.render();
    this.setupEventListeners();
  }
  
  render() {
    // Get report data
    const inventory = dataService.getInventory();
    const lowStockItems = dataService.getLowStockItems();
    const totalInventoryValue = dataService.getInventoryValue();
    
    // Get sales data for filtering
    const sales = dataService.getSales();
    
    // Get current date for default date filters
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };
    
    // Default date range (current month)
    const defaultStartDate = formatDate(firstDayOfMonth);
    const defaultEndDate = formatDate(today);
    
    this.container.innerHTML = `
      <div class="p-6 max-w-full">
        <header class="mb-6">
          <h1 class="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p class="text-gray-500">View detailed reports and analytics for your business</p>
        </header>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div class="flex items-center mb-4">
              <div class="bg-agrovet-100 p-3 rounded-lg">
                <i class="icon-inventory text-agrovet-600"></i>
              </div>
              <h3 class="ml-4 font-medium text-gray-700">Total Inventory Value</h3>
            </div>
            <p class="text-2xl font-bold">$${totalInventoryValue}</p>
            <span class="text-sm text-gray-500">${inventory.length} unique products</span>
          </div>
          
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div class="flex items-center mb-4">
              <div class="bg-orange-100 p-3 rounded-lg">
                <i class="icon-alert text-orange-600"></i>
              </div>
              <h3 class="ml-4 font-medium text-gray-700">Low Stock Items</h3>
            </div>
            <p class="text-2xl font-bold">${lowStockItems.length}</p>
            <span class="text-sm text-gray-500">items below reorder level</span>
          </div>
          
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div class="flex items-center mb-4">
              <div class="bg-purple-100 p-3 rounded-lg">
                <i class="icon-sales text-purple-600"></i>
              </div>
              <h3 class="ml-4 font-medium text-gray-700">Total Sales</h3>
            </div>
            <p class="text-2xl font-bold">${sales.length}</p>
            <span class="text-sm text-gray-500">transactions to date</span>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 class="font-bold text-gray-800 mb-4">Sales Report</h3>
            
            <div class="mb-4 flex flex-wrap gap-4">
              <div class="flex items-center gap-2">
                <label for="salesStartDate" class="text-sm text-gray-500">From:</label>
                <input 
                  id="salesStartDate" 
                  type="date" 
                  value="${defaultStartDate}"
                  class="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500"
                >
              </div>
              
              <div class="flex items-center gap-2">
                <label for="salesEndDate" class="text-sm text-gray-500">To:</label>
                <input 
                  id="salesEndDate" 
                  type="date" 
                  value="${defaultEndDate}"
                  class="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500"
                >
              </div>
              
              <button id="generateSalesReport" class="px-3 py-1 bg-agrovet-600 text-white rounded-lg text-sm hover:bg-agrovet-700">
                Generate Report
              </button>
            </div>
            
            <div id="salesReportResults">
              <!-- Sales report will be rendered here -->
              <div class="text-center text-gray-500 py-6">
                Select a date range and generate the report
              </div>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 class="font-bold text-gray-800 mb-4">Top Selling Products</h3>
            <div id="topProductsChart" class="h-64">
              <!-- Top products chart will be rendered here -->
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 mb-6">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-bold text-gray-800">Low Stock Items Report</h3>
              <button id="printLowStockBtn" class="text-agrovet-600 hover:text-agrovet-700 text-sm font-medium">Print Report</button>
            </div>
            
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th class="px-6 py-3">Product Name</th>
                    <th class="px-6 py-3">Category</th>
                    <th class="px-6 py-3">Current Stock</th>
                    <th class="px-6 py-3">Reorder Level</th>
                    <th class="px-6 py-3">Supplier</th>
                    <th class="px-6 py-3">Last Updated</th>
                    <th class="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${lowStockItems.map(item => {
                    const isOutOfStock = item.quantity === 0;
                    return `
                      <tr class="border-b border-gray-100">
                        <td class="px-6 py-4 font-medium">${item.name}</td>
                        <td class="px-6 py-4">${item.category}</td>
                        <td class="px-6 py-4">${item.quantity}</td>
                        <td class="px-6 py-4">${item.reorderLevel}</td>
                        <td class="px-6 py-4">${item.supplier}</td>
                        <td class="px-6 py-4">${item.lastUpdated}</td>
                        <td class="px-6 py-4">
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isOutOfStock ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}">
                            ${isOutOfStock ? 'Out of Stock' : 'Low Stock'}
                          </span>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
            
            ${lowStockItems.length === 0 ? `
              <div class="text-center text-gray-500 py-6">
                Good job! No items with low stock.
              </div>
            ` : ''}
          </div>
        </div>
        
        <div class="grid grid-cols-1">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 class="font-bold text-gray-800 mb-4">Inventory Status</h3>
            
            <div class="mb-6">
              <h4 class="font-medium text-gray-700 mb-2">Category Distribution</h4>
              <div id="categoryDistributionChart" class="h-48">
                <!-- Category distribution chart will be rendered here -->
              </div>
            </div>
            
            <div class="mb-6">
              <h4 class="font-medium text-gray-700 mb-2">Stock Health</h4>
              <div id="stockHealthChart" class="h-48">
                <!-- Stock health chart will be rendered here -->
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.renderTopProductsChart();
    this.renderCategoryDistributionChart();
    this.renderStockHealthChart();
  }
  
  setupEventListeners() {
    // Sales report generation
    const generateSalesReportBtn = this.container.querySelector('#generateSalesReport');
    if (generateSalesReportBtn) {
      generateSalesReportBtn.addEventListener('click', () => {
        this.generateSalesReport();
      });
    }
    
    // Print low stock report
    const printLowStockBtn = this.container.querySelector('#printLowStockBtn');
    if (printLowStockBtn) {
      printLowStockBtn.addEventListener('click', () => {
        // In a real implementation, this would open a print dialog
        alert('Printing functionality would be implemented here. In a real application, this would generate a printable report.');
      });
    }
  }
  
  generateSalesReport() {
    const startDateInput = this.container.querySelector('#salesStartDate');
    const endDateInput = this.container.querySelector('#salesEndDate');
    
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    
    // Get sales within the date range
    const salesInRange = dataService.getSalesByDate(startDate, endDate);
    
    // Calculate total sales and average sale amount
    const totalSales = salesInRange.length;
    const totalAmount = salesInRange.reduce((sum, sale) => sum + sale.total, 0);
    const averageSaleAmount = totalSales > 0 ? totalAmount / totalSales : 0;
    
    // Count unique customers
    const uniqueCustomers = new Set();
    salesInRange.forEach(sale => uniqueCustomers.add(sale.customer));
    
    // Group sales by day for the chart
    const salesByDay = {};
    salesInRange.forEach(sale => {
      if (!salesByDay[sale.date]) {
        salesByDay[sale.date] = {
          date: sale.date,
          count: 0,
          total: 0
        };
      }
      salesByDay[sale.date].count++;
      salesByDay[sale.date].total += sale.total;
    });
    
    // Convert to array and sort by date
    const salesByDayArray = Object.values(salesByDay).sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
    
    // Find top 3 selling products in the date range
    const productSales = {};
    salesInRange.forEach(sale => {
      sale.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            productId: item.productId,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.quantity * item.price;
      });
    });
    
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3);
    
    // Get product names
    const inventory = dataService.getInventory();
    topProducts.forEach(product => {
      const inventoryItem = inventory.find(item => item.id === product.productId);
      product.name = inventoryItem ? inventoryItem.name : 'Unknown Product';
    });
    
    // Render the report
    const resultsContainer = this.container.querySelector('#salesReportResults');
    
    if (salesInRange.length === 0) {
      resultsContainer.innerHTML = `
        <div class="text-center text-gray-500 py-6">
          No sales found in the selected date range
        </div>
      `;
      return;
    }
    
    resultsContainer.innerHTML = `
      <div class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="border border-gray-100 rounded-lg p-3">
            <p class="text-sm text-gray-500 mb-1">Total Sales</p>
            <p class="text-xl font-bold">${totalSales}</p>
          </div>
          <div class="border border-gray-100 rounded-lg p-3">
            <p class="text-sm text-gray-500 mb-1">Revenue</p>
            <p class="text-xl font-bold">$${totalAmount.toFixed(2)}</p>
          </div>
          <div class="border border-gray-100 rounded-lg p-3">
            <p class="text-sm text-gray-500 mb-1">Unique Customers</p>
            <p class="text-xl font-bold">${uniqueCustomers.size}</p>
          </div>
        </div>
        
        <div>
          <h4 class="text-sm font-medium text-gray-700 mb-2">Daily Sales</h4>
          <div class="flex items-end h-32 gap-1">
            ${this.renderSalesByDayChart(salesByDayArray)}
          </div>
          <div class="flex justify-between mt-1 text-xs text-gray-500">
            <span>${startDate}</span>
            <span>${endDate}</span>
          </div>
        </div>
        
        <div>
          <h4 class="text-sm font-medium text-gray-700 mb-2">Top Selling Products</h4>
          <div class="space-y-2">
            ${topProducts.map((product, index) => `
              <div>
                <div class="flex justify-between text-sm">
                  <span>${product.name}</span>
                  <span>$${product.revenue.toFixed(2)}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div class="bg-agrovet-500 h-1.5 rounded-full" style="width: ${Math.min((product.revenue / topProducts[0].revenue) * 100, 100)}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
  
  renderSalesByDayChart(salesByDay) {
    if (salesByDay.length === 0) {
      return '<div class="text-center text-gray-500 w-full">No data available</div>';
    }
    
    // Find maximum total for scaling
    const maxTotal = Math.max(...salesByDay.map(day => day.total));
    
    return salesByDay.map(day => {
      const height = Math.max((day.total / maxTotal) * 100, 10); // Minimum height of 10% for visibility
      
      return `
        <div class="flex flex-col items-center flex-1">
          <div class="w-full bg-agrovet-500 rounded-t" style="height: ${height}%"></div>
          <span class="text-xs mt-1 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center" title="${day.date}">
            ${day.date.split('-')[2]}
          </span>
        </div>
      `;
    }).join('');
  }
  
  renderTopProductsChart() {
    const topProducts = dataService.getTopSellingProducts(5);
    const chartContainer = this.container.querySelector('#topProductsChart');
    
    if (!chartContainer) return;
    
    if (topProducts.length === 0) {
      chartContainer.innerHTML = `
        <div class="h-full flex items-center justify-center text-gray-500">
          No sales data available
        </div>
      `;
      return;
    }
    
    // Find maximum quantity for scaling
    const maxQuantity = Math.max(...topProducts.map(product => product.totalQuantity));
    
    chartContainer.innerHTML = `
      <div class="space-y-4">
        ${topProducts.map(product => {
          const percentage = Math.min((product.totalQuantity / maxQuantity) * 100, 100);
          
          return `
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-sm font-medium">${product.name}</span>
                <span class="text-sm text-gray-500">${product.totalQuantity} units</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-agrovet-500 h-2.5 rounded-full" style="width: ${percentage}%"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
  
  renderCategoryDistributionChart() {
    const inventory = dataService.getInventory();
    const chartContainer = this.container.querySelector('#categoryDistributionChart');
    
    if (!chartContainer) return;
    
    if (inventory.length === 0) {
      chartContainer.innerHTML = `
        <div class="h-full flex items-center justify-center text-gray-500">
          No inventory data available
        </div>
      `;
      return;
    }
    
    // Group by category
    const categories = {};
    inventory.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = {
          category: item.category,
          count: 0,
          value: 0
        };
      }
      categories[item.category].count++;
      categories[item.category].value += item.quantity * item.price;
    });
    
    const categoryData = Object.values(categories).sort((a, b) => b.value - a.value);
    const totalValue = categoryData.reduce((sum, cat) => sum + cat.value, 0);
    
    chartContainer.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div class="flex flex-wrap gap-1 h-full">
            ${categoryData.map((cat, index) => {
              const percentage = (cat.value / totalValue) * 100;
              const colors = ['bg-agrovet-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500'];
              const colorClass = colors[index % colors.length];
              
              return `
                <div
                  class="flex-grow ${colorClass} rounded-sm"
                  style="height: 24px; min-width: ${percentage}%;"
                  title="${cat.category}: $${cat.value.toFixed(2)} (${percentage.toFixed(1)}%)"
                ></div>
              `;
            }).join('')}
          </div>
        </div>
        <div>
          <div class="space-y-2 text-sm">
            ${categoryData.map((cat, index) => {
              const percentage = (cat.value / totalValue) * 100;
              const colors = ['bg-agrovet-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500'];
              const colorClass = colors[index % colors.length];
              
              return `
                <div class="flex items-center">
                  <span class="inline-block w-2 h-2 ${colorClass} mr-2 rounded-full"></span>
                  <span class="flex-grow">${cat.category}</span>
                  <span class="text-gray-500">${percentage.toFixed(1)}%</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }
  
  renderStockHealthChart() {
    const inventory = dataService.getInventory();
    const chartContainer = this.container.querySelector('#stockHealthChart');
    
    if (!chartContainer) return;
    
    if (inventory.length === 0) {
      chartContainer.innerHTML = `
        <div class="h-full flex items-center justify-center text-gray-500">
          No inventory data available
        </div>
      `;
      return;
    }
    
    // Categorize items by stock status
    let outOfStock = 0;
    let lowStock = 0;
    let healthyStock = 0;
    let overstock = 0;
    
    inventory.forEach(item => {
      if (item.quantity === 0) {
        outOfStock++;
      } else if (item.quantity <= item.reorderLevel) {
        lowStock++;
      } else if (item.quantity <= item.reorderLevel * 2) {
        healthyStock++;
      } else {
        overstock++;
      }
    });
    
    const totalItems = inventory.length;
    
    chartContainer.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div class="h-full flex items-end gap-4">
            <div class="flex flex-col items-center flex-1">
              <span class="mb-1 text-xs text-gray-500">${Math.round((outOfStock / totalItems) * 100)}%</span>
              <div class="w-full bg-red-500 rounded-t" style="height: ${(outOfStock / totalItems) * 100}%"></div>
              <span class="mt-1 text-xs">Out of Stock</span>
            </div>
            <div class="flex flex-col items-center flex-1">
              <span class="mb-1 text-xs text-gray-500">${Math.round((lowStock / totalItems) * 100)}%</span>
              <div class="w-full bg-orange-400 rounded-t" style="height: ${(lowStock / totalItems) * 100}%"></div>
              <span class="mt-1 text-xs">Low Stock</span>
            </div>
            <div class="flex flex-col items-center flex-1">
              <span class="mb-1 text-xs text-gray-500">${Math.round((healthyStock / totalItems) * 100)}%</span>
              <div class="w-full bg-agrovet-500 rounded-t" style="height: ${(healthyStock / totalItems) * 100}%"></div>
              <span class="mt-1 text-xs">Healthy</span>
            </div>
            <div class="flex flex-col items-center flex-1">
              <span class="mb-1 text-xs text-gray-500">${Math.round((overstock / totalItems) * 100)}%</span>
              <div class="w-full bg-blue-500 rounded-t" style="height: ${(overstock / totalItems) * 100}%"></div>
              <span class="mt-1 text-xs">Overstock</span>
            </div>
          </div>
        </div>
        <div>
          <div class="space-y-2 text-sm">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <span class="inline-block w-2 h-2 bg-red-500 mr-2 rounded-full"></span>
                <span>Out of Stock</span>
              </div>
              <span class="text-gray-500">${outOfStock} items</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <span class="inline-block w-2 h-2 bg-orange-400 mr-2 rounded-full"></span>
                <span>Low Stock</span>
              </div>
              <span class="text-gray-500">${lowStock} items</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <span class="inline-block w-2 h-2 bg-agrovet-500 mr-2 rounded-full"></span>
                <span>Healthy Stock</span>
              </div>
              <span class="text-gray-500">${healthyStock} items</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <span class="inline-block w-2 h-2 bg-blue-500 mr-2 rounded-full"></span>
                <span>Overstock</span>
              </div>
              <span class="text-gray-500">${overstock} items</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
