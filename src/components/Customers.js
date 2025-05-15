/**
 * Customers Management Component for Agrovet Dashboard
 */

import dataService from '../services/dataService.js';
import { createRoot } from 'react-dom/client';
import Icons from './Icons';

export default class Customers {
  constructor(container) {
    this.container = container;
    this.customers = [];
    this.filteredCustomers = [];
    this.searchTerm = '';
    
    this.init();
  }
  
  async init() {
    this.loadCustomers();
    this.render();
    this.setupEventListeners();
  }
  
  loadCustomers() {
    this.customers = dataService.getCustomers();
    this.applyFilters();
  }
  
  applyFilters() {
    this.filteredCustomers = this.customers.filter(customer => {
      // Apply search filter
      if (this.searchTerm && !customer.name.toLowerCase().includes(this.searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }
  
  render() {
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
            <h1 class="text-2xl font-bold text-gray-800">Customer Management</h1>
            <p class="text-gray-500">View and manage your customer database</p>
          </div>
          <button id="addCustomerBtn" class="bg-agrovet-600 hover:bg-agrovet-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <div>${plusIconContainer.innerHTML}</div>
            <span>Add New Customer</span>
          </button>
        </header>
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div class="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div class="flex items-center gap-3">
              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <div>${searchIconContainer.innerHTML}</div>
                </span>
                <input 
                  id="customerSearch" 
                  type="text" 
                  placeholder="Search customers..." 
                  class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500"
                >
              </div>
            </div>
            
            <div>
              <span class="text-gray-500">${this.filteredCustomers.length} customers</span>
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th class="px-6 py-3">Customer</th>
                  <th class="px-6 py-3">Contact Details</th>
                  <th class="px-6 py-3">Last Purchase</th>
                  <th class="px-6 py-3">Total Spent</th>
                  <th class="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody id="customersTableBody">
                ${this.renderCustomerRows()}
              </tbody>
            </table>
          </div>
          
          <div id="noCustomersMessage" class="${this.filteredCustomers.length > 0 ? 'hidden' : ''} p-8 text-center text-gray-500">
            No customers match your search.
          </div>
        </div>
      </div>
      
      <!-- Add/Edit Modal -->
      <div id="customerModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 hidden items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-lg m-4">
          <div class="border-b border-gray-200 p-4 flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-800" id="modalTitle">Add New Customer</h3>
            <button id="closeModalBtn" class="text-gray-500 hover:text-gray-700">
              <div>${xIconContainer.innerHTML}</div>
            </button>
          </div>
          <form id="customerForm" class="p-6">
            <input type="hidden" id="customerId">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="col-span-2">
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input id="name" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500">
              </div>
              
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input id="phone" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500">
              </div>
              
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input id="email" type="email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500">
              </div>
              
              <div class="col-span-2">
                <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input id="address" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrovet-500 focus:border-agrovet-500">
              </div>
            </div>
            
            <div class="mt-6 flex justify-end space-x-3">
              <button type="button" id="cancelBtn" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" class="px-4 py-2 bg-agrovet-600 text-white rounded-lg hover:bg-agrovet-700">
                Save Customer
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Delete Confirmation Modal -->
      <div id="deleteConfirmModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 hidden items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md m-4">
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-800 mb-4">Delete Customer</h3>
            <p class="text-gray-600 mb-6">Are you sure you want to delete this customer? This action cannot be undone.</p>
            
            <div class="flex justify-end space-x-3">
              <button id="cancelDeleteBtn" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                Cancel
              </button>
              <button id="confirmDeleteBtn" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Delete Customer
              </button>
            </div>
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
        <tr class="border-b border-gray-100 hover:bg-gray-50">
          <td class="px-6 py-4">
            <div class="font-medium text-gray-900">${customer.name}</div>
            <div class="text-xs text-gray-500">ID: CUST-${customer.id.toString().padStart(4, '0')}</div>
          </td>
          <td class="px-6 py-4">
            <div class="text-sm text-gray-900">${customer.phone}</div>
            <div class="text-sm text-gray-500">${customer.email}</div>
          </td>
          <td class="px-6 py-4 text-gray-500">${customer.lastPurchase}</td>
          <td class="px-6 py-4 font-medium">$${customer.totalSpent.toFixed(2)}</td>
          <td class="px-6 py-4 text-right whitespace-nowrap">
            <button data-id="${customer.id}" class="view-customer-btn text-agrovet-600 hover:text-agrovet-900 mr-3">View</button>
            <button data-id="${customer.id}" class="edit-btn text-blue-600 hover:text-blue-900 mr-3">Edit</button>
            <button data-id="${customer.id}" class="delete-btn text-red-600 hover:text-red-900">Delete</button>
          </td>
        </tr>
      `;
    }).join('');
  }
  
  updateTable() {
    const tableBody = this.container.querySelector('#customersTableBody');
    const noCustomersMessage = this.container.querySelector('#noCustomersMessage');
    
    tableBody.innerHTML = this.renderCustomerRows();
    
    if (this.filteredCustomers.length === 0) {
      noCustomersMessage.classList.remove('hidden');
    } else {
      noCustomersMessage.classList.add('hidden');
    }
    
    this.setupRowEventListeners();
  }
  
  setupEventListeners() {
    // Search functionality
    const searchInput = this.container.querySelector('#customerSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value;
        this.applyFilters();
        this.updateTable();
      });
    }
    
    // Add new button
    const addButton = this.container.querySelector('#addCustomerBtn');
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
    const form = this.container.querySelector('#customerForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveCustomer();
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
        this.deleteCustomer();
      });
    }
    
    this.setupRowEventListeners();
  }
  
  setupRowEventListeners() {
    // View Customer buttons
    const viewButtons = this.container.querySelectorAll('.view-customer-btn');
    viewButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        this.viewCustomer(id);
      });
    });
    
    // Edit buttons
    const editButtons = this.container.querySelectorAll('.edit-btn');
    editButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        this.editCustomer(id);
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
  
  viewCustomer(id) {
    // For now, just use edit functionality
    this.editCustomer(id);
  }
  
  openModal(customer = null) {
    const modal = this.container.querySelector('#customerModal');
    const form = this.container.querySelector('#customerForm');
    const modalTitle = this.container.querySelector('#modalTitle');
    
    // Reset form
    form.reset();
    
    if (customer) {
      // Edit mode
      modalTitle.textContent = 'Edit Customer';
      this.container.querySelector('#customerId').value = customer.id;
      this.container.querySelector('#name').value = customer.name;
      this.container.querySelector('#phone').value = customer.phone;
      this.container.querySelector('#email').value = customer.email;
      this.container.querySelector('#address').value = customer.address;
    } else {
      // Add mode
      modalTitle.textContent = 'Add New Customer';
      this.container.querySelector('#customerId').value = '';
    }
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
  
  closeModal() {
    const modal = this.container.querySelector('#customerModal');
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
  
  editCustomer(id) {
    const customer = this.customers.find(c => c.id === Number(id));
    if (customer) {
      this.openModal(customer);
    }
  }
  
  saveCustomer() {
    const form = this.container.querySelector('#customerForm');
    const id = this.container.querySelector('#customerId').value;
    
    // Collect form data
    const customerData = {
      name: this.container.querySelector('#name').value,
      phone: this.container.querySelector('#phone').value,
      email: this.container.querySelector('#email').value,
      address: this.container.querySelector('#address').value,
    };
    
    try {
      // Validate form
      if (!customerData.name || !customerData.phone) {
        alert('Please fill in all required fields');
        return;
      }
      
      // Save data
      if (id) {
        // Update existing customer
        dataService.updateCustomer(id, customerData);
      } else {
        // Add new customer with default values for last purchase and total spent
        customerData.lastPurchase = '-';
        customerData.totalSpent = 0;
        dataService.addCustomer(customerData);
      }
      
      // Reload data and refresh table
      this.loadCustomers();
      this.updateTable();
      this.closeModal();
      
      // Show success notification (simplified)
      alert(id ? 'Customer updated successfully!' : 'Customer added successfully!');
    } catch (error) {
      alert('Error saving customer: ' + error.message);
    }
  }
  
  deleteCustomer() {
    const confirmButton = this.container.querySelector('#confirmDeleteBtn');
    const id = confirmButton.dataset.id;
    
    try {
      dataService.deleteCustomer(id);
      
      // Reload data and refresh table
      this.loadCustomers();
      this.updateTable();
      this.closeDeleteModal();
      
      // Show success notification (simplified)
      alert('Customer deleted successfully!');
    } catch (error) {
      alert('Error deleting customer: ' + error.message);
    }
  }
}
