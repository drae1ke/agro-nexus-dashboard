
/**
 * Main App Component for Agrovet Dashboard
 */

import Sidebar from './Sidebar.js';
import Dashboard from './Dashboard.js';
import Inventory from './Inventory.js';
import Customers from './Customers.js';
import Sales from './Sales.js';
import Reports from './Reports.js';
import Icons from './Icons.js';
import dataService from '../services/dataService.js';

export default class App {
  constructor(container) {
    this.container = container;
    this.activeComponent = null;
    this.activeRoute = 'dashboard';
    
    // Initialize
    this.init();
  }
  
  async init() {
    // Initialize icons
    Icons.init();
    
    // Initialize data
    dataService.initializeData();
    
    // Create main layout
    this.createLayout();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Load default route
    this.loadRoute(this.activeRoute);
  }
  
  createLayout() {
    this.container.innerHTML = `
      <div class="min-h-screen bg-gray-50 flex">
        <div id="sidebar-container"></div>
        <div class="flex-grow overflow-hidden">
          <main id="content" class="min-h-screen"></main>
        </div>
      </div>
    `;
    
    // Initialize sidebar
    this.sidebar = new Sidebar(this.container.querySelector('#sidebar-container'));
  }
  
  setupEventListeners() {
    // Listen for navigation events from the sidebar
    document.addEventListener('navigation', (e) => {
      this.loadRoute(e.detail.route);
    });
  }
  
  loadRoute(route) {
    this.activeRoute = route;
    
    // Update the sidebar active state
    this.sidebar.updateActiveRoute(route);
    
    // Get the content container
    const contentContainer = this.container.querySelector('#content');
    
    // Clear existing content
    while (contentContainer.firstChild) {
      contentContainer.removeChild(contentContainer.firstChild);
    }
    
    // Load the appropriate component based on the route
    switch (route) {
      case 'dashboard':
        this.activeComponent = new Dashboard(contentContainer);
        break;
      case 'inventory':
        this.activeComponent = new Inventory(contentContainer);
        break;
      case 'customers':
        this.activeComponent = new Customers(contentContainer);
        break;
      case 'sales':
        this.activeComponent = new Sales(contentContainer);
        break;
      case 'reports':
        this.activeComponent = new Reports(contentContainer);
        break;
      default:
        this.activeComponent = new Dashboard(contentContainer);
        break;
    }
  }
}
