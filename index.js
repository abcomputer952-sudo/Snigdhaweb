// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollEffects();
    initSkillBars();
    initContactForm();
    initScrollReveal();
    initThemeToggle(); // Bonus feature
});

// Navigation Toggle for Mobile
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navToggle.contains(event.target) || navMenu.contains(event.target);
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

// Scroll Effects
function initScrollEffects() {
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // Active navigation link highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNavLink() {
        let current = '';
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animated Skill Bars
function initSkillBars() {
    const skillProgressElements = document.querySelectorAll('.skill-progress');
    
    function animateSkillBars() {
        skillProgressElements.forEach(progress => {
            const width = progress.getAttribute('data-width');
            const isInViewport = isElementInViewport(progress);
            
            if (isInViewport && !progress.classList.contains('animated')) {
                progress.style.width = width + '%';
                progress.classList.add('animated');
            }
        });
    }
    
    // Check on load and scroll
    animateSkillBars();
    window.addEventListener('scroll', animateSkillBars);
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = Object.fromEntries(formData);
            
            // Simple validation
            if (validateForm(formObject)) {
                // Simulate form submission
                simulateFormSubmission(contactForm, formObject);
            }
        });
        
        // Real-time validation
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

// Form Validation
function validateForm(formData) {
    let isValid = true;
    
    // Name validation
    if (!formData.name.trim()) {
        showFieldError('name', 'Name is required');
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
        showFieldError('email', 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(formData.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Subject validation
    if (!formData.subject.trim()) {
        showFieldError('subject', 'Subject is required');
        isValid = false;
    }
    
    // Message validation
    if (!formData.message.trim()) {
        showFieldError('message', 'Message is required');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    if (!value) {
        showFieldError(fieldName, 'This field is required');
        return false;
    }
    
    if (fieldName === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(fieldName, 'Please enter a valid email address');
            return false;
        }
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const formGroup = field.closest('.form-group');
    
    // Remove existing error
    const existingError = formGroup.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#ff6584';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '5px';
    
    formGroup.appendChild(errorElement);
    field.style.borderColor = '#ff6584';
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    const existingError = formGroup.querySelector('.field-error');
    
    if (existingError) {
        existingError.remove();
    }
    
    field.style.borderColor = '#e9ecef';
}

// Simulate Form Submission
function simulateFormSubmission(form, formData) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        
        // Reset form
        form.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // In a real application, you would send the data to your backend here
        console.log('Form submitted with data:', formData);
        
    }, 2000);
}

// Notification System
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '5px';
    notification.style.color = 'white';
    notification.style.fontWeight = '500';
    notification.style.zIndex = '10000';
    notification.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'transform 0.3s ease';
    
    if (type === 'success') {
        notification.style.backgroundColor = '#4CAF50';
    } else {
        notification.style.backgroundColor = '#ff6584';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Scroll Reveal Animations
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.skill-category, .project-card, .about-content, .contact-content');
    
    function checkReveal() {
        revealElements.forEach(element => {
            if (isElementInViewport(element)) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Set initial state
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Check on load and scroll
    checkReveal();
    window.addEventListener('scroll', checkReveal);
}

// Utility Functions
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 &&
        rect.bottom >= 0
    );
}

// Bonus: Theme Toggle (Dark/Light Mode)
function initThemeToggle() {
    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    
    // Style the theme toggle
    themeToggle.style.position = 'fixed';
    themeToggle.style.bottom = '20px';
    themeToggle.style.left = '20px';
    themeToggle.style.width = '50px';
    themeToggle.style.height = '50px';
    themeToggle.style.borderRadius = '50%';
    themeToggle.style.backgroundColor = 'var(--primary-color)';
    themeToggle.style.color = 'white';
    themeToggle.style.border = 'none';
    themeToggle.style.cursor = 'pointer';
    themeToggle.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
    themeToggle.style.zIndex = '1000';
    themeToggle.style.display = 'flex';
    themeToggle.style.alignItems = 'center';
    themeToggle.style.justifyContent = 'center';
    themeToggle.style.fontSize = '1.2rem';
    themeToggle.style.transition = 'all 0.3s ease';
    
    themeToggle.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    themeToggle.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Toggle theme
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
    });
    
    document.body.appendChild(themeToggle);
    
    // Add dark theme styles
    const darkThemeStyles = `
        .dark-theme {
            --dark-color: #f8f9fa;
            --light-color: #1a1a1a;
            --light-gray: #2d2d2d;
            --white: #2d2d2d;
            --gray-color: #b0b0b0;
            background-color: #1a1a1a;
            color: #f8f9fa;
        }
        
        .dark-theme .navbar {
            background-color: rgba(26, 26, 26, 0.95);
        }
        
        .dark-theme .hero {
            background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
        }
        
        .dark-theme .skill-category,
        .dark-theme .project-card,
        .dark-theme .contact-form {
            background-color: #2d2d2d;
            color: #f8f9fa;
        }
        
        .dark-theme .form-group input,
        .dark-theme .form-group textarea {
            background-color: #1a1a1a;
            border-color: #444;
            color: #f8f9fa;
        }
        
        .dark-theme .footer {
            background-color: #0d0d0d;
        }
        
        .dark-theme .theme-toggle {
            background-color: var(--secondary-color);
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = darkThemeStyles;
    document.head.appendChild(styleSheet);
}

// Typing Effect for Hero Section (Bonus)
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const originalText = heroTitle.innerHTML;
    const nameSpan = heroTitle.querySelector('.highlight');
    
    if (nameSpan) {
        const name = nameSpan.textContent;
        nameSpan.textContent = '';
        
        let i = 0;
        const typingSpeed = 100;
        
        function typeWriter() {
            if (i < name.length) {
                nameSpan.textContent += name.charAt(i);
                i++;
                setTimeout(typeWriter, typingSpeed);
            }
        }
        
    // Start typing after a short delay
    setTimeout(typeWriter, 1000);
    }
}

// Initialize typing effect when DOM is loaded
document.addEventListener('DOMContentLoaded', initTypingEffect);

// Project Filtering (Bonus Feature)
function initProjectFilter() {
    const projects = document.querySelectorAll('.project-card');
    const filterButtons = document.createElement('div');
    filterButtons.className = 'project-filters';
    filterButtons.style.display = 'flex';
    filterButtons.style.justifyContent = 'center';
    filterButtons.style.gap = '1rem';
    filterButtons.style.marginBottom = '2rem';
    filterButtons.style.flexWrap = 'wrap';
    
    const filters = [
        { name: 'All', tech: 'all' },
        { name: 'HTML/CSS', tech: 'html' },
        { name: 'JavaScript', tech: 'javascript' },
        { name: 'React', tech: 'react' }
    ];
    
    filters.forEach(filter => {
        const button = document.createElement('button');
        button.textContent = filter.name;
        button.className = 'filter-btn';
        button.setAttribute('data-filter', filter.tech);
        
        button.style.padding = '8px 16px';
        button.style.border = '2px solid var(--primary-color)';
        button.style.background = 'transparent';
        button.style.color = 'var(--primary-color)';
        button.style.borderRadius = '20px';
        button.style.cursor = 'pointer';
        button.style.transition = 'all 0.3s ease';
        
        button.addEventListener('click', function() {
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.style.background = 'transparent';
                btn.style.color = 'var(--primary-color)';
            });
            
            this.style.background = 'var(--primary-color)';
            this.style.color = 'white';
            
            // Filter projects
            const filterValue = this.getAttribute('data-filter');
            
            projects.forEach(project => {
                if (filterValue === 'all') {
                    project.style.display = 'block';
                } else {
                    const projectTech = project.querySelector('.project-tech').textContent.toLowerCase();
                    if (projectTech.includes(filterValue)) {
                        project.style.display = 'block';
                    } else {
                        project.style.display = 'none';
                    }
                }
            });
        });
        
        filterButtons.appendChild(button);
    });
    
    // Insert filter buttons before projects grid
    const projectsSection = document.querySelector('.projects .container');
    const projectsGrid = document.querySelector('.projects-grid');
    projectsSection.insertBefore(filterButtons, projectsGrid);
    
    // Set first filter as active
    filterButtons.querySelector('.filter-btn').click();
}

// Uncomment the line below if you want to enable project filtering
// document.addEventListener('DOMContentLoaded', initProjectFilter);