// Check authentication
const token = localStorage.getItem('token') || sessionStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');

if (!token) {
    window.location.href = '/login.html';
}

// Set user info
document.getElementById('userName').textContent = user.fullName || user.username;
document.getElementById('userEmail').textContent = user.email;
document.getElementById('welcomeName').textContent = user.fullName || user.username;
document.getElementById('userInitial').textContent = (user.fullName || user.username).charAt(0).toUpperCase();

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = '/login.html';
}

// Load dashboard data
async function loadDashboardData() {
    try {
        // Load products
        const productsResponse = await fetch('/api/products');
        const products = await productsResponse.json();
        document.getElementById('totalProducts').textContent = products.length;
        
        const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
        document.getElementById('totalStock').textContent = totalStock.toLocaleString();

        // Load warehouses
        const warehousesResponse = await fetch('/api/warehouses');
        const warehouses = await warehousesResponse.json();
        document.getElementById('totalWarehouses').textContent = warehouses.length;
        
        const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0);
        document.getElementById('totalCapacity').textContent = totalCapacity.toLocaleString();

        // Display recent products
        displayRecentProducts(products.slice(0, 5));
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
    }
}

function displayRecentProducts(products) {
    const tbody = document.getElementById('recentProducts');
    tbody.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-100 hover:bg-gray-50 transition';
        
        const stockStatus = product.stock > 50 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock';
        const statusColor = product.stock > 50 ? 'green' : product.stock > 0 ? 'yellow' : 'red';
        
        row.innerHTML = `
            <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <i class="fas fa-box text-gray-600"></i>
                    </div>
                    <div>
                        <p class="font-medium text-gray-900">${product.name}</p>
                        <p class="text-sm text-gray-500">${product.description || '-'}</p>
                    </div>
                </div>
            </td>
            <td class="py-3 px-4 font-medium text-gray-900">Rp ${formatNumber(product.price)}</td>
            <td class="py-3 px-4 text-gray-700">${product.stock}</td>
            <td class="py-3 px-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800">
                    ${stockStatus}
                </span>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Load data on page load
document.addEventListener('DOMContentLoaded', loadDashboardData);
