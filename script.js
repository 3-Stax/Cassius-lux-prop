// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav a');
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('active');
        // Change icon based on menu state
        const icon = mobileMenuBtn.querySelector('i');
        if (nav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('nav') && !event.target.closest('.mobile-menu-btn')) {
            nav.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Multi-step form functionality
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    let currentStep = 0;

    // Function to update form steps
    function updateFormStep() {
        formSteps.forEach((step, index) => {
            if (index === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        progressSteps.forEach((step, index) => {
            if (index <= currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Scroll to top of form on step change
        document.querySelector('.form-container').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    // Next button event listeners
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (currentStep < formSteps.length - 1) {
                currentStep++;
                updateFormStep();
            }
        });
    });

    // Previous button event listeners
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (currentStep > 0) {
                currentStep--;
                updateFormStep();
            }
        });
    });
    
    // Improve touch experience
    document.addEventListener('touchstart', function() {}, {passive: true});
});