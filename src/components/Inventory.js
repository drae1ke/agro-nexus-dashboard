/**
 * Inventory Management Component for Agrovet Dashboard
 */

import dataService from '../services/dataService.js';
import { createRoot } from 'react-dom/client';
import Icons from './Icons';

export default class Inventory {
  constructor(container) {
    this.container = container;
    this.inventory = [];
    this.filteredInventory = [];
    this.currentFilter = 'all';
    this.searchTerm = '';
    
    this.init();
  }
  
  async init() {
    this.loadInventory();
    this.render();
    this.setupEventListeners();
  }
  
  loadInventory() {
    this.inventory = dataService.getInventory();
    this.applyFilters();
  }
  
  applyFilters() {
    this.filteredInventory = this.inventory.filter(item => {
      // Apply category filter
      if (this.currentFilter !== 'all' && item.category !== this.currentFilter) {
        return false;
      }
      
      // Apply search filter
      if (this.searchTerm && !item.name.toLowerCase().includes(this.searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }
  
  getCategories() {
    const categories = new Set();
    this.inventory.forEach(item => categories.add(item.category));
    return ['all', ...Array.from(categories)];
  }
  
  getStockStatus(item) {
    if (item.quantity === 0) {
      return { class: 'stock-status-out', text: 'Out of Stock' };
    } else if (item.quantity <= item.reorderLevel) {
      return { class: 'stock-status-low', text: 'Low Stock' };
    } else {
      return { class: 'stock-status-good', text: 'In Stock' };
    }
  }
  
  render() {
    const categories = this.getCategories();
    
    // Create icon containers
    const plusIconContainer = document.createElement('div');
    const plusIconRoot = createRoot(plusIconContainer);
    plusIconRoot.render(<Icons.Plus />);

    const searchIconContainer = document.createElement('div');
    const searchIconRoot = createRoot(searchIconContainer);
    searchIconRoot.render(<Icons.Search />);

    const xIconContainer = document.createElement('div');
    const xIconRoot = createRoot(xIconContainer);
    xIconRoot.render(<Icons.X />);
    
    this.container.innerHTML = `
      <div class="p-6 max-w-full">
        <header class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Inventory Management</h1>
            <p class="text-gray-500">Manage your stock, add new items and monitor inventory levels</p>
          </div>
          <button id="addInventoryBtn" class="bg-agrovet-600 hover:bg-agrovet-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <div>${plusIconContainer.innerHTML}</div>
            <span>Add New Item</span>
          </button>
        </header>
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div class="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div class="flex items-center gap-3 flex-wrap">
              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <div>${searchIconContainer.innerHTML}</div>
                </span>
                <input 
                  id="inventorySearch" 
                  type="text" 
                  placeholder="Search inventory..." 
                  class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500"
                >
              </div>
              
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-gray-500">Filter by:</span>
                <div class="flex flex-wrap gap-2">
                  ${categories.map(category => `
                    <button data-filter="${category}" class="filter-btn px-3 py-1 rounded-full text-sm ${this.currentFilter === category ? 'bg-agrovet-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}">
                      ${category === 'all' ? 'All Categories' : category}
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>
            
            <div>
              <span class="text-gray-500">${this.filteredInventory.length} items</span>
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th class="px-6 py-3">Name</th>
                  <th class="px-6 py-3">Category</th>
                  <th class="px-6 py-3">Quantity</th>
                  <th class="px-6 py-3">Price</th>
                  <th class="px-6 py-3">Status</th>
                  <th class="px-6 py-3">Last Updated</th>
                  <th class="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody id="inventoryTableBody">
                ${this.renderInventoryRows()}
              </tbody>
            </table>
          </div>
          
          <div id="noItemsMessage" class="${this.filteredInventory.length > 0 ? 'hidden' : ''} p-8 text-center text-gray-500">
            No inventory items match your search.
          </div>
        </div>
      </div>
      
      <!-- Add/Edit Modal -->
      <div id="inventoryModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 hidden items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-lg m-4">
          <div class="border-b border-gray-200 p-4 flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-800" id="modalTitle">Add New Inventory Item</h3>
            <button id="closeModalBtn" class="text-gray-500 hover:text-gray-700">
              <div>${xIconContainer.innerHTML}</div>
            </button>
          </div>
          <form id="inventoryForm" class="p-6">
            <input type="hidden" id="itemId">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="col-span-2">
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input id="name" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500">
              </div>
              
              <div>
                <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select id="category" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500">
                  <option value="">Select a category</option>
                  <option value="Feed">Feed</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Crop Care">Crop Care</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Supplements">Supplements</option>
                  <option value="Seeds">Seeds</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label for="quantity" class="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input id="quantity" type="number" min="0" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500">
              </div>
              
              <div>
                <label for="price" class="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input id="price" type="number" step="0.01" min="0" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500">
              </div>
              
              <div>
                <label for="reorderLevel" class="block text-sm font-medium text-gray-700 mb-1">Reorder Level</label>
                <input id="reorderLevel" type="number" min="0" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500">
              </div>
              
              <div class="col-span-2">
                <label for="supplier" class="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <input id="supplier" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500">
              </div>
            </div>
            
            <div class="mt-6 flex justify-end space-x-3">
              <button type="button" id="cancelBtn" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" class="px-4 py-2 bg-agrovet-600 text-white rounded-lg hover:bg-agrovet-700">
                Save Item
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Delete Confirmation Modal -->
      <div id="deleteConfirmModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 hidden items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md m-4">
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-800 mb-4">Delete Inventory Item</h3>
            <p class="text-gray-600 mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>
            
            <div class="flex justify-end space-x-3">
              <button id="cancelDeleteBtn" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                Cancel
              </button>
              <button id="confirmDeleteBtn" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Delete Item
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Re-apply event listeners when the DOM is re-rendered
    this.setupEventListeners();
  }
  
  renderInventoryRows() {
    if (this.filteredInventory.length === 0) {
      return '';
    }
    
    return this.filteredInventory.map(item => {
      const status = this.getStockStatus(item);
      
      return `
        <tr class="inventory-row border-b border-gray-100">
          <td class="px-6 py-4">
            <div class="font-medium text-gray-900">${item.name}</div>
            <div class="text-sm text-gray-500">SKU: AGV-${item.id.toString().padStart(4, '0')}</div>
          </td>
          <td class="px-6 py-4">${item.category}</td>
          <td class="px-6 py-4">${item.quantity}</td>
          <td class="px-6 py-4">$${item.price.toFixed(2)}</td>
          <td class="px-6 py-4">
            <span class="${status.class} inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
              ${status.text}
            </span>
          </td>
          <td class="px-6 py-4 text-gray-500">${item.lastUpdated}</td>
          <td class="px-6 py-4 text-right whitespace-nowrap">
            <button data-id="${item.id}" class="edit-btn text-blue-600 hover:text-blue-900 mr-3">Edit</button>
            <button data-id="${item.id}" class="delete-btn text-red-600 hover:text-red-900">Delete</button>
          </td>
        </tr>
      `;
    }).join('');
  }
  
  updateTable() {
    const tableBody = this.container.querySelector('#inventoryTableBody');
    const noItemsMessage = this.container.querySelector('#noItemsMessage');
    
    tableBody.innerHTML = this.renderInventoryRows();
    
    if (this.filteredInventory.length === 0) {
      noItemsMessage.classList.remove('hidden');
    } else {
      noItemsMessage.classList.add('hidden');
    }
    
    this.setupRowEventListeners();
  }
  
  setupEventListeners() {
    // Search functionality
    const searchInput = this.container.querySelector('#inventorySearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value;
        this.applyFilters();
        this.updateTable();
      });
    }
    
    // Filter buttons
    const filterButtons = this.container.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const filter = e.target.dataset.filter;
        this.currentFilter = filter;
        
        // Update active filter button
        filterButtons.forEach(b => {
          b.classList.remove('bg-agrovet-600', 'text-white');
          b.classList.add('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
        });
        e.target.classList.remove('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
        e.target.classList.add('bg-agrovet-600', 'text-white');
        
        this.applyFilters();
        this.updateTable();
      });
    });
    
    // Add new button
    const addButton = this.container.querySelector('#addInventoryBtn');
    if (addButton) {
      addButton.addEventListener('click', () => {
        this.openModal();
      });
    }
    
    // Modal close button
    const closeModalBtn = this.container.querySelector('#closeModalBtn');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        this.closeModal();
      });
    }
    
    // Cancel button
    const cancelBtn = this.container.querySelector('#cancelBtn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.closeModal();
      });
    }
    
    // Form submission
    const form = this.container.querySelector('#inventoryForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveInventoryItem();
      });
    }
    
    // Cancel Delete button
    const cancelDeleteBtn = this.container.querySelector('#cancelDeleteBtn');
    if (cancelDeleteBtn) {
      cancelDeleteBtn.addEventListener('click', () => {
        this.closeDeleteModal();
      });
    }
    
    // Confirm Delete button
    const confirmDeleteBtn = this.container.querySelector('#confirmDeleteBtn');
    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener('click', () => {
        this.deleteItem();
      });
    }
    
    this.setupRowEventListeners();
  }
  
  setupRowEventListeners() {
    // Edit buttons
    const editButtons = this.container.querySelectorAll('.edit-btn');
    editButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        this.editItem(id);
      });
    });
    
    // Delete buttons
    const deleteButtons = this.container.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        this.openDeleteModal(id);
      });
    });
  }
  
  openModal(item = null) {
    const modal = this.container.querySelector('#inventoryModal');
    const form = this.container.querySelector('#inventoryForm');
    const modalTitle = this.container.querySelector('#modalTitle');
    
    // Reset form
    form.reset();
    
    if (item) {
      // Edit mode
      modalTitle.textContent = 'Edit Inventory Item';
      this.container.querySelector('#itemId').value = item.id;
      this.container.querySelector('#name').value = item.name;
      this.container.querySelector('#category').value = item.category;
      this.container.querySelector('#quantity').value = item.quantity;
      this.container.querySelector('#price').value = item.price;
      this.container.querySelector('#reorderLevel').value = item.reorderLevel;
      this.container.querySelector('#supplier').value = item.supplier;
    } else {
      // Add mode
      modalTitle.textContent = 'Add New Inventory Item';
      this.container.querySelector('#itemId').value = '';
    }
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
  
  closeModal() {
    const modal = this.container.querySelector('#inventoryModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  
  openDeleteModal(id) {
    const modal = this.container.querySelector('#deleteConfirmModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    const confirmButton = this.container.querySelector('#confirmDeleteBtn');
    confirmButton.dataset.id = id;
  }
  
  closeDeleteModal() {
    const modal = this.container.querySelector('#deleteConfirmModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  
  editItem(id) {
    const item = this.inventory.find(item => item.id === Number(id));
    if (item) {
      this.openModal(item);
    }
  }
  
  saveInventoryItem() {
    const form = this.container.querySelector('#inventoryForm');
    const id = this.container.querySelector('#itemId').value;
    
    // Collect form data
    const itemData = {
      name: this.container.querySelector('#name').value,
      category: this.container.querySelector('#category').value,
      quantity: Number(this.container.querySelector('#quantity').value),
      price: Number(this.container.querySelector('#price').value),
      reorderLevel: Number(this.container.querySelector('#reorderLevel').value),
      supplier: this.container.querySelector('#supplier').value,
    };
    
    try {
      // Validate form
      if (!itemData.name || !itemData.category || itemData.quantity < 0 || itemData.price <= 0) {
        alert('Please fill in all required fields correctly');
        return;
      }
      
      // Save data
      if (id) {
        // Update existing item
        dataService.updateInventoryItem(id, itemData);
      } else {
        // Add new item
        dataService.addInventoryItem(itemData);
      }
      
      // Reload data and refresh table
      this.loadInventory();
      this.updateTable();
      this.closeModal();
      
      // Show success notification (simplified)
      alert(id ? 'Item updated successfully!' : 'Item added successfully!');
    } catch (error) {
      alert('Error saving item: ' + error.message);
    }
  }
  
  deleteItem() {
    const confirmButton = this.container.querySelector('#confirmDeleteBtn');
    const id = confirmButton.dataset.id;
    
    try {
      dataService.deleteInventoryItem(id);
      
      // Reload data and refresh table
      this.loadInventory();
      this.updateTable();
      this.closeDeleteModal();
      
      // Show success notification (simplified)
      alert('Item deleted successfully!');
    } catch (error) {
      alert('Error deleting item: ' + error.message);
    }
  }
}
