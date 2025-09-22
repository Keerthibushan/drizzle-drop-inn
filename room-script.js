// Room-specific JavaScript for booking functionality

// Room prices
const roomPrices = {
    'standard': 1953,
    'family': 1964,
    'deluxe': 1718
};

// Get current room type from URL or page
function getCurrentRoomType() {
    const path = window.location.pathname;
    if (path.includes('standard-room')) return 'standard';
    if (path.includes('family-room')) return 'family';
    if (path.includes('deluxe-room')) return 'deluxe';
    return 'standard';
}

// Open booking modal
function openBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        const checkinInput = document.getElementById('checkin');
        const checkoutInput = document.getElementById('checkout');
        
        if (checkinInput) {
            checkinInput.min = today;
            checkinInput.value = today;
        }
        
        if (checkoutInput) {
            checkoutInput.min = today;
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            checkoutInput.value = tomorrow.toISOString().split('T')[0];
        }
        
        // Update booking summary
        updateBookingSummary();
    }
}

// Close booking modal
function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target === modal) {
        closeBookingModal();
    }
});

// Update booking summary
function updateBookingSummary() {
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    const nightsElement = document.getElementById('nights');
    const totalElement = document.getElementById('total');
    
    if (checkinInput && checkoutInput && nightsElement && totalElement) {
        const checkin = new Date(checkinInput.value);
        const checkout = new Date(checkoutInput.value);
        
        if (checkin && checkout && checkout > checkin) {
            const timeDiff = checkout.getTime() - checkin.getTime();
            const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
            const roomType = getCurrentRoomType();
            const pricePerNight = roomPrices[roomType];
            const total = nights * pricePerNight;
            
            nightsElement.textContent = nights;
            totalElement.textContent = `₹${total.toLocaleString()}`;
        }
    }
}

// Add event listeners for date changes
document.addEventListener('DOMContentLoaded', function() {
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    
    if (checkinInput) {
        checkinInput.addEventListener('change', function() {
            const checkout = document.getElementById('checkout');
            if (checkout && this.value) {
                const checkinDate = new Date(this.value);
                const minCheckout = new Date(checkinDate);
                minCheckout.setDate(minCheckout.getDate() + 1);
                checkout.min = minCheckout.toISOString().split('T')[0];
                
                // Auto-update checkout if it's before new minimum
                if (checkout.value && new Date(checkout.value) <= checkinDate) {
                    checkout.value = minCheckout.toISOString().split('T')[0];
                }
            }
            updateBookingSummary();
        });
    }
    
    if (checkoutInput) {
        checkoutInput.addEventListener('change', updateBookingSummary);
    }
    
    // Add event listeners for guest count changes
    const guestsSelect = document.getElementById('guests');
    if (guestsSelect) {
        guestsSelect.addEventListener('change', updateBookingSummary);
    }
});

// Handle booking form submission
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const bookingData = {
                checkin: formData.get('checkin'),
                checkout: formData.get('checkout'),
                guests: formData.get('guests'),
                rooms: formData.get('rooms'),
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                payment: formData.get('payment'),
                roomType: getCurrentRoomType()
            };
            
            // Validate form
            if (!validateBookingForm(bookingData)) {
                return;
            }
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Processing...';
            submitButton.disabled = true;
            
            // Simulate booking process
            setTimeout(() => {
                processBooking(bookingData);
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
});

// Validate booking form
function validateBookingForm(data) {
    const errors = [];
    
    if (!data.checkin) {
        errors.push('Please select check-in date');
    }
    
    if (!data.checkout) {
        errors.push('Please select check-out date');
    }
    
    if (data.checkin && data.checkout) {
        const checkin = new Date(data.checkin);
        const checkout = new Date(data.checkout);
        
        if (checkout <= checkin) {
            errors.push('Check-out date must be after check-in date');
        }
        
        if (checkin < new Date()) {
            errors.push('Check-in date cannot be in the past');
        }
    }
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Please enter a valid name');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.phone || data.phone.trim().length < 10) {
        errors.push('Please enter a valid phone number');
    }
    
    if (!data.payment) {
        errors.push('Please select a payment method');
    }
    
    if (errors.length > 0) {
        showBookingMessage(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

// Process booking
function processBooking(data) {
    // Calculate total
    const checkin = new Date(data.checkin);
    const checkout = new Date(data.checkout);
    const nights = Math.ceil((checkout - checkin) / (1000 * 3600 * 24));
    const total = nights * roomPrices[data.roomType];
    
    // Create booking confirmation
    const confirmation = {
        bookingId: generateBookingId(),
        roomType: data.roomType,
        checkin: data.checkin,
        checkout: data.checkout,
        nights: nights,
        guests: data.guests,
        total: total,
        customer: {
            name: data.name,
            email: data.email,
            phone: data.phone
        },
        paymentMethod: data.payment,
        status: 'confirmed',
        timestamp: new Date().toISOString()
    };
    
    // Store booking in localStorage (in real app, this would be sent to server)
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(confirmation);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Show success message
    showBookingSuccess(confirmation);
}

// Generate booking ID
function generateBookingId() {
    return 'DDI' + Date.now().toString(36).toUpperCase();
}

// Show booking success
function showBookingSuccess(confirmation) {
    const modal = document.getElementById('bookingModal');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.innerHTML = `
        <div class="booking-success">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Booking Confirmed!</h2>
            <div class="booking-details">
                <h3>Booking Details</h3>
                <div class="detail-item">
                    <span>Booking ID:</span>
                    <span>${confirmation.bookingId}</span>
                </div>
                <div class="detail-item">
                    <span>Room Type:</span>
                    <span>${confirmation.roomType.charAt(0).toUpperCase() + confirmation.roomType.slice(1)} Room</span>
                </div>
                <div class="detail-item">
                    <span>Check-in:</span>
                    <span>${new Date(confirmation.checkin).toLocaleDateString()}</span>
                </div>
                <div class="detail-item">
                    <span>Check-out:</span>
                    <span>${new Date(confirmation.checkout).toLocaleDateString()}</span>
                </div>
                <div class="detail-item">
                    <span>Nights:</span>
                    <span>${confirmation.nights}</span>
                </div>
                <div class="detail-item">
                    <span>Guests:</span>
                    <span>${confirmation.guests}</span>
                </div>
                <div class="detail-item total">
                    <span>Total Amount:</span>
                    <span>₹${confirmation.total.toLocaleString()}</span>
                </div>
            </div>
            <div class="success-message">
                <p>Your booking has been confirmed! A confirmation email has been sent to ${confirmation.customer.email}</p>
                <p>We look forward to welcoming you to Drizzle Drop Inn!</p>
            </div>
            <div class="success-actions">
                <button class="btn btn-primary" onclick="closeBookingModal()">Close</button>
                <button class="btn btn-secondary" onclick="printBooking()">Print Booking</button>
            </div>
        </div>
    `;
    
    // Add success styles
    const style = document.createElement('style');
    style.textContent = `
        .booking-success {
            text-align: center;
            padding: 2rem;
        }
        .success-icon {
            font-size: 4rem;
            color: #27ae60;
            margin-bottom: 1rem;
        }
        .booking-details {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 15px;
            margin: 2rem 0;
            text-align: left;
        }
        .detail-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.8rem;
            padding: 0.5rem 0;
            border-bottom: 1px solid #e0e0e0;
        }
        .detail-item:last-child {
            border-bottom: none;
        }
        .detail-item.total {
            font-weight: 700;
            font-size: 1.2rem;
            color: #e74c3c;
            border-top: 2px solid #e74c3c;
            padding-top: 1rem;
            margin-top: 1rem;
        }
        .success-message {
            margin: 2rem 0;
            color: #666;
        }
        .success-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }
    `;
    document.head.appendChild(style);
}

// Show booking message
function showBookingMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.booking-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `booking-message ${type === 'success' ? 'success-message' : 'error-message'}`;
    messageDiv.innerHTML = message;
    messageDiv.style.display = 'block';
    
    const form = document.getElementById('bookingForm');
    if (form) {
        form.insertBefore(messageDiv, form.firstChild);
        
        // Auto-hide message after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Print booking
function printBooking() {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const latestBooking = bookings[bookings.length - 1];
    
    if (latestBooking) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Booking Confirmation - Drizzle Drop Inn</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .booking-details { background: #f8f9fa; padding: 20px; border-radius: 10px; }
                        .detail-item { display: flex; justify-content: space-between; margin-bottom: 10px; }
                        .total { font-weight: bold; font-size: 1.2em; color: #e74c3c; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Drizzle Drop Inn</h1>
                        <h2>Booking Confirmation</h2>
                    </div>
                    <div class="booking-details">
                        <div class="detail-item">
                            <span>Booking ID:</span>
                            <span>${latestBooking.bookingId}</span>
                        </div>
                        <div class="detail-item">
                            <span>Room Type:</span>
                            <span>${latestBooking.roomType.charAt(0).toUpperCase() + latestBooking.roomType.slice(1)} Room</span>
                        </div>
                        <div class="detail-item">
                            <span>Check-in:</span>
                            <span>${new Date(latestBooking.checkin).toLocaleDateString()}</span>
                        </div>
                        <div class="detail-item">
                            <span>Check-out:</span>
                            <span>${new Date(latestBooking.checkout).toLocaleDateString()}</span>
                        </div>
                        <div class="detail-item">
                            <span>Nights:</span>
                            <span>${latestBooking.nights}</span>
                        </div>
                        <div class="detail-item">
                            <span>Guests:</span>
                            <span>${latestBooking.guests}</span>
                        </div>
                        <div class="detail-item total">
                            <span>Total Amount:</span>
                            <span>₹${latestBooking.total.toLocaleString()}</span>
                        </div>
                    </div>
                    <p>Thank you for choosing Drizzle Drop Inn!</p>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Initialize room page
document.addEventListener('DOMContentLoaded', function() {
    // Set up date inputs
    const today = new Date().toISOString().split('T')[0];
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    
    if (checkinInput) {
        checkinInput.min = today;
    }
    
    if (checkoutInput) {
        checkoutInput.min = today;
    }
    
    // Add keyboard navigation for modal
    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('bookingModal');
        if (modal && modal.style.display === 'block') {
            if (e.key === 'Escape') {
                closeBookingModal();
            }
        }
    });
});

