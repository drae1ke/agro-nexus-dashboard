
/**
 * Sidebar Component for Agrovet Dashboard
 */

import { createRoot } from 'react-dom/client';

export default class Sidebar {
  constructor(container) {
    this.container = container;
    this.activeRoute = 'dashboard';
    this.render();
    this.addEventListeners();
  }

  createNavItem(id, label, icon) {
    return `
      <li class="nav-item ${id === this.activeRoute ? 'active' : ''}">
        <a href="#" data-route="${id}" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-agrovet-100 ${id === this.activeRoute ? 'bg-agrovet-100 font-medium text-agrovet-800' : 'text-gray-600'}">
          <i class="${icon} w-5 h-5"></i>
          <span>${label}</span>
        </a>
      </li>
    `;
  }

  render() {
    const sidebar = document.createElement('aside');
    sidebar.className = 'bg-white border-r border-gray-200 min-h-screen w-64 flex-shrink-0';
    
    sidebar.innerHTML = `
      <div class="flex flex-col h-full">
        <div class="p-4 border-b border-gray-200">
          <div class="flex items-center gap-2">
            <div class="bg-gradient-to-r from-green-600 to-green-400 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl">A</div>
            <div class="flex flex-col">
              <h1 class="font-bold text-xl text-agrovet-700">AgroVet</h1>
              <p class="text-xs text-gray-500">Management System</p>
            </div>
          </div>
        </div>
        
        <div class="p-4 flex-grow">
          <nav>
            <ul class="space-y-1">
              ${this.createNavItem('dashboard', 'Dashboard', 'icon-dashboard')}
              ${this.createNavItem('inventory', 'Inventory', 'icon-inventory')}
              ${this.createNavItem('customers', 'Customers', 'icon-customers')}
              ${this.createNavItem('sales', 'Sales', 'icon-sales')}
              ${this.createNavItem('reports', 'Reports', 'icon-reports')}
            </ul>
          </nav>
        </div>
        
        <div class="border-t border-gray-200 p-4">
          <div class="flex items-center gap-3">
            <div class="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
              <i class="icon-user text-gray-600"></i>
            </div>
            <div>
              <p class="font-medium text-sm">Admin User</p>
              <p class="text-gray-500 text-xs">admin@agrovet.com</p>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.container.appendChild(sidebar);
  }

  addEventListeners() {
    const navItems = this.container.querySelectorAll('.nav-item a');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const route = e.currentTarget.dataset.route;
        this.activeRoute = route;
        
        // Update active state
        navItems.forEach(link => {
          link.classList.remove('bg-agrovet-100', 'font-medium', 'text-agrovet-800');
          link.classList.add('text-gray-600');
        });
        e.currentTarget.classList.add('bg-agrovet-100', 'font-medium', 'text-agrovet-800');
        e.currentTarget.classList.remove('text-gray-600');
        
        // Emit navigation event
        const event = new CustomEvent('navigation', {
          detail: { route }
        });
        document.dispatchEvent(event);
      });
    });
  }
  
  updateActiveRoute(route) {
    this.activeRoute = route;
    const navItems = this.container.querySelectorAll('.nav-item a');
    navItems.forEach(item => {
      const itemRoute = item.dataset.route;
      if (itemRoute === route) {
        item.classList.add('bg-agrovet-100', 'font-medium', 'text-agrovet-800');
        item.classList.remove('text-gray-600');
      } else {
        item.classList.remove('bg-agrovet-100', 'font-medium', 'text-agrovet-800');
        item.classList.add('text-gray-600');
      }
    });
  }
}
