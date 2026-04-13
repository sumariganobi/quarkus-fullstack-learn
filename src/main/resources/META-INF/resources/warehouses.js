const API_URL = '/api/warehouses';

let editMode = false;
let currentWarehouseId = null;

// Load warehouses on page load
document.addEventListener('DOMContentLoaded', () => {
    loadWarehouses();
    
    document.getElementById('warehouseForm').addEventListener('submit', handleSubmit);
    document.getElementById('cancelBtn').addEventListener('click', resetForm);
});

// Load all warehouses
async function loadWarehouses() {
    try {
        const response = await fetch(API_URL);
        const warehouses = await response.json();
        
        displayWarehouses(warehouses);
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('warehousesTable').classList.remove('hidden');
    } catch (error) {
        showAlert('Failed to load warehouses: ' + error.message, 'error');
        document.getElementById('loading').classList.add('hidden');
    }
}

// Display warehouses in table
function displayWarehouses(warehouses) {
    const tbody = document.getElementById('warehousesBody');
    tbody.innerHTML = '';
    
    if (warehouses.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                    No warehouses found. Add your first warehouse above!
                </td>
            </tr>
        `;
        return;
    }
    
    warehouses.forEach(warehouse => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition';
        
        const utilizationColor = warehouse.utilizationPercentage > 80 ? 'red' : 
                                 warehouse.utilizationPercentage > 50 ? 'yellow' : 'green';
        
        row.innerHTML = `
            <td class="px-6 py-4 text-sm font-medium text-gray-900">${warehouse.id}</td>
            <td class="px-6 py-4 text-sm text-gray-900 font-semibold">${warehouse.name}</td>
            <td class="px-6 py-4 text-sm text-gray-600">${warehouse.location}</td>
            <td class="px-6 py-4 text-sm text-gray-900">${formatNumber(warehouse.capacity)}</td>
            <td class="px-6 py-4 text-sm text-gray-900">${formatNumber(warehouse.currentStock)}</td>
            <td class="px-6 py-4 text-sm">
                <div class="flex items-center gap-2">
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div class="bg-${utilizationColor}-600 h-2.5 rounded-full" style="width: ${warehouse.utilizationPercentage}%"></div>
                    </div>
                    <span class="text-xs font-medium text-gray-700 whitespace-nowrap">
                        ${warehouse.utilizationPercentage.toFixed(1)}%
                    </span>
                </div>
            </td>
            <td class="px-6 py-4 text-center">
                <button 
                    onclick="editWarehouse(${warehouse.id})" 
                    class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition mr-2"
                >
                    Edit
                </button>
                <button 
                    onclick="deleteWarehouse(${warehouse.id})" 
                    class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                    Delete
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
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
            resetForm();
            loadWarehouses();
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
        
        document.getElementById('warehouseId').value = warehouse.id;
        document.getElementById('name').value = warehouse.name;
        document.getElementById('location').value = warehouse.location;
        document.getElementById('address').value = warehouse.address || '';
        document.getElementById('capacity').value = warehouse.capacity;
        document.getElementById('currentStock').value = warehouse.currentStock;
        
        editMode = true;
        currentWarehouseId = id;
        document.getElementById('submitBtn').textContent = 'Update Warehouse';
        document.getElementById('formTitle').textContent = 'Edit Warehouse';
        document.getElementById('cancelBtn').classList.remove('hidden');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
            loadWarehouses();
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
