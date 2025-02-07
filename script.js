// Global state
let cart = [];
let featuredProducts = [];

// Product Class
class Product {
    constructor(id, name, category, price, image, description) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.image = image;
        this.description = description;
    }

    renderCard() {
        return `
            <div class="product-card" data-id="${this.id}" data-category="${this.category}">
                <img src="${this.image}" alt="${this.name}">
                <h3>${this.name}</h3>
                <p>$${this.price.toFixed(2)}</p>
                <div class="product-actions">
                    <button onclick="addToCart(${this.id})">Add to Cart</button>
                    <button onclick="buyNow(${this.id})">Buy Now</button>
                </div>
            </div>
        `;
    }
}

// Cart Management
function addToCart(productId) {
    const product = featuredProducts.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartCount();
        alert('${product.name} added to cart!');
    }
}

function buyNow(productId) {
    addToCart(productId);
    window.location.href = 'cart.html';
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
}

// Search Functionality
function initSearch() {
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        searchBar.addEventListener('keyup', function(event) {
            const searchTerm = event.target.value.toLowerCase();
            const products = document.querySelectorAll('.product-card');
            
            products.forEach(product => {
                const productName = product.querySelector('h3').textContent.toLowerCase();
                product.style.display = productName.includes(searchTerm) ? 'block' : 'none';
            });
        });
    }
}

// Category Filtering
function setupProductCategories() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');

    // Function to filter products
    function filterProducts(category) {
        productCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get selected category and filter products
            const category = this.dataset.category;
            filterProducts(category);
        });
    });

    // Set "All Products" as default when page loads
    const allProductsButton = document.querySelector('.category-btn[data-category="all"]');
    if (allProductsButton) {
        allProductsButton.classList.add('active');
        filterProducts('all');
    }
}

// Featured Products
function loadFeaturedProducts() {
    // No need to dynamically generate product cards
    // The product cards will be added directly in HTML
    
    // If you need to add functionality to buttons, you can do it here
    const addToCartButtons = document.querySelectorAll('.product-actions .add-to-cart-btn');
    const buyNowButtons = document.querySelectorAll('.product-actions .buy-now-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('p').textContent;
            
            // Example: Add to cart logic
            console.log('Added to cart: ${productName} - ${productPrice}');
            // You can expand this with your cart functionality
        });
    });
    
    buyNowButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('p').textContent;
            
            // Example: Buy now logic
            console.log('Buying: ${productName} - ${productPrice}');
            // You can expand this with your checkout functionality
        });
    });

    // Setup product category filtering
    setupProductCategories();
}

// Page Initialization
document.addEventListener('DOMContentLoaded', function() {
    // User Authentication and Profile Management
    const UserProfile = {
        init: function() {
            this.initializeUserData();
            this.bindEvents();
            this.loadDashboardData();
        },

        initializeUserData: function() {
            // Check if user data exists in localStorage, if not, create default
            if (!localStorage.getItem('currentUser')) {
                const defaultUser = {
                    firstName: 'Emma',
                    lastName: 'Johnson',
                    email: 'emma.johnson@email.com',
                    phone: '+1 (555) 123-4567',
                    profileImage: 'default-profile.jpg'
                };
                localStorage.setItem('currentUser', JSON.stringify(defaultUser));
            }

            // Load user data
            const userData = JSON.parse(localStorage.getItem('currentUser'));
            this.updateProfileHeader(userData);
        },

        updateProfileHeader: function(userData) {
            // Update profile image and name in sidebar
            const profileImage = document.querySelector('.profile-image');
            const profileName = document.querySelector('.profile-header h2');
            const profileEmail = document.querySelector('.profile-header p');

            if (profileImage) profileImage.src = userData.profileImage || 'default-profile.jpg';
            if (profileName) profileName.textContent = '${userData.firstName} ${userData.lastName}';
            if (profileEmail) profileEmail.textContent = userData.email;
        },

        bindEvents: function() {
            // Sidebar menu navigation
            const sidebarLinks = document.querySelectorAll('.sidebar-menu a:not(.logout)');
            sidebarLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Remove active class from all links
                    sidebarLinks.forEach(l => l.classList.remove('active'));
                    // Add active class to clicked link
                    link.classList.add('active');
                    
                    // TODO: Implement section switching logic if needed
                });
            });

            // Logout functionality
            const logoutLink = document.querySelector('.sidebar-menu .logout');
            if (logoutLink) {
                logoutLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            }

            // Order details modal
            this.setupOrderDetailsModal();
        },

        loadDashboardData: function() {
            // Simulate loading order data
            const orders = this.getOrders();
            this.updateOrderStatistics(orders);
            this.renderRecentOrders(orders);
        },

        getOrders: function() {
            // Check if orders exist in localStorage, if not, create default
            if (!localStorage.getItem('userOrders')) {
                const defaultOrders = [
                    {
                        id: '#12345',
                        date: '2025-01-05',
                        status: 'Shipped',
                        total: 129.99,
                        items: [
                            { name: 'Wireless Headphones', quantity: 1, price: 79.99 },
                            { name: 'Smartphone Case', quantity: 2, price: 24.99 }
                        ]
                    },
                    {
                        id: '#12344',
                        date: '2024-12-15',
                        status: 'Delivered',
                        total: 89.50,
                        items: [
                            { name: 'Smart Watch', quantity: 1, price: 89.50 }
                        ]
                    }
                ];
                localStorage.setItem('userOrders', JSON.stringify(defaultOrders));
            }
            return JSON.parse(localStorage.getItem('userOrders'));
        },

        updateOrderStatistics: function(orders) {
            // Update dashboard cards
            const totalOrdersEl = document.querySelector('.dashboard-grid .dashboard-card:nth-child(1) p');
            const totalSpentEl = document.querySelector('.dashboard-grid .dashboard-card:nth-child(2) p');
            const pendingOrdersEl = document.querySelector('.dashboard-grid .dashboard-card:nth-child(3) p');

            if (totalOrdersEl) totalOrdersEl.textContent = orders.length;
            
            if (totalSpentEl) {
                const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
                totalSpentEl.textContent = '$${totalSpent.toFixed(2)}';
            }

            // Assuming pending orders are those not delivered or shipped
            if (pendingOrdersEl) {
                const pendingOrders = orders.filter(order => 
                    order.status !== 'Delivered' && order.status !== 'Shipped'
                ).length;
                pendingOrdersEl.textContent = pendingOrders;
            }
        },

        renderRecentOrders: function(orders) {
            const tableBody = document.querySelector('.recent-orders tbody');
            if (tableBody) {
                tableBody.innerHTML = orders.map(order => `
                    <tr>
                        <td>${order.id}</td>
                        <td>${new Date(order.date).toLocaleDateString()}</td>
                        <td><span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></td>
                        <td>$${order.total.toFixed(2)}</td>
                        <td>
                            <a href="#" class="btn-view-details" 
                               data-order-id="${order.id}">
                                View Details
                            </a>
                        </td>
                    </tr>
                `).join('');

                // Add event listeners to view details buttons
                const viewDetailsButtons = tableBody.querySelectorAll('.btn-view-details');
                viewDetailsButtons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        const orderId = e.target.getAttribute('data-order-id');
                        this.showOrderDetails(orderId);
                    });
                });
            }
        },

        showOrderDetails: function(orderId) {
            const orders = this.getOrders();
            const order = orders.find(o => o.id === orderId);

            if (order) {
                const modal = document.createElement('div');
                modal.classList.add('order-details-modal');
                modal.innerHTML = `
                    <div class="modal-content">
                        <span class="close-modal">&times;</span>
                        <h2>Order Details: ${order.id}</h2>
                        <div class="order-info">
                            <p><strong>Order Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> ${order.status}</p>
                            <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
                        </div>
                        <table class="order-items">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${order.items.map(item => `
                                    <tr>
                                        <td>${item.name}</td>
                                        <td>${item.quantity}</td>
                                        <td>$${item.price.toFixed(2)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;

                document.body.appendChild(modal);

                // Close modal functionality
                const closeModal = modal.querySelector('.close-modal');
                closeModal.addEventListener('click', () => {
                    modal.remove();
                });

                // Close modal when clicking outside
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.remove();
                    }
                });
            }
        },

        logout: function() {
            // Clear user session
            localStorage.removeItem('currentUser');
            // Redirect to login page
            window.location.href = 'login.html';
        }
    };

    // Real-time Clock
    function updateRealTimeClock() {
        const clockElement = document.getElementById('real-time-clock');
        if (clockElement) {
            function formatTime(date) {
                return date.toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                });
            }

            function updateClock() {
                const now = new Date();
                clockElement.textContent = formatTime(now);
            }

            // Initial update
            updateClock();
            
            // Update every second
            setInterval(updateClock, 1000);
        }
    }

    // Enhanced Profile Settings Functionality
    const profileForm = document.querySelector('.profile-details-form');
    const cancelButton = document.querySelector('.btn-cancel-edit');
    const fileInput = document.querySelector('.file-input');
    const profileImage = document.querySelector('.profile-image');

    // Custom Validation Functions
    function validateName(name) {
        return /^[A-Za-z\s]{2,50}$/.test(name);
    }

    function validateEmail(email) {
        return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email);
    }

    function validatePhoneNumber(phone) {
        return /^[0-9]{10}$/.test(phone);
    }

    function validateAge(birthday) {
        const today = new Date();
        const birthDate = new Date(birthday);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age >= 18;
    }

    // Form Validation
    function validateForm() {
        let isValid = true;
        const errors = [];

        // Personal Information Validation
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const salutation = document.getElementById('salutation').value;
        const birthday = document.getElementById('birthday').value;
        const gender = document.getElementById('gender').value;
        const maritalStatus = document.getElementById('marital-status').value;

        if (!validateName(firstName)) {
            errors.push("First Name must be 2-50 letters");
            isValid = false;
        }

        if (!validateName(lastName)) {
            errors.push("Last Name must be 2-50 letters");
            isValid = false;
        }

        if (!salutation) {
            errors.push("Please select a salutation");
            isValid = false;
        }

        if (!birthday) {
            errors.push("Date of Birth is required");
            isValid = false;
        } else if (!validateAge(birthday)) {
            errors.push("You must be at least 18 years old");
            isValid = false;
        }

        if (!gender) {
            errors.push("Please select a gender");
            isValid = false;
        }

        if (!maritalStatus) {
            errors.push("Please select a marital status");
            isValid = false;
        }

        // Contact Information Validation
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const alternatePhone = document.getElementById('alternate-phone').value.trim();

        if (!validateEmail(email)) {
            errors.push("Please enter a valid email address");
            isValid = false;
        }

        if (!validatePhoneNumber(phone)) {
            errors.push("Please enter a valid 10-digit phone number");
            isValid = false;
        }

        if (alternatePhone && !validatePhoneNumber(alternatePhone)) {
            errors.push("Alternate phone number must be 10 digits");
            isValid = false;
        }

        // Address Validation
        const streetAddress = document.getElementById('street-address').value.trim();
        const city = document.getElementById('city').value.trim();
        const state = document.getElementById('state').value.trim();
        const postalCode = document.getElementById('postal-code').value.trim();
        const country = document.getElementById('country').value;

        if (streetAddress.length < 5 || streetAddress.length > 100) {
            errors.push("Street Address must be 5-100 characters");
            isValid = false;
        }

        if (!validateName(city)) {
            errors.push("City must be 2-50 letters");
            isValid = false;
        }

        if (!validateName(state)) {
            errors.push("State/Province must be 2-50 letters");
            isValid = false;
        }

        if (!/^[0-9]{5,6}$/.test(postalCode)) {
            errors.push("Postal Code must be 5-6 digits");
            isValid = false;
        }

        if (!country) {
            errors.push("Please select a country");
            isValid = false;
        }

        // Display Errors
        if (errors.length > 0) {
            alert("Please correct the following errors:\n" + errors.join("\n"));
        }

        return isValid;
    }

    // Save Profile Data
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate the form before saving
        if (!validateForm()) {
            return;
        }

        // Collect Communication Preferences
        const communicationPrefs = Array.from(
            document.querySelectorAll('input[name="communication-pref"]:checked')
        ).map(checkbox => checkbox.value);

        const marketingPrefs = Array.from(
            document.querySelectorAll('input[name="marketing-pef"]:checked')
        ).map(checkbox => checkbox.value);

        // Comprehensive User Data Object
        const userData = {
            // Personal Information
            salutation: document.getElementById('salutation').value,
            firstName: document.getElementById('first-name').value.trim(),
            lastName: document.getElementById('last-name').value.trim(),
            birthday: document.getElementById('birthday').value,
            gender: document.getElementById('gender').value,
            maritalStatus: document.getElementById('marital-status').value,

            // Contact Information
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            alternatePhone: document.getElementById('alternate-phone').value.trim(),

            // Address Details
            streetAddress: document.getElementById('street-address').value.trim(),
            city: document.getElementById('city').value.trim(),
            state: document.getElementById('state').value.trim(),
            postalCode: document.getElementById('postal-code').value.trim(),
            country: document.getElementById('country').value,

            // Professional Details
            occupation: document.getElementById('occupation').value.trim(),
            company: document.getElementById('company').value.trim(),
            workEmail: document.getElementById('work-email').value.trim(),

            // Communication Preferences
            communicationPrefs: communicationPrefs,
            marketingPrefs: marketingPrefs,

            // Profile Image
            profileImage: profileImage.src
        };

        // Save to Local Storage
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Show Success Message
        alert('Profile updated successfully!');
    });

    // Cancel Button Functionality
    cancelButton.addEventListener('click', () => {
        // Reload existing data, discarding any unsaved changes
        loadProfileData();
    });

    // Load Existing Profile Data
    function loadProfileData() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        // Personal Information
        document.getElementById('salutation').value = userData.salutation || '';
        document.getElementById('first-name').value = userData.firstName || '';
        document.getElementById('last-name').value = userData.lastName || '';
        document.getElementById('birthday').value = userData.birthday || '';
        document.getElementById('gender').value = userData.gender || '';
        document.getElementById('marital-status').value = userData.maritalStatus || '';

        // Contact Information
        document.getElementById('email').value = userData.email || '';
        document.getElementById('phone').value = userData.phone || '';
        document.getElementById('alternate-phone').value = userData.alternatePhone || '';

        // Address Details
        document.getElementById('street-address').value = userData.streetAddress || '';
        document.getElementById('city').value = userData.city || '';
        document.getElementById('state').value = userData.state || '';
        document.getElementById('postal-code').value = userData.postalCode || '';
        document.getElementById('country').value = userData.country || '';

        // Professional Details
        document.getElementById('occupation').value = userData.occupation || '';
        document.getElementById('company').value = userData.company || '';
        document.getElementById('work-email').value = userData.workEmail || '';

        // Communication Preferences
        const communicationPrefs = userData.communicationPrefs || [];
        document.querySelectorAll('input[name="communication-pref"]').forEach(checkbox => {
            checkbox.checked = communicationPrefs.includes(checkbox.value);
        });

        const marketingPrefs = userData.marketingPrefs || [];
        document.querySelectorAll('input[name="marketing-pref"]').forEach(checkbox => {
            checkbox.checked = marketingPrefs.includes(checkbox.value);
        });

        // Profile Image
        if (userData.profileImage) {
            profileImage.src = userData.profileImage;
        }
    }

    // Profile Image Upload
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                profileImage.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Initial load of profile data
    loadProfileData();

    // Initialize everything
    UserProfile.init();
    updateRealTimeClock();
});

// Account Management
function signup(email, password) {
    // Placeholder for signup logic
    localStorage.setItem('userEmail', email);
    alert('Account created successfully!');
}

function login(email, password) {
    // Placeholder for login logic
    const storedEmail = localStorage.getItem('userEmail');
    if (email === storedEmail) {
        alert('Login successful!');
        return true;
    }
    alert('Invalid credentials');
    return false;
}

// Export functions for use in other pages
window.addToCart = addToCart;
window.buyNow = buyNow;
window.signup = signup;
window.login = login;
            