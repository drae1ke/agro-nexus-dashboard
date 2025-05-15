/**
 * Dashboard Component for Agrovet Management System
 */

import dataService from '../services/dataService.js';
import { format } from 'date-fns';
import { createRoot } from 'react-dom/client';
import Icons from './Icons';

export default class Dashboard {
  constructor(container) {
    this.container = container;
    this.render();
    this.setupCharts();
  }

  render() {
    const inventoryValue = dataService.getInventoryValue();
    const lowStockItems = dataService.getLowStockItems();
    const recentSales = dataService.getSales().slice(-5).reverse();
    const topProducts = dataService.getTopSellingProducts(5);
    
    const todayDate = format(new Date(), 'EEEE, MMMM do, yyyy');
    
    // Create icon containers
    const inventoryIconContainer = document.createElement('div');
    const inventoryIconRoot = createRoot(inventoryIconContainer);
    inventoryIconRoot.render(<Icons.Inventory />);

    const alertIconContainer = document.createElement('div');
    const alertIconRoot = createRoot(alertIconContainer);
    alertIconRoot.render(<Icons.Alert />);

    const customersIconContainer = document.createElement('div');
    const customersIconRoot = createRoot(customersIconContainer);
    customersIconRoot.render(<Icons.Customers />);

    const salesIconContainer = document.createElement('div');
    const salesIconRoot = createRoot(salesIconContainer);
    salesIconRoot.render(<Icons.Sales />);
    
    this.container.innerHTML = `
      <div class="p-6 max-w-full">
        <header class="mb-8">
          <h1 class="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p class="text-gray-500">${todayDate}</p>
        </header>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="dashboard-card bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div class="flex items-center mb-4">
              <div class="bg-agrovet-100 p-3 rounded-lg">
                <div class="text-agrovet-600">${inventoryIconContainer.innerHTML}</div>
              </div>
              <h3 class="ml-4 text-gray-500 font-medium">Inventory Value</h3>
            </div>
            <p class="text-2xl font-bold">$${inventoryValue}</p>
            <div class="mt-2 text-sm flex items-center">
              <span class="text-green-600">↑ 12% </span>
              <span class="text-gray-500 ml-1">from last month</span>
            </div>
          </div>
          
          <div class="dashboard-card bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div class="flex items-center mb-4">
              <div class="bg-orange-100 p-3 rounded-lg">
                <div class="text-orange-600">${alertIconContainer.innerHTML}</div>
              </div>
              <h3 class="ml-4 text-gray-500 font-medium">Low Stock Items</h3>
            </div>
            <p class="text-2xl font-bold">${lowStockItems.length}</p>
            <div class="mt-2 text-sm">
              <span class="text-orange-600">Needs attention</span>
            </div>
          </div>
          
          <div class="dashboard-card bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div class="flex items-center mb-4">
              <div class="bg-blue-100 p-3 rounded-lg">
                <div class="text-blue-600">${customersIconContainer.innerHTML}</div>
              </div>
              <h3 class="ml-4 text-gray-500 font-medium">Total Customers</h3>
            </div>
            <p class="text-2xl font-bold">${dataService.getCustomers().length}</p>
            <div class="mt-2 text-sm flex items-center">
              <span class="text-blue-600">+2 </span>
              <span class="text-gray-500 ml-1">this week</span>
            </div>
          </div>
          
          <div class="dashboard-card bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div class="flex items-center mb-4">
              <div class="bg-purple-100 p-3 rounded-lg">
                <div class="text-purple-600">${salesIconContainer.innerHTML}</div>
              </div>
              <h3 class="ml-4 text-gray-500 font-medium">Total Sales</h3>
            </div>
            <p class="text-2xl font-bold">${dataService.getSales().length}</p>
            <div class="mt-2 text-sm flex items-center">
              <span class="text-green-600">↑ 5% </span>
              <span class="text-gray-500 ml-1">from last week</span>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div class="col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 class="font-bold text-gray-800 mb-4">Sales Activity</h3>
            <div id="salesChart" class="agrovet-chart-container"></div>
          </div>
          
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 class="font-bold text-gray-800 mb-4">Stock Categories</h3>
            <div id="categoriesChart" class="agrovet-chart-container"></div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-bold text-gray-800">Recent Sales</h3>
              <button class="text-agrovet-600 hover:text-agrovet-700 text-sm font-medium">View All</button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="text-left py-3 px-2 font-medium text-gray-600">Customer</th>
                    <th class="text-left py-3 px-2 font-medium text-gray-600">Date</th>
                    <th class="text-right py-3 px-2 font-medium text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${recentSales.map(sale => `
                    <tr class="border-b border-gray-100">
                      <td class="py-3 px-2">${sale.customer}</td>
                      <td class="py-3 px-2">${sale.date}</td>
                      <td class="py-3 px-2 text-right">$${sale.total.toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-bold text-gray-800">Top Selling Products</h3>
              <button class="text-agrovet-600 hover:text-agrovet-700 text-sm font-medium">View Report</button>
            </div>
            <div class="space-y-4">
              ${topProducts.map((product, index) => `
                <div class="flex items-center gap-3">
                  <span class="bg-gray-100 text-gray-600 h-8 w-8 rounded-full flex items-center justify-center font-medium">
                    ${index + 1}
                  </span>
                  <div class="flex-1">
                    <h4 class="text-sm font-medium">${product.name}</h4>
                    <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div class="bg-agrovet-500 h-1.5 rounded-full" style="width: ${Math.min(product.totalQuantity * 5, 100)}%"></div>
                    </div>
                  </div>
                  <span class="text-sm text-gray-600">${product.totalQuantity} units</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setupCharts() {
    // Dummy implementation for charts - would use a real charting library in production
    const salesChartEl = this.container.querySelector('#salesChart');
    if (salesChartEl) {
      salesChartEl.innerHTML = `
        <div class="flex items-end justify-between h-full py-4">
          <div class="flex flex-col items-center">
            <div class="w-12 bg-agrovet-500 rounded-t" style="height: 40%"></div>
            <span class="text-xs mt-2">Mon</span>
          </div>
          <div class="flex flex-col items-center">
            <div class="w-12 bg-agrovet-500 rounded-t" style="height: 65%"></div>
            <span class="text-xs mt-2">Tue</span>
          </div>
          <div class="flex flex-col items-center">
            <div class="w-12 bg-agrovet-500 rounded-t" style="height: 45%"></div>
            <span class="text-xs mt-2">Wed</span>
          </div>
          <div class="flex flex-col items-center">
            <div class="w-12 bg-agrovet-500 rounded-t" style="height: 80%"></div>
            <span class="text-xs mt-2">Thu</span>
          </div>
          <div class="flex flex-col items-center">
            <div class="w-12 bg-agrovet-500 rounded-t" style="height: 60%"></div>
            <span class="text-xs mt-2">Fri</span>
          </div>
          <div class="flex flex-col items-center">
            <div class="w-12 bg-agrovet-500 rounded-t" style="height: 30%"></div>
            <span class="text-xs mt-2">Sat</span>
          </div>
          <div class="flex flex-col items-center">
            <div class="w-12 bg-agrovet-500 rounded-t" style="height: 20%"></div>
            <span class="text-xs mt-2">Sun</span>
          </div>
        </div>
      `;
    }
    
    const categoriesChartEl = this.container.querySelector('#categoriesChart');
    if (categoriesChartEl) {
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
      
      categoriesChartEl.innerHTML = `
        <div class="space-y-4">
          ${categoryData.map(cat => `
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-sm font-medium">${cat.name}</span>
                <span class="text-sm text-gray-500">${cat.percentage}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-agrovet-500 h-2 rounded-full" style="width: ${cat.percentage}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  }
}
