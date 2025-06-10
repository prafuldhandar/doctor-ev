const API_URL = 'http://localhost:5000/api';

let allRequests = [];

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone.replace(/\s/g, ''));
}

function showAlert(message, type = 'success') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  
  const container = document.querySelector('.form-container') || document.querySelector('.container');
  container.insertBefore(alertDiv, container.firstChild);
  
  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}

async function handleBookingSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = {
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    email: form.email.value.trim(),
    evModel: form.evModel.value.trim(),
    problemType: form.problemType.value,
    location: form.location.value.trim(),
    description: form.description.value.trim()
  };
  
  document.querySelectorAll('.error').forEach(el => el.remove());
  
  let isValid = true;
  
  if (!formData.name) {
    showError(form.name, 'Name is required');
    isValid = false;
  }
  
  if (!formData.phone) {
    showError(form.phone, 'Phone number is required');
    isValid = false;
  } else if (!validatePhone(formData.phone)) {
    showError(form.phone, 'Please enter a valid 10-digit phone number');
    isValid = false;
  }
  
  if (!formData.email) {
    showError(form.email, 'Email is required');
    isValid = false;
  } else if (!validateEmail(formData.email)) {
    showError(form.email, 'Please enter a valid email address');
    isValid = false;
  }
  
  if (!formData.evModel) {
    showError(form.evModel, 'EV Model is required');
    isValid = false;
  }
  
  if (!formData.problemType) {
    showError(form.problemType, 'Please select a problem type');
    isValid = false;
  }
  
  if (!formData.location) {
    showError(form.location, 'Location is required');
    isValid = false;
  }
  
  if (!isValid) {
    return;
  }
  
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';
  
  try {
    const response = await fetch(`${API_URL}/book-service`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      showAlert('Service request submitted successfully! We will contact you soon.', 'success');
      form.reset();
    } else {
      showAlert(data.message || 'Failed to submit request. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    showAlert('Network error. Please check if the server is running.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Request';
  }
}

function showError(input, message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error';
  errorDiv.textContent = message;
  input.parentElement.appendChild(errorDiv);
}

async function loadServiceRequests() {
  const tableBody = document.getElementById('requestsTableBody');
  const loadingDiv = document.getElementById('loading');
  
  if (!tableBody) return;
  
  try {
    if (loadingDiv) loadingDiv.style.display = 'block';
    
    const response = await fetch(`${API_URL}/requests`);
    const data = await response.json();
    
    if (loadingDiv) loadingDiv.style.display = 'none';
    
    if (data.success && data.data.length > 0) {
      allRequests = data.data;
      updateStats(allRequests);
      renderTable(allRequests);
    } else {
      allRequests = [];
      updateStats([]);
      tableBody.innerHTML = '<tr><td colspan="9" style="text-align: center;">No service requests found</td></tr>';
    }
  } catch (error) {
    console.error('Error loading service requests:', error);
    if (loadingDiv) loadingDiv.style.display = 'none';
    tableBody.innerHTML = '<tr><td colspan="9" style="text-align: center; color: #ef4444;">Error loading data. Please check if server is running.</td></tr>';
  }
}

function updateStats(requests) {
  const totalEl = document.getElementById('totalRequests');
  const pendingEl = document.getElementById('pendingRequests');
  const progressEl = document.getElementById('progressRequests');
  const completedEl = document.getElementById('completedRequests');
  
  if (totalEl) totalEl.textContent = requests.length;
  if (pendingEl) pendingEl.textContent = requests.filter(r => r.status === 'Pending').length;
  if (progressEl) progressEl.textContent = requests.filter(r => r.status === 'In Progress').length;
  if (completedEl) completedEl.textContent = requests.filter(r => r.status === 'Completed').length;
}

function renderTable(requests) {
  const tableBody = document.getElementById('requestsTableBody');
  if (!tableBody) return;
  
  tableBody.innerHTML = '';
  
  requests.forEach(request => {
    const row = document.createElement('tr');
    
    const date = new Date(request.date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    let statusClass = 'status-pending';
    if (request.status === 'Assigned') statusClass = 'status-assigned';
    if (request.status === 'In Progress') statusClass = 'status-progress';
    if (request.status === 'Completed') statusClass = 'status-completed';
    
    row.innerHTML = `
      <td>${request.name}</td>
      <td>${request.phone}</td>
      <td>${request.email}</td>
      <td>${request.evModel}</td>
      <td>${request.problemType}</td>
      <td>${request.location}</td>
      <td>${request.description || '-'}</td>
      <td><span class="status-badge ${statusClass}">${request.status}</span></td>
      <td>${date}</td>
    `;
    
    tableBody.appendChild(row);
  });
}

function filterRequests() {
  const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const statusFilter = document.getElementById('statusFilter')?.value || '';
  const problemFilter = document.getElementById('problemFilter')?.value || '';
  
  let filtered = allRequests;
  
  if (searchTerm) {
    filtered = filtered.filter(r => 
      r.name.toLowerCase().includes(searchTerm) ||
      r.email.toLowerCase().includes(searchTerm) ||
      r.phone.includes(searchTerm)
    );
  }
  
  if (statusFilter) {
    filtered = filtered.filter(r => r.status === statusFilter);
  }
  
  if (problemFilter) {
    filtered = filtered.filter(r => r.problemType === problemFilter);
  }
  
  renderTable(filtered);
}

async function handleRegisterSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    password: form.password.value,
    confirmPassword: form.confirmPassword.value
  };
  
  document.querySelectorAll('.error').forEach(el => el.remove());
  
  let isValid = true;
  
  if (!formData.name) {
    showError(form.name, 'Name is required');
    isValid = false;
  }
  
  if (!formData.email) {
    showError(form.email, 'Email is required');
    isValid = false;
  } else if (!validateEmail(formData.email)) {
    showError(form.email, 'Please enter a valid email address');
    isValid = false;
  }
  
  if (!formData.phone) {
    showError(form.phone, 'Phone number is required');
    isValid = false;
  } else if (!validatePhone(formData.phone)) {
    showError(form.phone, 'Please enter a valid 10-digit phone number');
    isValid = false;
  }
  
  if (!formData.password) {
    showError(form.password, 'Password is required');
    isValid = false;
  } else if (formData.password.length < 6) {
    showError(form.password, 'Password must be at least 6 characters long');
    isValid = false;
  }
  
  if (!formData.confirmPassword) {
    showError(form.confirmPassword, 'Please confirm your password');
    isValid = false;
  } else if (formData.password !== formData.confirmPassword) {
    showError(form.confirmPassword, 'Passwords do not match');
    isValid = false;
  }
  
  if (!isValid) {
    return;
  }
  
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Registering...';
  
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.data));
      showAlert('Registration successful! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } else {
      showAlert(data.message || 'Registration failed. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Error during registration:', error);
    showAlert('Network error. Please check if the server is running.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Register';
  }
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = {
    email: form.email.value.trim(),
    password: form.password.value
  };
  
  document.querySelectorAll('.error').forEach(el => el.remove());
  
  let isValid = true;
  
  if (!formData.email) {
    showError(form.email, 'Email is required');
    isValid = false;
  } else if (!validateEmail(formData.email)) {
    showError(form.email, 'Please enter a valid email address');
    isValid = false;
  }
  
  if (!formData.password) {
    showError(form.password, 'Password is required');
    isValid = false;
  }
  
  if (!isValid) {
    return;
  }
  
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Logging in...';
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    console.log('Login response:', data);
    
    if (data.success) {
      console.log('Storing user data:', data.data);
      localStorage.setItem('user', JSON.stringify(data.data));
      showAlert('Login successful! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } else {
      showAlert(data.message || 'Login failed. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Error during login:', error);
    showAlert('Network error. Please check if the server is running.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Login';
  }
}

function updateNavigation() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navUl = document.querySelector('nav ul');
  
  console.log('Current user:', user);
  
  if (user && navUl) {
    const existingAuthLinks = navUl.querySelectorAll('.auth-link');
    existingAuthLinks.forEach(link => link.remove());
    
    if (user.role === 'admin') {
      console.log('Admin user detected - showing admin panel link');
      const adminLi = document.createElement('li');
      adminLi.className = 'auth-link';
      adminLi.innerHTML = `<a href="admin.html">Admin Panel</a>`;
      navUl.appendChild(adminLi);
    }
    
    const userLi = document.createElement('li');
    userLi.className = 'auth-link';
    userLi.innerHTML = `<span style="color: var(--text-primary); font-weight: 600;">${user.name}</span>`;
    navUl.appendChild(userLi);
    
    const logoutLi = document.createElement('li');
    logoutLi.className = 'auth-link';
    logoutLi.innerHTML = `<a href="#" id="logoutBtn">Logout</a>`;
    navUl.appendChild(logoutLi);
    
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('user');
      window.location.href = 'index.html';
    });
  } else if (navUl) {
    const existingAuthLinks = navUl.querySelectorAll('.auth-link');
    existingAuthLinks.forEach(link => link.remove());
    
    const loginLi = document.createElement('li');
    loginLi.className = 'auth-link';
    loginLi.innerHTML = `<a href="login.html">Login</a>`;
    navUl.appendChild(loginLi);
    
    const registerLi = document.createElement('li');
    registerLi.className = 'auth-link';
    registerLi.innerHTML = `<a href="register.html">Register</a>`;
    navUl.appendChild(registerLi);
  }
}

function checkAdminAccess() {
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdminPage = window.location.pathname.includes('admin.html');
  
  if (isAdminPage && (!user || user.role !== 'admin')) {
    alert('Access denied. Admin privileges required.');
    window.location.href = 'index.html';
  }
}

function handleAdminClick() {
  const user = JSON.parse(localStorage.getItem('user'));
  
  console.log('Admin link clicked. User data:', user);
  
  if (!user) {
    alert('Please login with an admin account to access the admin panel.\n\nAdmin email: admin@evcareassist.com');
    window.location.href = 'login.html';
  } else if (user.role !== 'admin') {
    console.log('User role:', user.role, 'Expected: admin');
    alert('Access denied. You need admin privileges to access this page.\n\nPlease login with admin account: admin@evcareassist.com');
  } else {
    console.log('Admin access granted');
    window.location.href = 'admin.html';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateNavigation();
  checkAdminAccess();
  
  const adminLink = document.getElementById('adminLink');
  if (adminLink) {
    adminLink.addEventListener('click', (e) => {
      e.preventDefault();
      handleAdminClick();
    });
  }
  
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleBookingSubmit);
  }
  
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegisterSubmit);
  }
  
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLoginSubmit);
  }
  
  if (document.getElementById('requestsTableBody')) {
    loadServiceRequests();
    
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', loadServiceRequests);
    }
    
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const problemFilter = document.getElementById('problemFilter');
    
    if (searchInput) searchInput.addEventListener('input', filterRequests);
    if (statusFilter) statusFilter.addEventListener('change', filterRequests);
    if (problemFilter) problemFilter.addEventListener('change', filterRequests);
  }
});
