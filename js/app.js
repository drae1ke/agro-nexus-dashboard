
/**
 * Main App Component for Agrovet Dashboard
 */
class App {
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
    
    // Add logout button to sidebar
    this.addLogoutToSidebar();
  }
  
  addLogoutToSidebar() {
    // Get user info
    const currentUser = JSON.parse(localStorage.getItem('agrovet_currentUser') || 'null');
    
    if (currentUser) {
      // Get sidebar container
      const sidebarContainer = this.container.querySelector('#sidebar-container');
      
      // Find sidebar footer
      let sidebarFooter = sidebarContainer.querySelector('.sidebar-footer');
      
      if (sidebarFooter) {
        // Create logout button
        const logoutBtn = document.createElement('div');
        logoutBtn.className = 'logout-button';
        logoutBtn.innerHTML = `
          <button class="btn-logout">
            <i class="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        `;
        
        // Add user info
        const userInfo = sidebarFooter.querySelector('.user-info');
        if (userInfo) {
          const userDetails = userInfo.querySelector('.user-details');
          if (userDetails && userDetails.querySelector('p')) {
            userDetails.querySelector('p').textContent = currentUser.username;
          }
        }
        
        // Add logout button to footer
        sidebarFooter.appendChild(logoutBtn);
        
        // Add event listener
        logoutBtn.addEventListener('click', this.handleLogout.bind(this));
      }
    }
  }
  
  handleLogout() {
    // Remove current user from localStorage
    localStorage.removeItem('agrovet_currentUser');
    
    // Redirect to login page
    window.location.href = 'login.html';
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

// Add CSS for the logout button
const style = document.createElement('style');
style.textContent = `
  .logout-button {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
  }
  
  .btn-logout {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem 1rem;
    color: var(--destructive);
    background: none;
    border: none;
    border-radius: var(--radius);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  .btn-logout:hover {
    background-color: rgba(239, 83, 80, 0.1);
  }
`;
document.head.appendChild(style);

// Initialize the App when the window loads
window.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.getElementById('app');
  if (appContainer) {
    window.app = new App(appContainer);
  }
});
