// Law Firm Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all components safely
    try { initTypewriter(); } catch (e) { console.warn('Typewriter failed to initialize:', e); }
    try { initScrollAnimations(); } catch (e) { console.warn('Scroll animations failed to initialize:', e); }
    try { initNavigation(); } catch (e) { console.warn('Navigation failed to initialize:', e); }
    try { initContactForm(); } catch (e) { console.warn('Contact form failed to initialize:', e); }
    try { initStatsCounters(); } catch (e) { console.warn('Stats counters failed to initialize:', e); }
    try { initMobileMenu(); } catch (e) { console.warn('Mobile menu failed to initialize:', e); }
    try { initLangDropdown(); } catch (e) { console.warn('Language dropdown failed to initialize:', e); }
    
    let typedInstance = null;
    
    // Typewriter effect for hero section
    function initTypewriter() {
        const currentLang = document.documentElement.lang || 'en';
        
        let taglines = [
            'Excellence in Law',
            'Trusted Legal Partners',
            'Your Success, Our Mission'
        ];
        
        if (currentLang === 'ar') {
            taglines = [
                'التميز في القانون',
                'شركاء قانونيون موثوقون',
                'نجاحكم غايتنا'
            ];
        } else if (currentLang === 'de') {
            taglines = [
                'Exzellenz im Recht',
                'Vertrauenswürdige Rechtspartner',
                'Ihr Erfolg ist unsere Mission'
            ];
        }
        
        const targetElement = document.querySelector('#typed-text');
        if (!targetElement) return;
        
        typedInstance = new Typed('#typed-text', {
            strings: taglines,
            typeSpeed: 80,
            backSpeed: 50,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
    
    // Scroll animations for sections
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);
        
        // Observe all sections with reveal animation
        document.querySelectorAll('.section-reveal').forEach(el => {
            observer.observe(el);
        });
        
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed header
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Navigation active state management
    function initNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        function updateActiveNav() {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
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
        
        const debouncedUpdateActiveNav = debounce(updateActiveNav, 100);
        window.addEventListener('scroll', debouncedUpdateActiveNav);
        updateActiveNav(); // Initial call
    }
    
    // Contact form handling
    function initContactForm() {
        const form = document.getElementById('contact-form');
        const successMessage = document.getElementById('form-success');
        const errorMessage = document.getElementById('form-error');
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateForm(data)) {
                // Simulate form submission
                submitForm(data);
            }
        });
        
        function validateForm(data) {
            let isValid = true;
            const requiredFields = ['firstName', 'lastName', 'email', 'practiceArea', 'message'];
            
            requiredFields.forEach(field => {
                const input = document.getElementById(field === 'firstName' ? 'first-name' : 
                                                    field === 'lastName' ? 'last-name' : 
                                                    field === 'practiceArea' ? 'practice-area' : field);
                if (!data[field] || data[field].trim() === '') {
                    input.classList.add('border-red-500');
                    isValid = false;
                } else {
                    input.classList.remove('border-red-500');
                }
            });
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (data.email && !emailRegex.test(data.email)) {
                document.getElementById('email').classList.add('border-red-500');
                isValid = false;
            }
            
            return isValid;
        }
        
        function submitForm(data) {
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            const currentLang = document.documentElement.lang || 'en';
            
            let sendingText = 'Sending...';
            if (currentLang === 'ar') {
                sendingText = 'جاري الإرسال...';
            } else if (currentLang === 'de') {
                sendingText = 'Wird gesendet...';
            }
            
            submitBtn.textContent = sendingText;
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Reset form
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Show success message
                successMessage.classList.remove('hidden');
                errorMessage.classList.add('hidden');
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.classList.add('hidden');
                }, 5000);
                
                // Animate success message
                anime({
                    targets: successMessage,
                    scale: [0.8, 1],
                    opacity: [0, 1],
                    duration: 500,
                    easing: 'easeOutBack'
                });
                
            }, 1500);
        }
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && (!this.value || this.value.trim() === '')) {
                    this.classList.add('border-red-500');
                } else {
                    this.classList.remove('border-red-500');
                }
            });
        });
    }
    
    // Animated counters for statistics
    function initStatsCounters() {
        const counters = document.querySelectorAll('.stats-counter');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    animateCounter(counter, target);
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
        
        function animateCounter(element, target) {
            let current = 0;
            const increment = target / 100;
            const duration = 2000; // 2 seconds
            const stepTime = duration / 100;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current);
            }, stepTime);
        }
    }
    
    // Mobile menu functionality
    function initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('open');
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('open');
            }
        });
    }
    
    // Service cards hover animations
    function initServiceCards() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                anime({
                    targets: this,
                    scale: 1.02,
                    rotateX: 5,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });
            
            card.addEventListener('mouseleave', function() {
                anime({
                    targets: this,
                    scale: 1,
                    rotateX: 0,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });
        });
    }
    
    // Team member card animations
    function initTeamCards() {
        const teamCards = document.querySelectorAll('.team-card');
        
        teamCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const overlay = this.querySelector('.team-overlay');
                anime({
                    targets: overlay,
                    translateY: 0,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });
            
            card.addEventListener('mouseleave', function() {
                const overlay = this.querySelector('.team-overlay');
                anime({
                    targets: overlay,
                    translateY: '100%',
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });
        });
    }
    
    // Parallax effect for hero background
    function initParallax() {
        const hero = document.querySelector('.hero-bg');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (hero) {
                hero.style.transform = `translateY(${rate}px)`;
            }
        });
    }
    
    // Initialize additional animations safely
    try { initServiceCards(); } catch (e) { console.warn('Service cards failed to initialize:', e); }
    try { initTeamCards(); } catch (e) { console.warn('Team cards failed to initialize:', e); }
    try { initParallax(); } catch (e) { console.warn('Parallax failed to initialize:', e); }
    
    // Smooth page load animation
    anime({
        targets: 'body',
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutQuad'
    });
    
    // Add loading animation completion
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // Utility function for smooth animations
    function smoothReveal(elements, delay = 100) {
        elements.forEach((element, index) => {
            anime({
                targets: element,
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 800,
                delay: index * delay,
                easing: 'easeOutQuad'
            });
        });
    }
    
    // Scroll to top functionality
    function initScrollToTop() {
        const scrollBtn = document.createElement('button');
        scrollBtn.innerHTML = '↑';
        scrollBtn.className = 'fixed bottom-8 right-8 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg opacity-0 transition-opacity duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
        scrollBtn.style.zIndex = '1000';
        document.body.appendChild(scrollBtn);
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollBtn.style.opacity = '1';
            } else {
                scrollBtn.style.opacity = '0';
            }
        });
        
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    initScrollToTop();
    
    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Apply debouncing to scroll-heavy functions
    // debouncedUpdateActiveNav is now initialized and added to window scroll listener in initNavigation to prevent reference scope errors.
    
    // Error handling for missing elements
    function safeQuerySelector(selector, callback) {
        const element = document.querySelector(selector);
        if (element && callback) {
            callback(element);
        }
        return element;
    }
    
    // Initialize tooltips or other UI enhancements
    function initUIEnhancements() {
        // Add subtle animations to form inputs
        const formInputs = document.querySelectorAll('.form-input');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                anime({
                    targets: this,
                    scale: [1, 1.02],
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });
            
            input.addEventListener('blur', function() {
                anime({
                    targets: this,
                    scale: [1.02, 1],
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });
        });
    }
    
    // Language dropdown toggle
    function initLangDropdown() {
        const langMenuBtn = document.getElementById('lang-menu-btn');
        const langDropdown = document.getElementById('lang-dropdown');
        
        if (langMenuBtn && langDropdown) {
            langMenuBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const isHidden = langDropdown.classList.toggle('hidden');
                langMenuBtn.setAttribute('aria-expanded', !isHidden);
            });
            
            document.addEventListener('click', function(e) {
                if (!langMenuBtn.contains(e.target) && !langDropdown.contains(e.target)) {
                    langDropdown.classList.add('hidden');
                    langMenuBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }
    
    initUIEnhancements();
    
    console.log('Salaheddin Al-khatib website initialized successfully!');
});
