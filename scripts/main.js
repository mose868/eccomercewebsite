// Main JavaScript File

// DOM Content Loaded - Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS animations
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
    
    // Preloader
    initPreloader();
    
    // Navigation functionality
    initNavigation();
    
    // Scroll to top button
    initScrollToTop();
    
    // Product filters
    initProductFilters();
    
    // Product hover effects
    initProductHoverEffects();
    
    // Live chat
    initLiveChat();
    
    // Add to cart functionality
    initCart();
    
    // Form submissions
    initForms();
});

// Preloader
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600);
        });
    }
}

// Navigation functionality
function initNavigation() {
    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger-menu');
    const navList = document.getElementById('nav-list');
    
    if (hamburger && navList) {
        hamburger.addEventListener('click', () => {
            navList.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close navigation when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container') && navList.classList.contains('active')) {
                navList.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }
    
    // Dropdown menu toggle for mobile
    const dropdownItems = document.querySelectorAll('.dropdown');
    
    if (dropdownItems.length > 0 && window.innerWidth <= 992) {
        dropdownItems.forEach(dropdown => {
            const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
            
            if (dropdownToggle) {
                dropdownToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                });
            }
        });
    }
    
    // Shrink navigation on scroll
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Resize handler
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992 && dropdownItems.length > 0) {
            dropdownItems.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    // Active link highlight
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentLocation || 
            (currentLocation === '/' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Scroll to top button
function initScrollToTop() {
    const scrollTopBtn = document.querySelector('.back-to-top');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Product filters
function initProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-buttons .btn');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                const category = btn.dataset.category;
                const products = document.querySelectorAll('.product-card');
                
                products.forEach(product => {
                    if (category === 'all' || product.dataset.category === category) {
                        product.style.display = '';
                        
                        // Add fade-in animation
                        product.style.opacity = '0';
                        setTimeout(() => {
                            product.style.opacity = '1';
                            product.style.transition = 'opacity 0.3s ease';
                        }, 10);
                    } else {
                        product.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Sort functionality
    const sortSelect = document.querySelector('.form-select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            const sortBy = e.target.value;
            const productGrid = document.querySelector('.product-grid');
            const products = Array.from(productGrid.querySelectorAll('.product-card'));
            
            products.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('.price').textContent.replace('$', ''));
                const priceB = parseFloat(b.querySelector('.price').textContent.replace('$', ''));
                
                if (sortBy === 'price-low') {
                    return priceA - priceB;
                } else if (sortBy === 'price-high') {
                    return priceB - priceA;
                }
                
                return 0;
            });
            
            // Reappend sorted products
            products.forEach(product => {
                productGrid.appendChild(product);
                
                // Add fade-in animation
                product.style.opacity = '0';
                setTimeout(() => {
                    product.style.opacity = '1';
                    product.style.transition = 'opacity 0.3s ease';
                }, 10);
            });
        });
    }
}

// Product hover effects
function initProductHoverEffects() {
    const productImages = document.querySelectorAll('.product-image');
    
    if (productImages.length > 0) {
        productImages.forEach(container => {
            const img = container.querySelector('img');
            
            if (img) {
                container.addEventListener('mousemove', (e) => {
                    const { left, top, width, height } = container.getBoundingClientRect();
                    const x = (e.clientX - left) / width;
                    const y = (e.clientY - top) / height;
                    
                    img.style.transformOrigin = `${x * 100}% ${y * 100}%`;
                });
                
                container.addEventListener('mouseleave', () => {
                    img.style.transformOrigin = 'center';
                });
            }
        });
    }
    
    // Wishlist functionality
    const wishlistButtons = document.querySelectorAll('.action-btn.wishlist');
    
    if (wishlistButtons.length > 0) {
        wishlistButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const icon = btn.querySelector('i');
                
                icon.classList.toggle('far');
                icon.classList.toggle('fas');
                
                showSuccessMessage(
                    icon.classList.contains('fas') 
                        ? '<i class="fas fa-heart"></i> Added to wishlist!' 
                        : '<i class="far fa-heart"></i> Removed from wishlist!'
                );
            });
        });
    }
    
    // Quick preview
    const previewButtons = document.querySelectorAll('.action-btn.preview');
    
    if (previewButtons.length > 0) {
        previewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const productCard = btn.closest('.product-card');
                const productName = productCard.querySelector('h3').textContent;
                const productImage = productCard.querySelector('img').src;
                const productPrice = productCard.querySelector('.price').textContent;
                const productDescription = productCard.querySelector('.product-description').textContent;
                
                createQuickViewModal(productName, productImage, productPrice, productDescription);
            });
        });
    }
}

// Create quick view modal
function createQuickViewModal(name, image, price, description) {
    // Remove any existing modals
    const existingModal = document.querySelector('.quick-view-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <div class="modal-body">
                <div class="modal-image">
                    <img src="${image}" alt="${name}">
                </div>
                <div class="modal-info">
                    <h3>${name}</h3>
                    <p class="price">${price}</p>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                        <span>(12 reviews)</span>
                    </div>
                    <p class="description">${description}</p>
                    <div class="modal-actions">
                        <button class="btn btn-primary add-to-cart">Add to Cart</button>
                        <button class="btn btn-outline wishlist">
                            <i class="far fa-heart"></i> Wishlist
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(modal);
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Close button functionality
    const closeButton = modal.querySelector('.close-modal');
    closeButton.addEventListener('click', closeModal);
    
    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// Live chat
function initLiveChat() {
    const chatIcon = document.getElementById('live-chat-icon');
    const chatBox = document.getElementById('live-chat-box');
    const closeChat = document.getElementById('close-live-chat');
    const chatForm = document.getElementById('live-chat-form');
    const chatInput = document.getElementById('live-chat-input');
    const chatMessages = document.getElementById('live-chat-messages');
    
    if (chatIcon && chatBox && closeChat && chatForm && chatInput && chatMessages) {
        // Open chat
        chatIcon.addEventListener('click', () => {
            chatBox.classList.add('active');
            chatInput.focus();
        });
        
        // Close chat
        closeChat.addEventListener('click', () => {
            chatBox.classList.remove('active');
        });
        
        // Send message
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = chatInput.value.trim();
            
            if (message) {
                // Add user message
                const userMessage = document.createElement('div');
                userMessage.className = 'message user';
                userMessage.textContent = message;
                chatMessages.appendChild(userMessage);
                
                // Clear input
                chatInput.value = '';
                
                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Simulate typing
                const typingIndicator = document.createElement('div');
                typingIndicator.className = 'message bot typing';
                typingIndicator.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
                chatMessages.appendChild(typingIndicator);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Simulate response after delay
                setTimeout(() => {
                    typingIndicator.remove();
                    
                    const botMessage = document.createElement('div');
                    botMessage.className = 'message bot';
                    
                    // Simple response based on user message
                    if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
                        botMessage.textContent = 'Hello there! How can I assist you today?';
                    } else if (message.toLowerCase().includes('help')) {
                        botMessage.textContent = 'I\'d be happy to help! What do you need assistance with?';
                    } else if (message.toLowerCase().includes('price') || message.toLowerCase().includes('cost')) {
                        botMessage.textContent = 'Our prices are very competitive. Is there a specific product you\'re interested in?';
                    } else if (message.toLowerCase().includes('shipping') || message.toLowerCase().includes('delivery')) {
                        botMessage.textContent = 'We offer free shipping on all orders over $50. Delivery typically takes 3-5 business days.';
                    } else if (message.toLowerCase().includes('return') || message.toLowerCase().includes('refund')) {
                        botMessage.textContent = 'We have a 30-day return policy. If you\'re not satisfied, you can return the product for a full refund.';
                    } else {
                        botMessage.textContent = 'Thank you for your message! Our team will get back to you shortly.';
                    }
                    
                    chatMessages.appendChild(botMessage);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1500);
            }
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && chatBox.classList.contains('active')) {
                chatBox.classList.remove('active');
            }
        });
    }
}

// Cart functionality
function initCart() {
    // Simple cart state
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
    
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Get product info
                const productCard = button.closest('.product-card') || button.closest('.modal-content');
                const productName = productCard.querySelector('h3').textContent;
                const productPrice = productCard.querySelector('.price').textContent.replace('$', '');
                const productImage = productCard.querySelector('img').src;
                
                // Create product object
                const product = {
                    id: Date.now().toString(), // Simple unique ID
                    name: productName,
                    price: parseFloat(productPrice),
                    image: productImage,
                    quantity: 1
                };
                
                // Add to cart
                const existingItem = cartItems.find(item => item.name === product.name);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cartItems.push(product);
                }
                
                // Save to local storage
                localStorage.setItem('cart', JSON.stringify(cartItems));
                
                // Update cart count
                updateCartCount();
                
                // Show success message
                showSuccessMessage('<i class="fas fa-check-circle"></i> Added to cart!');
                
                // Close modal if open
                const modal = document.querySelector('.quick-view-modal');
                if (modal) {
                    modal.classList.remove('active');
                    setTimeout(() => {
                        modal.remove();
                        document.body.style.overflow = '';
                    }, 300);
                }
            });
        });
    }
    
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        
        if (cartCount) {
            const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = itemCount;
            
            // Add animation
            cartCount.classList.add('pulse');
            setTimeout(() => {
                cartCount.classList.remove('pulse');
            }, 300);
        }
    }
}

// Form submissions
function initForms() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]');
            
            if (email.value.trim()) {
                // Success message
                showSuccessMessage('<i class="fas fa-envelope"></i> Thank you for subscribing!');
                email.value = '';
            }
        });
    }
}

// Success message
function showSuccessMessage(message, duration = 3000) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = 'success-message';
    messageElement.innerHTML = message;
    
    // Add to body
    document.body.appendChild(messageElement);
    
    // Show with animation
    setTimeout(() => {
        messageElement.classList.add('show');
    }, 10);
    
    // Remove after duration
    setTimeout(() => {
        messageElement.classList.remove('show');
        setTimeout(() => {
            messageElement.remove();
        }, 300);
    }, duration);
} 