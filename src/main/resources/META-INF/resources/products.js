const API_URL = '/api/products';

let editMode = false;
let currentProductId = null;

// Check authentication and set user info
const token = localStorage.getItem('token') || sessionStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');

if (!token) {
    window.location.href = '/login.html';
}

// Set user info
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('userName').textContent = user.fullName || user.username;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('userInitial').textContent = (user.fullName || user.username).charAt(0).toUpperCase();
    
    loadProducts();
    
    document.getElementById('productForm').addEventListener('submit', handleSubmit);
    document.getElementById('cancelBtn').addEventListener('click', resetForm);
});

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = '/login.html';
}

// Load all products
async function loadProducts() {
    try {
        const response = await fetch(API_URL);
        const products = await response.json();
        
        displayProducts(products);
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('productsTable').classList.remove('hidden');
    } catch (error) {
        showAlert('Failed to load products: ' + error.message, 'error');
        document.getElementById('loading').classList.add('hidden');
    }
}

// Display products in table
function displayProducts(products) {
    const tbody = document.getElementById('productsBody');
    tbody.innerHTML = '';
    
    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                    No products found. Add your first product above!
                </td>
            </tr>
        `;
        return;
    }
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition';
        row.innerHTML = `
            <td class="px-6 py-4 text-sm font-medium text-gray-900">${product.id}</td>
            <td class="px-6 py-4 text-sm text-gray-900 font-semibold">${product.name}</td>
            <td class="px-6 py-4 text-sm text-gray-600">${product.description || '-'}</td>
            <td class="px-6 py-4 text-sm text-gray-900 font-semibold">Rp ${formatNumber(product.price)}</td>
            <td class="px-6 py-4 text-sm">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}">
                    ${product.stock} units
                </span>
            </td>
            <td class="px-6 py-4 text-center">
                <button 
                    onclick="editProduct(${product.id})" 
                    class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition mr-2"
                >
                    Edit
                </button>
                <button 
                    onclick="deleteProduct(${product.id})" 
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
    
    const product = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value)
    };
    
    try {
        let response;
        if (editMode) {
            response = await fetch(`${API_URL}/${currentProductId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
        } else {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
        }
        
        if (response.ok) {
            showAlert(editMode ? 'Product updated successfully! ✅' : 'Product created successfully! ✅', 'success');
            resetForm();
            loadProducts();
        } else {
            const error = await response.json();
            showAlert('Error: ' + (error.message || 'Failed to save product'), 'error');
        }
    } catch (error) {
        showAlert('Error: ' + error.message, 'error');
    }
}

// Edit product
async function editProduct(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const product = await response.json();
        
        document.getElementById('productId').value = product.id;
        document.getElementById('name').value = product.name;
        document.getElementById('description').value = product.description || '';
        document.getElementById('price').value = product.price;
        document.getElementById('stock').value = product.stock;
        
        editMode = true;
        currentProductId = id;
        document.getElementById('submitBtn').textContent = 'Update Product';
        document.getElementById('formTitle').textContent = 'Edit Product';
        document.getElementById('cancelBtn').classList.remove('hidden');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        showAlert('Failed to load product: ' + error.message, 'error');
    }
}

// Delete product
async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showAlert('Product deleted successfully! 🗑️', 'success');
            loadProducts();
        } else {
            showAlert('Failed to delete product', 'error');
        }
    } catch (error) {
        showAlert('Error: ' + error.message, 'error');
    }
}

// Reset form
function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    editMode = false;
    currentProductId = null;
    document.getElementById('submitBtn').textContent = 'Add Product';
    document.getElementById('formTitle').textContent = 'Add New Product';
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
