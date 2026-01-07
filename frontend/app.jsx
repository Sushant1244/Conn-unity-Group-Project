// Conn-Unity Landing Page JavaScript

// Animate statistics counter
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
}

// Animate percentage counter
function animatePercentage(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target, true);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(current, true);
        }
    }, 16);
}

// Format number with K+ suffix or percentage
function formatNumber(num, isPercentage = false) {
    if (isPercentage) {
        return num.toFixed(2) + '%';
    }
    if (num >= 1000) {
        const formatted = (num / 1000).toFixed(num >= 100000 ? 0 : 1);
        return formatted + 'K+';
    }
    return num.toString();
}

// Initialize counter animations when page loads
document.addEventListener('DOMContentLoaded', () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Animate each stat counter
    statNumbers.forEach(stat => {
        const target = parseInt(stat.dataset.target);
        const percentage = parseFloat(stat.dataset.percentage);
        
        if (percentage) {
            // Handle percentage animation
            animatePercentage(stat, percentage);
        } else if (target) {
            // Handle regular number animation
            animateCounter(stat, target);
        }
    });
    
    // Add smooth scroll behavior for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add intersection observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe feature cards
document.addEventListener('DOMContentLoaded', () => {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => observer.observe(card));
});

// Add hover effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Add parallax effect to hero decorations
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const decorations = document.querySelectorAll('.hero-decoration');
    
    decorations.forEach((decoration, index) => {
        const speed = 0.5 + (index * 0.2);
        decoration.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Handle CTA button clicks
document.querySelectorAll('.btn-primary').forEach(button => {
    button.addEventListener('click', () => {
        console.log('CTA Button clicked:', button.textContent);
        // Add your sign-up/login logic here
        alert('Welcome to Conn-Unity! Sign-up feature coming soon.');
    });
});

document.querySelectorAll('.btn-secondary').forEach(button => {
    button.addEventListener('click', () => {
        console.log('Secondary Button clicked:', button.textContent);
        // Add your explore/sign-in logic here
        alert('Explore feature coming soon!');
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Mobile menu toggle (if needed in future)
const createMobileMenu = () => {
    const nav = document.querySelector('.nav');
    const menuButton = document.createElement('button');
    menuButton.classList.add('menu-toggle');
    menuButton.innerHTML = '☰';
    menuButton.setAttribute('aria-label', 'Toggle menu');
    
    if (window.innerWidth <= 768) {
        nav.parentElement.insertBefore(menuButton, nav);
        
        menuButton.addEventListener('click', () => {
            nav.classList.toggle('open');
        });
    }
};

// Handle responsive behavior
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Add any resize-specific logic here
        console.log('Window resized');
    }, 250);
});

// Add console greeting
console.log('%c👋 Welcome to Conn-Unity!', 'color: #5549FF; font-size: 24px; font-weight: bold;');
console.log('%cBuilt with ❤️ for meaningful conversations', 'color: #667085; font-size: 14px;');
