const API_URL = '/api/products';

let editMode = false;
let currentProductId = null;

// Pagination variables
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let itemsPerPage = 10;

// Filter state
let filters = {
    search: '',
    minPrice: null,
    maxPrice: null,
    minStock: null,
    maxStock: null,
    stockStatus: {
        inStock: false,
        lowStock: false,
        outOfStock: false
    },
    sortBy: ''
};

// Check authentication and set user info
const token = localStorage.getItem('token') || sessionStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');

if (!token) {
    window.location.href = '/login.html';
}

// Set user info
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    document.getElementById('productForm').addEventListener('submit', handleSubmit);
});

// Open modal for adding new product
function openAddModal() {
    editMode = false;
    currentProductId = null;
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('modalTitle').textContent = 'Add New Product';
    document.getElementById('submitBtnText').textContent = 'Save Product';
    document.getElementById('productModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
}

// Open modal for editing product
function openEditModal(product) {
    editMode = true;
    currentProductId = product.id;
    
    document.getElementById('productId').value = product.id;
    document.getElementById('name').value = product.name;
    document.getElementById('description').value = product.description || '';
    document.getElementById('price').value = product.price;
    document.getElementById('stock').value = product.stock;
    
    document.getElementById('modalTitle').textContent = 'Edit Product';
    document.getElementById('submitBtnText').textContent = 'Update Product';
    document.getElementById('productModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close product modal
function closeProductModal() {
    document.getElementById('productModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
    document.getElementById('productForm').reset();
    editMode = false;
    currentProductId = null;
}

// Logout function (already in sidebar.js, but keep for compatibility)
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
        allProducts = await response.json();
        filteredProducts = [...allProducts];
        
        applyFilters();
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('productsTable').classList.remove('hidden');
    } catch (error) {
        showAlert('Failed to load products: ' + error.message, 'error');
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
    filters.minPrice = parseFloat(document.getElementById('minPrice')?.value) || null;
    filters.maxPrice = parseFloat(document.getElementById('maxPrice')?.value) || null;
    filters.minStock = parseInt(document.getElementById('minStock')?.value) || null;
    filters.maxStock = parseInt(document.getElementById('maxStock')?.value) || null;
    filters.stockStatus.inStock = document.getElementById('filterInStock')?.checked || false;
    filters.stockStatus.lowStock = document.getElementById('filterLowStock')?.checked || false;
    filters.stockStatus.outOfStock = document.getElementById('filterOutOfStock')?.checked || false;
    filters.sortBy = document.getElementById('sortBy')?.value || '';
    
    // Filter products
    filteredProducts = allProducts.filter(product => {
        // Search filter
        if (filters.search) {
            const searchMatch = product.name.toLowerCase().includes(filters.search) ||
                               (product.description && product.description.toLowerCase().includes(filters.search));
            if (!searchMatch) return false;
        }
        
        // Price range filter
        if (filters.minPrice !== null && product.price < filters.minPrice) return false;
        if (filters.maxPrice !== null && product.price > filters.maxPrice) return false;
        
        // Stock range filter
        if (filters.minStock !== null && product.stock < filters.minStock) return false;
        if (filters.maxStock !== null && product.stock > filters.maxStock) return false;
        
        // Stock status filter
        if (filters.stockStatus.inStock || filters.stockStatus.lowStock || filters.stockStatus.outOfStock) {
            const isInStock = product.stock > 10;
            const isLowStock = product.stock > 0 && product.stock <= 10;
            const isOutOfStock = product.stock === 0;
            
            const matchStatus = (filters.stockStatus.inStock && isInStock) ||
                               (filters.stockStatus.lowStock && isLowStock) ||
                               (filters.stockStatus.outOfStock && isOutOfStock);
            
            if (!matchStatus) return false;
        }
        
        return true;
    });
    
    // Sort products
    if (filters.sortBy) {
        filteredProducts.sort((a, b) => {
            switch (filters.sortBy) {
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'stock-asc':
                    return a.stock - b.stock;
                case 'stock-desc':
                    return b.stock - a.stock;
                default:
                    return 0;
            }
        });
    }
    
    currentPage = 1; // Reset to first page
    displayProducts();
    // toggleFilterPanel(); // Close panel after applying - COMMENTED: Keep filter panel state unchanged
}

// Clear all filters
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('minStock').value = '';
    document.getElementById('maxStock').value = '';
    document.getElementById('filterInStock').checked = false;
    document.getElementById('filterLowStock').checked = false;
    document.getElementById('filterOutOfStock').checked = false;
    document.getElementById('sortBy').value = '';
    
    filters = {
        search: '',
        minPrice: null,
        maxPrice: null,
        minStock: null,
        maxStock: null,
        stockStatus: {
            inStock: false,
            lowStock: false,
            outOfStock: false
        },
        sortBy: ''
    };
    
    filteredProducts = [...allProducts];
    currentPage = 1;
    displayProducts();
}

// Display products with pagination
function displayProducts() {
    const tbody = document.getElementById('productsBody');
    tbody.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                    No products found. ${allProducts.length > 0 ? 'Try adjusting your filters.' : 'Add your first product above!'}
                </td>
            </tr>
        `;
        updatePaginationInfo();
        return;
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    paginatedProducts.forEach(product => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition';
        row.innerHTML = `
            <td class="px-2 lg:px-4 py-1 text-xs lg:text-sm font-medium text-gray-900">${product.id}</td>
            <td class="px-2 lg:px-4 py-1 text-xs lg:text-sm text-gray-900 font-semibold">${product.name}</td>
            <td class="px-2 lg:px-4 py-1 text-xs lg:text-sm text-gray-600 hidden md:table-cell">${product.description || '-'}</td>
            <td class="px-2 lg:px-4 py-1 text-xs lg:text-sm text-gray-900 font-semibold">Rp ${formatNumber(product.price)}</td>
            <td class="px-2 lg:px-4 py-1 text-xs lg:text-sm hidden sm:table-cell">
                <span class="inline-flex items-center px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}">
                    ${product.stock} units
                </span>
            </td>
            <td class="px-2 lg:px-4 py-1 text-center">
                <div class="flex flex-col sm:flex-row gap-2 justify-center">
                    <button 
                        onclick="editProduct(${product.id})" 
                        class="bg-blue-500 hover:bg-blue-600 text-white px-3 lg:px-4 py-1 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition"
                    >
                        <i class="fas fa-edit"></i><span class="hidden sm:inline ml-1">Edit</span>
                    </button>
                    <button 
                        onclick="deleteProduct(${product.id})" 
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
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
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
    const endIndex = Math.min(currentPage * itemsPerPage, filteredProducts.length);
    const total = filteredProducts.length;
    
    document.getElementById('paginationInfo').textContent = 
        `Showing ${total > 0 ? startIndex : 0} - ${endIndex} of ${total} items`;
}

// Change page
function changePage(direction) {
    if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (direction === 'next') {
        const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
        }
    }
    displayProducts();
}

// Go to specific page
function goToPage(page) {
    currentPage = page;
    displayProducts();
}

// Change items per page
function changePerPage() {
    itemsPerPage = parseInt(document.getElementById('perPageSelect').value);
    currentPage = 1; // Reset to first page
    displayProducts();
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
            closeProductModal();
            await loadProducts(); // Reload with pagination
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
        
        openEditModal(product);
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
            await loadProducts(); // Reload with pagination
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
