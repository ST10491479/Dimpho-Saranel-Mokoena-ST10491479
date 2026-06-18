// ============================================
// GALLERY FILTER
// ============================================
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // Filter items
        const filter = this.dataset.filter;
        galleryItems.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// ============================================
// LIGHTBOX
// ============================================
function openLightbox(img) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');

    lightbox.style.display = 'flex';
    lightboxImg.src = img.src;
    caption.textContent = img.alt || '';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLightbox();
});

// ============================================
// HAMBURGER MENU
// ============================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('nav ul');

hamburger.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    this.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
});

// Close menu when a link is clicked
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.textContent = '☰';
    });

    // ============================================
// ACCORDION / FAQ
// ============================================
function toggleAccordion(button) {
    const item = button.closest('.accordion-item');
    const isActive = item.classList.contains('active');
    
    // Close all items
    document.querySelectorAll('.accordion-item').forEach(el => {
        el.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        item.classList.add('active');
    }
}

// ============================================
// GALLERY SEARCH
// ============================================
function searchGallery() {
    const input = document.getElementById('gallerySearch');
    const filter = input.value.toLowerCase();
    const items = document.querySelectorAll('.gallery-item');
    let visibleCount = 0;
    
    items.forEach(item => {
        const name = item.dataset.name || '';
        const text = item.querySelector('p')?.textContent.toLowerCase() || '';
        
        if (name.includes(filter) || text.includes(filter)) {
            item.classList.remove('hidden');
            visibleCount++;
        } else {
            item.classList.add('hidden');
        }
    });
    
    // Update count
    const countSpan = document.getElementById('itemCount');
    if (countSpan) {
        countSpan.textContent = `🍞 ${visibleCount} delicious bakes`;
    }
    
    // Show/hide no results message
    const noResults = document.getElementById('noResults');
    if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}

// ============================================
// LIGHTBOX WITH NAVIGATION
// ============================================
let lightboxImages = [];
let currentIndex = 0;

function openLightbox(img) {
    const allImages = document.querySelectorAll('.gallery-item img');
    lightboxImages = Array.from(allImages).map(img => img.src);
    currentIndex = lightboxImages.indexOf(img.src);
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    const counter = document.getElementById('lightbox-counter');
    
    lightbox.style.display = 'flex';
    lightboxImg.src = lightboxImages[currentIndex];
    caption.textContent = img.alt || '';
    counter.textContent = `${currentIndex + 1} / ${lightboxImages.length}`;
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function navigateLightbox(direction) {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = lightboxImages.length - 1;
    if (currentIndex >= lightboxImages.length) currentIndex = 0;
    
    const lightboxImg = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    const counter = document.getElementById('lightbox-counter');
    
    lightboxImg.src = lightboxImages[currentIndex];
    
    // Find caption from gallery
    const allItems = document.querySelectorAll('.gallery-item');
    allItems.forEach(item => {
        const img = item.querySelector('img');
        if (img && img.src === lightboxImages[currentIndex]) {
            caption.textContent = img.alt || '';
        }
    });
    
    counter.textContent = `${currentIndex + 1} / ${lightboxImages.length}`;
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', function(e) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.style.display === 'flex') {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            navigateLightbox(-1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            navigateLightbox(1);
        } else if (e.key === 'Escape') {
            closeLightbox();
        }
    }
});

// ============================================
// TESTIMONIAL SLIDER
// ============================================
let currentTestimonial = 0;
let testimonialInterval;

function initTestimonials() {
    const track = document.getElementById('testimonialTrack');
    const dots = document.getElementById('testimonialDots');
    const cards = track ? track.querySelectorAll('.testimonial-card') : [];
    
    if (cards.length === 0) return;
    
    // Create dots
    dots.innerHTML = '';
    cards.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => goToTestimonial(i);
        dots.appendChild(dot);
    });
    
    // Auto-slide every 5 seconds
    testimonialInterval = setInterval(() => {
        nextTestimonial();
    }, 5000);
}

function goToTestimonial(index) {
    const track = document.getElementById('testimonialTrack');
    const dots = document.querySelectorAll('.testimonial-dot');
    const cards = track ? track.querySelectorAll('.testimonial-card') : [];
    const total = cards.length;
    
    if (total === 0) return;
    
    // Clamp index
    currentTestimonial = Math.max(0, Math.min(index, total - 1));
    
    // Move track
    if (track) {
        const cardWidth = cards[0].offsetWidth + 32; // width + gap
        track.style.transform = `translateX(-${currentTestimonial * cardWidth}px)`;
    }
    
    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentTestimonial);
    });
}

function nextTestimonial() {
    const track = document.getElementById('testimonialTrack');
    const cards = track ? track.querySelectorAll('.testimonial-card') : [];
    const total = cards.length;
    if (total === 0) return;
    goToTestimonial((currentTestimonial + 1) % total);
}

function prevTestimonial() {
    const track = document.getElementById('testimonialTrack');
    const cards = track ? track.querySelectorAll('.testimonial-card') : [];
    const total = cards.length;
    if (total === 0) return;
    goToTestimonial((currentTestimonial - 1 + total) % total);
}

// Pause auto-slide on hover
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('testimonialSlider');
    if (slider) {
        slider.addEventListener('mouseenter', () => {
            clearInterval(testimonialInterval);
        });
        slider.addEventListener('mouseleave', () => {
            testimonialInterval = setInterval(nextTestimonial, 5000);
        });
    }
    initTestimonials();
    
    // Handle resize for testimonial
    window.addEventListener('resize', () => {
        goToTestimonial(currentTestimonial);
    });
});

// ============================================
// NEWSLETTER SUBSCRIPTION
// ============================================
function handleNewsletter(event) {
    event.preventDefault();
    const email = document.getElementById('newsletterEmail');
    const message = document.getElementById('newsletterMessage');
    
    if (!email.value || !email.value.includes('@')) {
        message.style.display = 'block';
        message.className = 'newsletter-message error';
        message.textContent = '❌ Please enter a valid email address.';
        return false;
    }
    
    // Simulate success
    message.style.display = 'block';
    message.className = 'newsletter-message success';
    message.textContent = '✅ Thank you for subscribing! Welcome to The Daily Loaf family.';
    email.value = '';
    
    // Hide after 5 seconds
    setTimeout(() => {
        message.style.display = 'none';
    }, 5000);
    
    return false;
}

// ============================================
// BACK TO TOP
// ============================================
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', function() {
    if (window.scrollY > 500) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
});
// ============================================
// ENQUIRY FORM VALIDATION
// ============================================
function validateEnquiryForm(event) {
    event.preventDefault();

    // Clear previous errors
    clearErrors();

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const orderType = document.getElementById('orderType').value;
    const dateNeeded = document.getElementById('dateNeeded').value;
    const people = document.getElementById('people').value;
    const message = document.getElementById('message').value.trim();
    const consent = document.getElementById('consent').checked;

    let isValid = true;

    // Validate Name
    if (name.length < 2) {
        showError('nameError');
        isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('emailError');
        isValid = false;
    }

    // Validate Phone (optional but validate if provided)
    if (phone && !/^[\d\s\-+()]{8,15}$/.test(phone)) {
        showError('phoneError');
        isValid = false;
    }

    // Validate Order Type
    if (!orderType) {
        showError('orderTypeError');
        isValid = false;
    }

    // Validate Date (must be today or future)
    if (dateNeeded) {
        const selectedDate = new Date(dateNeeded);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            showError('dateError');
            isValid = false;
        }
    }

    // Validate People Count
    if (people) {
        const numPeople = parseInt(people);
        if (isNaN(numPeople) || numPeople < 1 || numPeople > 500) {
            showError('peopleError');
            isValid = false;
        }
    }

    // Validate Message
    if (message.length < 10) {
        showError('messageError');
        isValid = false;
    }

    // Validate Consent
    if (!consent) {
        showError('consentError');
        isValid = false;
    }

    if (!isValid) {
        // Scroll to first error
        const firstError = document.querySelector('.error-message.visible');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return false;
    }

    // Show loading state
    document.getElementById('loadingState').style.display = 'block';
    document.getElementById('submitBtn').style.display = 'none';

    // Simulate AJAX submission (replace with actual fetch when ready)
    setTimeout(function() {
        // Hide form, show success
        document.getElementById('enquiryFormElement').style.display = 'none';
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth' });

        // Log to console (for testing)
        console.log('Enquiry submitted:', {
            name,
            email,
            phone,
            orderType,
            dateNeeded,
            people,
            budget: document.getElementById('budget').value,
            message
        });

        // You can uncomment this when you have a backend:
        // submitFormToServer({ name, email, phone, orderType, dateNeeded, people, message });

    }, 1500);

    return false;
}

// ============================================
// FORM HELPER FUNCTIONS
// ============================================
function showError(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.add('visible');
        // Add error class to parent input
        const parent = el.closest('.form-group');
        if (parent) {
            const input = parent.querySelector('input, select, textarea');
            if (input) {
                input.classList.add('error');
            }
        }
    }
}

function clearErrors() {
    document.querySelectorAll('.error-message.visible').forEach(el => {
        el.classList.remove('visible');
    });
    document.querySelectorAll('.form-group input.error, .form-group select.error, .form-group textarea.error').forEach(el => {
        el.classList.remove('error');
    });
}

function resetForm() {
    document.getElementById('enquiryFormElement').reset();
    document.getElementById('enquiryFormElement').style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('submitBtn').style.display = 'inline-block';
    document.getElementById('loadingState').style.display = 'none';
    clearErrors();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// CHAR COUNTER FOR MESSAGE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const messageField = document.getElementById('message');
    const charCounter = document.getElementById('charCounter');

    if (messageField && charCounter) {
        messageField.addEventListener('input', function() {
            const count = this.value.length;
            charCounter.textContent = count + ' / 500 characters';
            if (count > 450) {
                charCounter.style.color = '#c62828';
            } else {
                charCounter.style.color = '#8a6b54';
            }
        });
    }
});

// ============================================
// SUBMIT TO SERVER (AJAX - Part 3 Requirement)
// ============================================
function submitFormToServer(data) {
    // Example with Formspree - replace with your actual endpoint
    fetch('https://formspree.io/f/your-form-id-here', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            console.log('Form submitted successfully');
        } else {
            console.error('Form submission failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
// ============================================
// CONTACT FORM VALIDATION
// ============================================
function validateContactForm(event) {
    event.preventDefault();

    // Clear previous errors
    clearContactErrors();

    // Get form values
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value.trim();
    const consent = document.getElementById('contactConsent').checked;

    let isValid = true;

    // Validate Name
    if (name.length < 2) {
        showContactError('contactNameError');
        isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showContactError('contactEmailError');
        isValid = false;
    }

    // Validate Phone (optional but validate if provided)
    if (phone && !/^[\d\s\-+()]{8,15}$/.test(phone)) {
        showContactError('contactPhoneError');
        isValid = false;
    }

    // Validate Subject
    if (!subject) {
        showContactError('contactSubjectError');
        isValid = false;
    }

    // Validate Message (at least 10 characters)
    if (message.length < 10) {
        showContactError('contactMessageError');
        isValid = false;
    }

    // Validate Consent
    if (!consent) {
        showContactError('contactConsentError');
        isValid = false;
    }

    if (!isValid) {
        const firstError = document.querySelector('.error-message.visible');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return false;
    }

    // Show loading state
    document.getElementById('contactLoading').style.display = 'block';
    document.getElementById('contactSubmitBtn').style.display = 'none';

    // Simulate AJAX submission
    setTimeout(function() {
        document.getElementById('contactFormElement').style.display = 'none';
        document.getElementById('contactLoading').style.display = 'none';
        document.getElementById('contactSuccess').style.display = 'block';
        document.getElementById('contactSuccess').scrollIntoView({ behavior: 'smooth' });

        // Log for testing
        console.log('Contact message submitted:', {
            name,
            email,
            phone,
            subject,
            message
        });

    }, 1500);

    return false;
}

// ============================================
// CONTACT FORM HELPERS
// ============================================
function showContactError(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.add('visible');
        const parent = el.closest('.form-group');
        if (parent) {
            const input = parent.querySelector('input, select, textarea');
            if (input) {
                input.classList.add('error');
            }
        }
    }
}

function clearContactErrors() {
    document.querySelectorAll('.error-message.visible').forEach(el => {
        el.classList.remove('visible');
    });
    document.querySelectorAll('.form-group input.error, .form-group select.error, .form-group textarea.error').forEach(el => {
        el.classList.remove('error');
    });
}

function resetContactForm() {
    document.getElementById('contactFormElement').reset();
    document.getElementById('contactFormElement').style.display = 'block';
    document.getElementById('contactSuccess').style.display = 'none';
    document.getElementById('contactSubmitBtn').style.display = 'inline-block';
    document.getElementById('contactLoading').style.display = 'none';
    clearContactErrors();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// CONTACT FORM CHAR COUNTER
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const messageField = document.getElementById('contactMessage');
    const charCounter = document.getElementById('contactCharCounter');

    if (messageField && charCounter) {
        messageField.addEventListener('input', function() {
            const count = this.value.length;
            charCounter.textContent = count + ' / 500 characters';
            if (count > 450) {
                charCounter.style.color = '#c62828';
            } else {
                charCounter.style.color = '#8a6b54';
            }
        });
    }
});