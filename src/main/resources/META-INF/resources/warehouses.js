const API_URL = '/api/warehouses';

let editMode = false;
let currentWarehouseId = null;

// Pagination variables
let allWarehouses = [];
let filteredWarehouses = [];
let currentPage = 1;
let itemsPerPage = 10;

// Filter state
let filters = {
    search: '',
    location: '',
    minCapacity: null,
    maxCapacity: null,
    minUtilization: null,
    maxUtilization: null,
    availabilityStatus: {
        available: false,
        nearFull: false,
        full: false
    },
    sortBy: ''
};

// Check authentication and set user info
const token = localStorage.getItem('token') || sessionStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');

if (!token) {
    window.location.href = '/login.html';
}

// Load warehouses on page load
document.addEventListener('DOMContentLoaded', () => {
    loadWarehouses();
    
    document.getElementById('warehouseForm').addEventListener('submit', handleSubmit);
});

// Open modal for adding new warehouse
function openAddModal() {
    editMode = false;
    currentWarehouseId = null;
    document.getElementById('warehouseForm').reset();
    document.getElementById('warehouseId').value = '';
    document.getElementById('modalTitle').textContent = 'Add New Warehouse';
    document.getElementById('submitBtnText').textContent = 'Save Warehouse';
    document.getElementById('warehouseModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Open modal for editing warehouse
function openEditModal(warehouse) {
    editMode = true;
    currentWarehouseId = warehouse.id;
    
    document.getElementById('warehouseId').value = warehouse.id;
    document.getElementById('name').value = warehouse.name;
    document.getElementById('location').value = warehouse.location;
    document.getElementById('address').value = warehouse.address || '';
    document.getElementById('capacity').value = warehouse.capacity;
    document.getElementById('currentStock').value = warehouse.currentStock;
    
    document.getElementById('modalTitle').textContent = 'Edit Warehouse';
    document.getElementById('submitBtnText').textContent = 'Update Warehouse';
    document.getElementById('warehouseModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close warehouse modal
function closeWarehouseModal() {
    document.getElementById('warehouseModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
    document.getElementById('warehouseForm').reset();
    editMode = false;
    currentWarehouseId = null;
}

// Logout function (already in sidebar.js, but keep for compatibility)
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = '/login.html';
}

// Load all warehouses
async function loadWarehouses() {
    try {
        const response = await fetch(API_URL);
        allWarehouses = await response.json();
        filteredWarehouses = [...allWarehouses];
        
        applyFilters();
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('warehousesTable').classList.remove('hidden');
    } catch (error) {
        showAlert('Failed to load warehouses: ' + error.message, 'error');
        document.getElementById('loading').classList.add('hidden');
    }
}

// Toggle filter panel
function toggleFilterPanel() {
    const panel = document.getElementById('filterPanel');
    const overlay = document.getElementById('filterOverlay');
    
    panel.classList.toggle('translate-x-full');
    overlay.classList.toggle('hidden');
}

// Apply filters
function applyFilters() {
    // Get filter values
    filters.search = document.getElementById('searchInput')?.value.toLowerCase() || '';
    filters.location = document.getElementById('locationFilter')?.value.toLowerCase() || '';
    filters.minCapacity = parseInt(document.getElementById('minCapacity')?.value) || null;
    filters.maxCapacity = parseInt(document.getElementById('maxCapacity')?.value) || null;
    filters.minUtilization = parseFloat(document.getElementById('minUtilization')?.value) || null;
    filters.maxUtilization = parseFloat(document.getElementById('maxUtilization')?.value) || null;
    filters.availabilityStatus.available = document.getElementById('filterAvailable')?.checked || false;
    filters.availabilityStatus.nearFull = document.getElementById('filterNearFull')?.checked || false;
    filters.availabilityStatus.full = document.getElementById('filterFull')?.checked || false;
    filters.sortBy = document.getElementById('sortBy')?.value || '';
    
    // Filter warehouses
    filteredWarehouses = allWarehouses.filter(warehouse => {
        // Search filter
        if (filters.search) {
            const searchMatch = warehouse.name.toLowerCase().includes(filters.search) ||
                               (warehouse.location && warehouse.location.toLowerCase().includes(filters.search)) ||
                               (warehouse.address && warehouse.address.toLowerCase().includes(filters.search));
            if (!searchMatch) return false;
        }
        
        // Location filter
        if (filters.location) {
            if (!warehouse.location || !warehouse.location.toLowerCase().includes(filters.location)) {
                return false;
            }
        }
        
        // Capacity range filter
        if (filters.minCapacity !== null && warehouse.capacity < filters.minCapacity) return false;
        if (filters.maxCapacity !== null && warehouse.capacity > filters.maxCapacity) return false;
        
        // Utilization range filter
        if (filters.minUtilization !== null && warehouse.utilizationPercentage < filters.minUtilization) return false;
        if (filters.maxUtilization !== null && warehouse.utilizationPercentage > filters.maxUtilization) return false;
        
        // Availability status filter
        if (filters.availabilityStatus.available || filters.availabilityStatus.nearFull || filters.availabilityStatus.full) {
            const isAvailable = warehouse.utilizationPercentage < 80;
            const isNearFull = warehouse.utilizationPercentage >= 80 && warehouse.utilizationPercentage < 100;
            const isFull = warehouse.utilizationPercentage >= 100;
            
            const matchStatus = (filters.availabilityStatus.available && isAvailable) ||
                               (filters.availabilityStatus.nearFull && isNearFull) ||
                               (filters.availabilityStatus.full && isFull);
            
            if (!matchStatus) return false;
        }
        
        return true;
    });
    
    // Sort warehouses
    if (filters.sortBy) {
        filteredWarehouses.sort((a, b) => {
            switch (filters.sortBy) {
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'capacity-asc':
                    return a.capacity - b.capacity;
                case 'capacity-desc':
                    return b.capacity - a.capacity;
                case 'utilization-asc':
                    return a.utilizationPercentage - b.utilizationPercentage;
                case 'utilization-desc':
                    return b.utilizationPercentage - a.utilizationPercentage;
                default:
                    return 0;
            }
        });
    }
    
    currentPage = 1; // Reset to first page
    displayWarehouses();
    // toggleFilterPanel(); // Close panel after applying - COMMENTED: Keep filter panel state unchanged
}

// Clear all filters
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('locationFilter').value = '';
    document.getElementById('minCapacity').value = '';
    document.getElementById('maxCapacity').value = '';
    document.getElementById('minUtilization').value = '';
    document.getElementById('maxUtilization').value = '';
    document.getElementById('filterAvailable').checked = false;
    document.getElementById('filterNearFull').checked = false;
    document.getElementById('filterFull').checked = false;
    document.getElementById('sortBy').value = '';
    
    filters = {
        search: '',
        location: '',
        minCapacity: null,
        maxCapacity: null,
        minUtilization: null,
        maxUtilization: null,
        availabilityStatus: {
            available: false,
            nearFull: false,
            full: false
        },
        sortBy: ''
    };
    
    filteredWarehouses = [...allWarehouses];
    currentPage = 1;
    displayWarehouses();
}

// Display warehouses with pagination
function displayWarehouses() {
    const tbody = document.getElementById('warehousesBody');
    tbody.innerHTML = '';
    
    if (filteredWarehouses.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                    No warehouses found. ${allWarehouses.length > 0 ? 'Try adjusting your filters.' : 'Add your first warehouse above!'}
                </td>
            </tr>
        `;
        updatePaginationInfo();
        return;
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedWarehouses = filteredWarehouses.slice(startIndex, endIndex);
    
    paginatedWarehouses.forEach(warehouse => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition';
        
        const utilizationColor = warehouse.utilizationPercentage > 80 ? 'red' : 
                                 warehouse.utilizationPercentage > 50 ? 'yellow' : 'green';
        
        row.innerHTML = `
            <td class="px-2 lg:px-4 py-1 text-xs lg:text-sm font-medium text-gray-900">${warehouse.id}</td>
            <td class="px-2 lg:px-4 py-1 text-xs lg:text-sm text-gray-900 font-semibold">${warehouse.name}</td>
            <td class="px-2 lg:px-4 py-1 text-xs lg:text-sm text-gray-600 hidden md:table-cell">${warehouse.location}</td>
            <td class="px-2 lg:px-4 py-1 text-xs lg:text-sm text-gray-900 hidden lg:table-cell">${formatNumber(warehouse.capacity)}</td>
            <td class="px-2 lg:px-4 py-1 text-xs lg:text-sm text-gray-900 hidden lg:table-cell">${formatNumber(warehouse.currentStock)}</td>
            <td class="px-2 lg:px-4 py-1 text-xs lg:text-sm hidden sm:table-cell">
                <div class="flex items-center gap-2">
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div class="bg-${utilizationColor}-600 h-2.5 rounded-full" style="width: ${warehouse.utilizationPercentage}%"></div>
                    </div>
                    <span class="text-xs font-medium text-gray-700 whitespace-nowrap">
                        ${warehouse.utilizationPercentage.toFixed(1)}%
                    </span>
                </div>
            </td>
            <td class="px-2 lg:px-4 py-1 text-center">
                <div class="flex flex-col sm:flex-row gap-2 justify-center">
                    <button 
                        onclick="editWarehouse(${warehouse.id})" 
                        class="bg-blue-500 hover:bg-blue-600 text-white px-3 lg:px-4 py-1 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition"
                    >
                        <i class="fas fa-edit"></i><span class="hidden sm:inline ml-1">Edit</span>
                    </button>
                    <button 
                        onclick="deleteWarehouse(${warehouse.id})" 
                        class="bg-red-500 hover:bg-red-600 text-white px-3 lg:px-4 py-1 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition"
                    >
                        <i class="fas fa-trash"></i><span class="hidden sm:inline ml-1">Delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    updatePaginationControls();
    updatePaginationInfo();
}

// Update pagination controls
function updatePaginationControls() {
    const totalPages = Math.ceil(filteredWarehouses.length / itemsPerPage);
    const pageNumbersDiv = document.getElementById('pageNumbers');
    pageNumbersDiv.innerHTML = '';
    
    // Previous button state
    document.getElementById('prevBtn').disabled = currentPage === 1;
    
    // Next button state
    document.getElementById('nextBtn').disabled = currentPage === totalPages || totalPages === 0;
    
    // Generate page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.onclick = () => goToPage(i);
        
        if (i === currentPage) {
            pageBtn.className = 'w-10 h-10 bg-gray-900 text-white rounded-lg text-sm font-medium';
        } else {
            pageBtn.className = 'w-10 h-10 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition';
        }
        
        pageNumbersDiv.appendChild(pageBtn);
    }
}

// Update pagination info
function updatePaginationInfo() {
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredWarehouses.length);
    const total = filteredWarehouses.length;
    
    document.getElementById('paginationInfo').textContent = 
        `Showing ${total > 0 ? startIndex : 0} - ${endIndex} of ${total} items`;
}

// Change page
function changePage(direction) {
    if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (direction === 'next') {
        const totalPages = Math.ceil(filteredWarehouses.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
        }
    }
    displayWarehouses();
}

// Go to specific page
function goToPage(page) {
    currentPage = page;
    displayWarehouses();
}

// Change items per page
function changePerPage() {
    itemsPerPage = parseInt(document.getElementById('perPageSelect').value);
    currentPage = 1; // Reset to first page
    displayWarehouses();
}

// Handle form submit (Create or Update)
async function handleSubmit(e) {
    e.preventDefault();
    
    const warehouse = {
        name: document.getElementById('name').value,
        location: document.getElementById('location').value,
        address: document.getElementById('address').value,
        capacity: parseInt(document.getElementById('capacity').value),
        currentStock: parseInt(document.getElementById('currentStock').value) || 0
    };
    
    try {
        let response;
        if (editMode) {
            response = await fetch(`${API_URL}/${currentWarehouseId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(warehouse)
            });
        } else {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(warehouse)
            });
        }
        
        if (response.ok) {
            showAlert(editMode ? 'Warehouse updated successfully! ✅' : 'Warehouse created successfully! ✅', 'success');
            closeWarehouseModal();
            await loadWarehouses(); // Reload with pagination
        } else {
            const error = await response.json();
            showAlert('Error: ' + (error.message || 'Failed to save warehouse'), 'error');
        }
    } catch (error) {
        showAlert('Error: ' + error.message, 'error');
    }
}

// Edit warehouse
async function editWarehouse(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const warehouse = await response.json();
        
        openEditModal(warehouse);
    } catch (error) {
        showAlert('Failed to load warehouse: ' + error.message, 'error');
    }
}

// Delete warehouse
async function deleteWarehouse(id) {
    if (!confirm('Are you sure you want to delete this warehouse?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showAlert('Warehouse deleted successfully! 🗑️', 'success');
            await loadWarehouses(); // Reload with pagination
        } else {
            showAlert('Failed to delete warehouse', 'error');
        }
    } catch (error) {
        showAlert('Error: ' + error.message, 'error');
    }
}

// Reset form
function resetForm() {
    document.getElementById('warehouseForm').reset();
    document.getElementById('warehouseId').value = '';
    editMode = false;
    currentWarehouseId = null;
    document.getElementById('submitBtn').textContent = 'Add Warehouse';
    document.getElementById('formTitle').textContent = 'Add New Warehouse';
    document.getElementById('cancelBtn').classList.add('hidden');
}

// Show alert message
function showAlert(message, type) {
    const alertDiv = document.getElementById('alert');
    alertDiv.className = type === 'success' 
        ? 'p-4 rounded-lg shadow-lg bg-green-100 border border-green-400 text-green-800 font-medium'
        : 'p-4 rounded-lg shadow-lg bg-red-100 border border-red-400 text-red-800 font-medium';
    alertDiv.textContent = message;
    alertDiv.classList.remove('hidden');
    
    setTimeout(() => {
        alertDiv.classList.add('hidden');
    }, 5000);
}

// Format number with thousand separator
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
