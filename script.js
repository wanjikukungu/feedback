
// Form data storage
let formData = {
    name: '',
    email: '',
    visitDate: '',
    visitPurpose: '',
    overallRating: 0,
    accommodationRating: 0,
    transportationRating: 0,
    activitiesRating: 0,
    serviceRating: 0,
    highlights: '',
    improvements: '',
    recommend: '',
    additionalComments: ''
};

// Initialize form functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeStarRatings();
    initializeForm();
});

// Initialize star rating functionality
function initializeStarRatings() {
    const starRatings = document.querySelectorAll('.star-rating');
    
    starRatings.forEach(rating => {
        const stars = rating.querySelectorAll('i');
        const ratingName = rating.getAttribute('data-rating');
        
        stars.forEach((star, index) => {
            // Hover effect
            star.addEventListener('mouseenter', () => {
                highlightStars(stars, index + 1);
            });
            
            // Click to set rating
            star.addEventListener('click', () => {
                const value = index + 1;
                setRating(stars, value);
                formData[ratingName] = value;
            });
        });
        
        // Reset on mouse leave
        rating.addEventListener('mouseleave', () => {
            const currentRating = formData[ratingName] || 0;
            setRating(stars, currentRating);
        });
    });
}

// Highlight stars up to index
function highlightStars(stars, count) {
    stars.forEach((star, index) => {
        if (index < count) {
            star.style.color = '#fbbf24';
        } else {
            star.style.color = '#d1d5db';
        }
    });
}

// Set permanent rating
function setRating(stars, count) {
    stars.forEach((star, index) => {
        if (index < count) {
            star.classList.add('active');
            star.style.color = '#fbbf24';
        } else {
            star.classList.remove('active');
            star.style.color = '#d1d5db';
        }
    });
}

// Initialize form event listeners
function initializeForm() {
    const form = document.getElementById('feedbackForm');
    if (!form) return;
    
    // Add input event listeners
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', (e) => {
            formData[e.target.name] = e.target.value;
        });
    });
    
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.overallRating) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Log form data (in a real app, this would be sent to a server)
    console.log('Feedback submitted:', formData);
    
    // Show success message
    showToast('Thank you for your feedback!', 'success');
    
    // Redirect to thank you page after delay
    setTimeout(() => {
        window.location.href = 'thank-you.html';
    }, 1000);
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add loading animation to buttons
document.addEventListener('click', function(e) {
    if (e.target.type === 'submit' || e.target.closest('button[type="submit"]')) {
        const btn = e.target.type === 'submit' ? e.target : e.target.closest('button[type="submit"]');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        btn.disabled = true;
        
        // Reset button after form validation
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 1000);
    }
});