// Load sidebar HTML
async function loadSidebar() {
    try {
        const response = await fetch('/sidebar.html');
        const html = await response.text();
        document.getElementById('sidebarContainer').innerHTML = html;
        
        // Set active menu based on current page
        setActiveMenu();
        
        // Initialize user info
        initializeUserInfo();
    } catch (error) {
        console.error('Failed to load sidebar:', error);
    }
}

// Set active menu based on current page
function setActiveMenu() {
    const currentPath = window.location.pathname;
    const activeClass = 'text-white bg-gradient-to-r from-primary to-secondary';
    const inactiveClass = 'text-gray-700 hover:bg-gray-100';
    
    // Remove active class from all nav items
    document.querySelectorAll('nav a[id^="nav-"]').forEach(link => {
        link.className = `flex items-center gap-3 px-4 py-3 ${inactiveClass} rounded-lg transition`;
    });
    
    // Add active class to current page
    if (currentPath.includes('dashboard')) {
        const dashboardLink = document.getElementById('nav-dashboard');
        if (dashboardLink) {
            dashboardLink.className = `flex items-center gap-3 px-4 py-3 ${activeClass} rounded-lg`;
        }
    } else if (currentPath.includes('products')) {
        const productsLink = document.getElementById('nav-products');
        if (productsLink) {
            productsLink.className = `flex items-center gap-3 px-4 py-3 ${activeClass} rounded-lg`;
        }
    } else if (currentPath.includes('warehouses')) {
        const warehousesLink = document.getElementById('nav-warehouses');
        if (warehousesLink) {
            warehousesLink.className = `flex items-center gap-3 px-4 py-3 ${activeClass} rounded-lg`;
        }
    }
}

// Initialize user info in sidebar
function initializeUserInfo() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    
    if (user.username) {
        const userNameEl = document.getElementById('userName');
        const userEmailEl = document.getElementById('userEmail');
        const userInitialEl = document.getElementById('userInitial');
        
        if (userNameEl) userNameEl.textContent = user.fullName || user.username;
        if (userEmailEl) userEmailEl.textContent = user.email;
        if (userInitialEl) userInitialEl.textContent = (user.fullName || user.username).charAt(0).toUpperCase();
    }
}

// Sidebar toggle function
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
}

// Close sidebar when window is resized to desktop
window.addEventListener('resize', function() {
    if (window.innerWidth >= 1024) {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar) sidebar.classList.remove('-translate-x-full');
        if (overlay) overlay.classList.add('hidden');
    }
});

// Close sidebar when clicking a link on mobile
document.addEventListener('DOMContentLoaded', function() {
    // Load sidebar first
    loadSidebar();
    
    // Add event listener for sidebar links (delegated)
    document.addEventListener('click', function(e) {
        const link = e.target.closest('#sidebar a[href]');
        if (link && window.innerWidth < 1024) {
            toggleSidebar();
        }
    });
});

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = '/login.html';
}
