class LuxPropertiesApp {
    constructor() {
        this.currentStep = 0;
        this.carouselIndex = 0;
        this.carouselInterval = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeCarousel();
        this.setupFormValidation();
    }

    setupEventListeners() {
        // Header scroll effect
        window.addEventListener('scroll', this.handleHeaderScroll.bind(this));
        
        // Mobile menu functionality
        this.setupMobileMenu();
        
        // Multi-step form functionality
        this.setupMultiStepForm();
        
        // Touch experience improvement
        document.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    }

    handleHeaderScroll() {
        const header = document.querySelector('header');
        header.classList.toggle('scrolled', window.scrollY > 100);
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const nav = document.querySelector('nav');
        const navLinks = document.querySelectorAll('nav a');

        if (!mobileMenuBtn || !nav) return;

        // Toggle mobile menu
        mobileMenuBtn.addEventListener('click', () => {
            const isActive = nav.classList.toggle('active');
            this.toggleMenuIcon(mobileMenuBtn, isActive);
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                this.toggleMenuIcon(mobileMenuBtn, false);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!event.target.closest('nav') && !event.target.closest('.mobile-menu-btn')) {
                nav.classList.remove('active');
                this.toggleMenuIcon(mobileMenuBtn, false);
            }
        });
    }

    toggleMenuIcon(menuBtn, isActive) {
        const icon = menuBtn.querySelector('i');
        if (!icon) return;

        if (isActive) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    }

    setupMultiStepForm() {
        const formSteps = document.querySelectorAll('.form-step');
        const progressSteps = document.querySelectorAll('.progress-step');
        const nextButtons = document.querySelectorAll('.next-step');
        const prevButtons = document.querySelectorAll('.prev-step');

        if (formSteps.length === 0) return;

        // Next button event listeners
        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (this.validateCurrentStep() && this.currentStep < formSteps.length - 1) {
                    this.currentStep++;
                    this.updateFormStep(formSteps, progressSteps);
                }
            });
        });

        // Previous button event listeners
        prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (this.currentStep > 0) {
                    this.currentStep--;
                    this.updateFormStep(formSteps, progressSteps);
                }
            });
        });

        // Form submission
        const submitButton = document.querySelector('.form-step:last-child .btn-primary');
        if (submitButton) {
            submitButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });
        }
    }

    validateCurrentStep() {
        const currentFormStep = document.querySelector('.form-step.active');
        const requiredFields = currentFormStep.querySelectorAll('[required]');
        
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                this.showFieldError(field, 'This field is required');
            } else {
                this.clearFieldError(field);
            }
        });

        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        field.style.borderColor = '#e74c3c';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '5px';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    updateFormStep(formSteps, progressSteps) {
        // Update form steps visibility
        formSteps.forEach((step, index) => {
            step.classList.toggle('active', index === this.currentStep);
        });

        // Update progress steps
        progressSteps.forEach((step, index) => {
            step.classList.toggle('active', index <= this.currentStep);
        });

        // Smooth scroll to form
        const formContainer = document.querySelector('.form-container');
        if (formContainer) {
            formContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }

    handleFormSubmission() {
        if (this.validateCurrentStep()) {
            // Show success message
            const formContainer = document.querySelector('.form-container');
            if (formContainer) {
                formContainer.innerHTML = `
                    <div class="success-message" style="text-align: center; padding: 40px;">
                        <i class="fas fa-check-circle" style="font-size: 3rem; color: #27ae60; margin-bottom: 20px;"></i>
                        <h3 style="color: #333; margin-bottom: 15px;">Viewing Scheduled Successfully!</h3>
                        <p style="color: #666;">Our luxury property specialist will contact you shortly to confirm your appointment.</p>
                    </div>
                `;
            }
        }
    }

    initializeCarousel() {
        const carouselItems = document.querySelectorAll('.carousel-item');
        const prevButton = document.querySelector('.carousel-nav.prev');
        const nextButton = document.querySelector('.carousel-nav.next');
        const dotsContainer = document.querySelector('.carousel-dots');

        if (carouselItems.length === 0) return;

        // Create navigation dots
        carouselItems.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        this.dots = document.querySelectorAll('.dot');

        // Event listeners for navigation buttons
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                this.showPrevSlide();
                this.resetAutoSlide();
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                this.showNextSlide();
                this.resetAutoSlide();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.showPrevSlide();
                this.resetAutoSlide();
            } else if (e.key === 'ArrowRight') {
                this.showNextSlide();
                this.resetAutoSlide();
            }
        });

        // Start auto-slide
        this.startAutoSlide();
    }

    goToSlide(index) {
        const carouselItems = document.querySelectorAll('.carousel-item');
        
        // Reset classes
        carouselItems.forEach(item => item.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));

        // Set new active slide/dot
        carouselItems[index].classList.add('active');
        this.dots[index].classList.add('active');
        this.carouselIndex = index;
    }

    showNextSlide() {
        const carouselItems = document.querySelectorAll('.carousel-item');
        const newIndex = (this.carouselIndex + 1) % carouselItems.length;
        this.goToSlide(newIndex);
    }

    showPrevSlide() {
        const carouselItems = document.querySelectorAll('.carousel-item');
        const newIndex = (this.carouselIndex - 1 + carouselItems.length) % carouselItems.length;
        this.goToSlide(newIndex);
    }

    startAutoSlide() {
        this.carouselInterval = setInterval(() => {
            this.showNextSlide();
        }, 3000);
    }

    resetAutoSlide() {
        if (this.carouselInterval) {
            clearInterval(this.carouselInterval);
            this.startAutoSlide();
        }
    }

    handleTouchStart() {
        // Touch event handler for better mobile experience
    }

    // Cleanup method for potential future use
    destroy() {
        if (this.carouselInterval) {
            clearInterval(this.carouselInterval);
        }
        // Remove event listeners if needed
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LuxPropertiesApp();
});

// Header scroll effect (standalone for immediate execution)
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        header.classList.toggle('scrolled', window.scrollY > 100);
    }
});