// Check authentication
const token = localStorage.getItem('token') || sessionStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');

if (!token) {
    window.location.href = '/login.html';
}

// Set user info (will be called after sidebar loads)
function setUserInfo() {
    const welcomeNameEl = document.getElementById('welcomeName');
    if (welcomeNameEl) {
        welcomeNameEl.textContent = user.fullName || user.username;
    }
}

// Wait for sidebar to load before setting user info
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for sidebar to load
    setTimeout(setUserInfo, 100);
});

// Logout function (already in sidebar.js, but keep for compatibility)
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
            <td class="py-2 px-2 lg:px-2">
                <div class="flex items-center gap-2 lg:gap-3">
                    <div class="w-8 h-8 lg:w-10 lg:h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <i class="fas fa-box text-gray-600 text-sm lg:text-base"></i>
                    </div>
                    <div>
                        <p class="font-medium text-gray-900 text-sm lg:text-base">${product.name}</p>
                        <p class="text-xs text-gray-500 hidden lg:block">${product.description || '-'}</p>
                    </div>
                </div>
            </td>
            <td class="py-2 px-2 lg:px-2 font-medium text-gray-900 text-sm lg:text-base">Rp ${formatNumber(product.price)}</td>
            <td class="py-2 px-2 lg:px-2 text-gray-700 text-sm lg:text-base hidden sm:table-cell">${product.stock}</td>
            <td class="py-2 px-2 lg:px-2 hidden md:table-cell">
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
