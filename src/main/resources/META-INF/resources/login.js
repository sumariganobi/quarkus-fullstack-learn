// Check if already logged in
if (localStorage.getItem('token')) {
    window.location.href = '/dashboard.html';
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Show loading
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    
    submitBtn.disabled = true;
    btnText.textContent = 'Signing in...';
    btnLoader.classList.remove('hidden');
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Store token
            if (remember) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    username: data.username,
                    email: data.email,
                    fullName: data.fullName,
                    roles: data.roles
                }));
            } else {
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('user', JSON.stringify({
                    username: data.username,
                    email: data.email,
                    fullName: data.fullName,
                    roles: data.roles
                }));
            }
            
            showAlert('Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1000);
        } else {
            const error = await response.json();
            showAlert(error.message || 'Invalid credentials', 'error');
            
            // Reset button
            submitBtn.disabled = false;
            btnText.textContent = 'Sign In';
            btnLoader.classList.add('hidden');
        }
    } catch (error) {
        showAlert('An error occurred. Please try again.', 'error');
        
        // Reset button
        submitBtn.disabled = false;
        btnText.textContent = 'Sign In';
        btnLoader.classList.add('hidden');
    }
});

function showAlert(message, type) {
    const alertDiv = document.getElementById('alert');
    alertDiv.className = type === 'success' 
        ? 'mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800'
        : 'mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800';
    alertDiv.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    alertDiv.classList.remove('hidden');
    
    if (type === 'success') {
        setTimeout(() => {
            alertDiv.classList.add('hidden');
        }, 3000);
    }
}
