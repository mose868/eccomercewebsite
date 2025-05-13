/**
 * Intelligent Chat Support System for PipDynamic
 * Handles user queries about products, cultural wear, and general information
 */

class ChatSupport {
    constructor() {
        // Chat interface elements
        this.chatIcon = document.getElementById('live-chat-icon');
        this.chatBox = document.getElementById('live-chat-box');
        this.closeChat = document.getElementById('close-live-chat');
        this.chatForm = document.getElementById('live-chat-form');
        this.chatInput = document.getElementById('live-chat-input');
        this.chatMessages = document.getElementById('live-chat-messages');
        
        // Quick reply buttons container
        this.quickRepliesContainer = document.createElement('div');
        this.quickRepliesContainer.className = 'quick-replies';
        this.chatMessages.after(this.quickRepliesContainer);
        
        // Context tracking for multi-turn conversations
        this.conversationContext = {
            lastTopic: null,
            mentionedProducts: [],
            userLocation: null,
            currentQuestion: null
        };
        
        // Product knowledge base
        this.productCategories = {
            'cultural wear': [
                { 
                    id: 'kenyan-kanzu',
                    name: 'Kenyan Kanzu', 
                    description: 'Traditional Kenyan robe-like garment for men, typically white and worn during special occasions.',
                    price: 89.99,
                    origin: 'Kenya',
                    inStock: true,
                    imageUrl: 'images/cultural-wear/kenyan-kanzu.jpg'
                },
                { 
                    id: 'nigerian-agbada',
                    name: 'Nigerian Agbada', 
                    description: 'Flowing wide-sleeved robe worn by men in Nigeria, typically made of rich, embroidered fabric.',
                    price: 129.99,
                    origin: 'Nigeria',
                    inStock: true,
                    imageUrl: 'images/cultural-wear/nigerian-agbada.jpg'
                },
                { 
                    id: 'indian-saree',
                    name: 'Indian Saree', 
                    description: 'Traditional garment worn by women across India, consisting of a drape varying from 5 to 9 yards.',
                    price: 149.99,
                    origin: 'India',
                    inStock: true,
                    imageUrl: 'images/cultural-wear/indian-saree.jpg'
                },
                { 
                    id: 'japanese-kimono',
                    name: 'Japanese Kimono', 
                    description: 'Traditional Japanese garment and the national dress of Japan, with T-shaped, straight-lined robes.',
                    price: 199.99,
                    origin: 'Japan',
                    inStock: true,
                    imageUrl: 'images/cultural-wear/japanese-kimono.jpg'
                },
                { 
                    id: 'mexican-huipil',
                    name: 'Mexican Huipil', 
                    description: 'Embroidered blouse or dress worn by indigenous women from central Mexico to Central America.',
                    price: 79.99,
                    origin: 'Mexico',
                    inStock: false,
                    imageUrl: 'images/cultural-wear/mexican-huipil.jpg'
                }
            ]
        };
        
        // Company information
        this.companyInfo = {
            shipping: {
                standard: 'Free standard shipping on all orders over $50. Delivery typically takes 3-5 business days.',
                express: 'Express shipping is available for $15 and takes 1-2 business days.',
                international: 'International shipping is available for $25-$50 depending on location, and takes 7-14 business days.'
            },
            returns: {
                policy: 'We offer a 30-day return policy. Items must be unworn, unwashed, and in original packaging.',
                process: 'To initiate a return, log into your account and follow the return instructions or contact our customer support.',
                refunds: 'Refunds are processed within 7-10 business days after we receive the returned item.'
            },
            contact: {
                email: 'support@pipdynamic.com',
                phone: '+1 (234) 567-8900',
                hours: 'Monday-Friday, 9AM-5PM EST'
            }
        };
        
        // Initialize event listeners
        this.initEventListeners();
    }
    
    // Set up all event listeners for the chat interface
    initEventListeners() {
        if (!this.chatIcon || !this.chatBox) return;
        
        // Toggle chat box visibility
        this.chatIcon.addEventListener('click', () => this.openChat());
        
        // Close chat box
        if (this.closeChat) {
            this.closeChat.addEventListener('click', () => this.closeChat());
        }
        
        // Handle form submissions (user messages)
        if (this.chatForm) {
            this.chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleUserMessage();
            });
        }
        
        // Handle escape key to close chat
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.chatBox.classList.contains('active')) {
                this.closeChat();
            }
        });
        
        // Display welcome message when chat is first opened
        this.chatIcon.addEventListener('click', () => {
            if (!this.hasWelcomeMessage) {
                setTimeout(() => {
                    this.addWelcomeMessage();
                }, 500);
                this.hasWelcomeMessage = true;
            }
        });
    }
    
    // Open chat window
    openChat() {
        this.chatBox.classList.add('active');
        this.chatInput.focus();
    }
    
    // Close chat window
    closeChat() {
        this.chatBox.classList.remove('active');
    }
    
    // Add initial welcome message with quick reply options
    addWelcomeMessage() {
        const welcomeMsg = "Hello! Welcome to PipDynamic. How can I help you today?";
        this.addBotMessage(welcomeMsg);
        
        // Add quick reply buttons
        this.showQuickReplies([
            { text: "Explore Cultural Wear", value: "show me cultural wear" },
            { text: "Shipping Information", value: "shipping info" },
            { text: "Return Policy", value: "return policy" },
            { text: "Contact Us", value: "contact information" }
        ]);
    }
    
    // Handle user message submission
    handleUserMessage() {
        const message = this.chatInput.value.trim();
        
        if (!message) return;
        
        // Add user message to chat
        this.addUserMessage(message);
        
        // Clear input
        this.chatInput.value = '';
        
        // Process message and generate response
        this.processMessage(message);
    }
    
    // Process user message and generate appropriate response
    processMessage(message) {
        // Update conversation context
        this.conversationContext.currentQuestion = message.toLowerCase();
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Process with NLP (simple keyword matching for now)
        setTimeout(() => {
            this.removeTypingIndicator();
            
            // Generate response based on message content
            const response = this.generateResponse(message);
            this.addBotMessage(response.message);
            
            // Update conversation context
            if (response.context) {
                Object.assign(this.conversationContext, response.context);
            }
            
            // Show quick replies if available
            if (response.quickReplies && response.quickReplies.length > 0) {
                this.showQuickReplies(response.quickReplies);
            }
            
            // Show product cards if needed
            if (response.showProducts && response.showProducts.length > 0) {
                this.showProductCards(response.showProducts);
            }
        }, 1000 + Math.random() * 1000); // Random delay to simulate thinking
    }
    
    // Generate response based on user message
    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for greetings
        if (this.matchKeywords(lowerMessage, ['hi', 'hello', 'hey', 'greetings'])) {
            return {
                message: "Hello! How can I assist you today with our cultural wear collection?",
                quickReplies: [
                    { text: "Show Cultural Wear", value: "show me cultural wear" },
                    { text: "Shipping Info", value: "shipping info" },
                    { text: "Returns", value: "return policy" }
                ],
                context: { lastTopic: 'greeting' }
            };
        }
        
        // Check for cultural wear inquiries
        if (this.matchKeywords(lowerMessage, ['cultural', 'traditional', 'ethnic', 'wear', 'clothing', 'dress', 'kanzu', 'agbada', 'saree', 'kimono', 'huipil'])) {
            const mentionedProducts = [];
            
            // Check for specific items
            if (this.matchKeywords(lowerMessage, ['kenyan', 'kanzu'])) {
                mentionedProducts.push('kenyan-kanzu');
            }
            if (this.matchKeywords(lowerMessage, ['nigerian', 'agbada'])) {
                mentionedProducts.push('nigerian-agbada');
            }
            if (this.matchKeywords(lowerMessage, ['indian', 'saree'])) {
                mentionedProducts.push('indian-saree');
            }
            if (this.matchKeywords(lowerMessage, ['japanese', 'kimono'])) {
                mentionedProducts.push('japanese-kimono');
            }
            if (this.matchKeywords(lowerMessage, ['mexican', 'huipil'])) {
                mentionedProducts.push('mexican-huipil');
            }
            
            // If specific items mentioned, show those
            if (mentionedProducts.length > 0) {
                const products = this.productCategories['cultural wear'].filter(p => mentionedProducts.includes(p.id));
                
                return {
                    message: `Here's what I found about our ${products.map(p => p.name).join(', ')}:`,
                    showProducts: products,
                    quickReplies: [
                        { text: "View All Cultural Wear", value: "show me all cultural wear" },
                        { text: "Shipping Options", value: "shipping options" }
                    ],
                    context: { lastTopic: 'specific_cultural_wear', mentionedProducts }
                };
            }
            
            // Otherwise show all cultural wear
            return {
                message: "We have a beautiful collection of cultural wear from around the world. Here are some highlights:",
                showProducts: this.productCategories['cultural wear'],
                quickReplies: [
                    { text: "Shipping Info", value: "shipping info" },
                    { text: "Return Policy", value: "return policy" }
                ],
                context: { lastTopic: 'cultural_wear' }
            };
        }
        
        // Check for shipping inquiries
        if (this.matchKeywords(lowerMessage, ['shipping', 'delivery', 'ship', 'deliver', 'how long', 'when will'])) {
            return {
                message: `${this.companyInfo.shipping.standard}\n\n${this.companyInfo.shipping.express}\n\n${this.companyInfo.shipping.international}`,
                quickReplies: [
                    { text: "Return Policy", value: "return policy" },
                    { text: "Track Order", value: "track my order" },
                    { text: "Contact Support", value: "contact information" }
                ],
                context: { lastTopic: 'shipping' }
            };
        }
        
        // Check for return/refund inquiries
        if (this.matchKeywords(lowerMessage, ['return', 'refund', 'money back', 'cancel order'])) {
            return {
                message: `${this.companyInfo.returns.policy}\n\n${this.companyInfo.returns.process}\n\n${this.companyInfo.returns.refunds}`,
                quickReplies: [
                    { text: "Shipping Info", value: "shipping info" },
                    { text: "Contact Support", value: "contact information" }
                ],
                context: { lastTopic: 'returns' }
            };
        }
        
        // Check for contact inquiries
        if (this.matchKeywords(lowerMessage, ['contact', 'phone', 'email', 'call', 'hours', 'support'])) {
            return {
                message: `You can reach our customer support team at:\n\nEmail: ${this.companyInfo.contact.email}\nPhone: ${this.companyInfo.contact.phone}\nHours: ${this.companyInfo.contact.hours}`,
                quickReplies: [
                    { text: "Shipping Info", value: "shipping info" },
                    { text: "Return Policy", value: "return policy" }
                ],
                context: { lastTopic: 'contact' }
            };
        }
        
        // Check for price inquiries
        if (this.matchKeywords(lowerMessage, ['price', 'cost', 'how much', 'pricing'])) {
            // If previously mentioned specific products
            if (this.conversationContext.mentionedProducts && this.conversationContext.mentionedProducts.length > 0) {
                const products = this.productCategories['cultural wear'].filter(p => 
                    this.conversationContext.mentionedProducts.includes(p.id));
                    
                if (products.length > 0) {
                    return {
                        message: `The ${products.map(p => `${p.name} is priced at $${p.price}`).join(', ')}.`,
                        quickReplies: [
                            { text: "Shipping Info", value: "shipping info" },
                            { text: "Return Policy", value: "return policy" }
                        ],
                        context: { lastTopic: 'pricing' }
                    };
                }
            }
            
            return {
                message: "Our cultural wear prices range from $79.99 to $199.99 depending on the item. Would you like to see our collection?",
                quickReplies: [
                    { text: "Show Cultural Wear", value: "show me cultural wear" },
                    { text: "Contact Support", value: "contact information" }
                ],
                context: { lastTopic: 'pricing' }
            };
        }
        
        // Check for availability inquiries
        if (this.matchKeywords(lowerMessage, ['in stock', 'available', 'when', 'restock'])) {
            // If previously mentioned specific products
            if (this.conversationContext.mentionedProducts && this.conversationContext.mentionedProducts.length > 0) {
                const products = this.productCategories['cultural wear'].filter(p => 
                    this.conversationContext.mentionedProducts.includes(p.id));
                    
                if (products.length > 0) {
                    const availableProducts = products.filter(p => p.inStock);
                    const unavailableProducts = products.filter(p => !p.inStock);
                    
                    let response = "";
                    
                    if (availableProducts.length > 0) {
                        response += `The ${availableProducts.map(p => p.name).join(', ')} ${availableProducts.length === 1 ? 'is' : 'are'} currently in stock. `;
                    }
                    
                    if (unavailableProducts.length > 0) {
                        response += `The ${unavailableProducts.map(p => p.name).join(', ')} ${unavailableProducts.length === 1 ? 'is' : 'are'} currently out of stock. We expect to restock within 2-3 weeks.`;
                    }
                    
                    return {
                        message: response,
                        quickReplies: [
                            { text: "Shipping Info", value: "shipping info" },
                            { text: "Other Cultural Wear", value: "show me cultural wear" }
                        ],
                        context: { lastTopic: 'availability' }
                    };
                }
            }
            
            return {
                message: "Most of our cultural wear items are in stock and ready to ship. The Mexican Huipil is currently out of stock and expected to be restocked within 2-3 weeks. Would you like to see what's available?",
                quickReplies: [
                    { text: "Show Available Items", value: "show me in stock cultural wear" },
                    { text: "Notify When Available", value: "notify me when available" }
                ],
                context: { lastTopic: 'availability' }
            };
        }
        
        // Check for sizing inquiries
        if (this.matchKeywords(lowerMessage, ['size', 'sizing', 'fit', 'measurement', 'dimensions'])) {
            return {
                message: "Our cultural wear comes in sizes XS to XXL. Each product page includes detailed size charts with measurements in inches and centimeters. If you're between sizes, we generally recommend sizing up for a more comfortable fit.",
                quickReplies: [
                    { text: "Size Chart", value: "show size chart" },
                    { text: "Show Cultural Wear", value: "show me cultural wear" }
                ],
                context: { lastTopic: 'sizing' }
            };
        }
        
        // Check for care instructions
        if (this.matchKeywords(lowerMessage, ['wash', 'care', 'clean', 'instructions', 'maintain'])) {
            return {
                message: "Most of our cultural wear items require gentle handling. We recommend hand washing in cold water or dry cleaning for delicate fabrics. Each item comes with specific care instructions on its tag and product page.",
                quickReplies: [
                    { text: "Show Cultural Wear", value: "show me cultural wear" },
                    { text: "Return Policy", value: "return policy" }
                ],
                context: { lastTopic: 'care' }
            };
        }
        
        // Default response if no match is found
        return {
            message: "I'm not sure I understand. Could you please rephrase your question or select one of these options?",
            quickReplies: [
                { text: "Cultural Wear", value: "show me cultural wear" },
                { text: "Shipping", value: "shipping info" },
                { text: "Returns", value: "return policy" },
                { text: "Contact Us", value: "contact information" }
            ],
            context: { lastTopic: 'unknown' }
        };
    }
    
    // Add user message to chat
    addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message user';
        messageElement.textContent = message;
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
        
        // Clear quick replies
        this.clearQuickReplies();
    }
    
    // Add bot message to chat
    addBotMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message bot';
        messageElement.innerHTML = message.replace(/\n/g, '<br>');
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }
    
    // Show typing indicator
    showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message bot typing';
        typingIndicator.innerHTML = '<span>.</span><span>.</span><span>.</span>';
        typingIndicator.id = 'typing-indicator';
        this.chatMessages.appendChild(typingIndicator);
        this.scrollToBottom();
    }
    
    // Remove typing indicator
    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Show quick reply buttons
    showQuickReplies(replies) {
        this.clearQuickReplies();
        
        replies.forEach(reply => {
            const button = document.createElement('button');
            button.className = 'quick-reply-btn';
            button.textContent = reply.text;
            button.addEventListener('click', () => {
                this.chatInput.value = reply.value;
                this.handleUserMessage();
            });
            this.quickRepliesContainer.appendChild(button);
        });
        
        this.quickRepliesContainer.style.display = 'flex';
    }
    
    // Clear quick reply buttons
    clearQuickReplies() {
        this.quickRepliesContainer.innerHTML = '';
        this.quickRepliesContainer.style.display = 'none';
    }
    
    // Show product cards in the chat
    showProductCards(products) {
        const productsContainer = document.createElement('div');
        productsContainer.className = 'chat-products';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'chat-product-card';
            
            productCard.innerHTML = `
                <div class="chat-product-image">
                    <img src="${product.imageUrl}" alt="${product.name} - ${product.description}" loading="lazy">
                </div>
                <div class="chat-product-info">
                    <h4>${product.name}</h4>
                    <p class="chat-product-origin">Origin: ${product.origin}</p>
                    <p class="chat-product-price">$${product.price}</p>
                    <p class="chat-product-availability">${product.inStock ? 'In Stock' : 'Out of Stock'}</p>
                </div>
            `;
            
            productsContainer.appendChild(productCard);
        });
        
        const messageElement = document.createElement('div');
        messageElement.className = 'message bot products-message';
        messageElement.appendChild(productsContainer);
        
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }
    
    // Helper function to match keywords in a message
    matchKeywords(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }
    
    // Scroll chat to bottom
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Initialize chat system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const chatSupport = new ChatSupport();
    
    // Make it globally accessible for debugging
    window.chatSupport = chatSupport;
}); 