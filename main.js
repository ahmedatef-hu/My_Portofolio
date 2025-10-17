// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const skillItems = document.querySelectorAll('.skill-item');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.querySelector('#contact-form');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced scroll effects with blue theme
window.addEventListener('scroll', throttle(() => {
    // Enhanced navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}));

// Active section detection for navigation highlighting
const sections = document.querySelectorAll('section[id]');
const navigationLinks = document.querySelectorAll('.nav-link');

const navObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
};

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id');
            
            // Remove active class from all nav links
            navigationLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to corresponding nav link
            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}, navObserverOptions);

// Observe all sections
sections.forEach(section => {
    navObserver.observe(section);
});

// Set initial active state for home section
document.addEventListener('DOMContentLoaded', () => {
    const homeLink = document.querySelector('.nav-link[href="#home"]');
    if (homeLink) {
        homeLink.classList.add('active');
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
const animateElements = document.querySelectorAll('.info-card, .skill-category, .project-card, .contact-item');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Enhanced creative skill items with multiple animation layers
skillItems.forEach(item => {
    // Add stagger delay for entrance animations
    const index = Array.from(skillItems).indexOf(item);
    item.style.animationDelay = `${index * 0.1}s`;
    
    item.addEventListener('mouseenter', () => {
        const skillName = item.dataset.skill;
        
        // Add continuous glow animation
        item.style.animation = 'skillGlow 2s ease-in-out infinite, skillBounce 1s ease-in-out infinite';
        
        // Create multiple particle effects
        createSkillParticles(item);
        
        // Add shimmer effect to text
        const span = item.querySelector('span');
        if (span) {
            span.style.background = 'linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(59,130,246,1) 50%, rgba(255,255,255,0.8) 100%)';
            span.style.backgroundSize = '200% 100%';
            span.style.webkitBackgroundClip = 'text';
            span.style.webkitTextFillColor = 'transparent';
            span.style.backgroundClip = 'text';
            span.style.animation = 'skillShimmer 1.5s ease-in-out infinite';
        }
        
        // Create floating icons around the skill
        createFloatingIcons(item);
    });
    
    item.addEventListener('mouseleave', () => {
        // Reset animations
        item.style.animation = '';
        
        // Reset text shimmer
        const span = item.querySelector('span');
        if (span) {
            span.style.background = '';
            span.style.webkitBackgroundClip = '';
            span.style.webkitTextFillColor = '';
            span.style.backgroundClip = '';
            span.style.animation = '';
        }
        
        // Clean up floating elements
        const floatingElements = item.querySelectorAll('.floating-particle, .floating-icon');
        floatingElements.forEach(el => el.remove());
    });
    
    // Add touch support for mobile
    item.addEventListener('touchstart', (e) => {
        e.preventDefault();
        item.dispatchEvent(new Event('mouseenter'));
    });
    
    item.addEventListener('touchend', (e) => {
        e.preventDefault();
        setTimeout(() => {
            item.dispatchEvent(new Event('mouseleave'));
        }, 2000); // Auto-hide after 2 seconds on mobile
    });
});

// Project cards creative hover animation
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.classList.add('project-hover-active');
    });
    
    card.addEventListener('mouseleave', () => {
        card.classList.remove('project-hover-active');
    });
});

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    const originalText = heroTitle.textContent;
    
    setTimeout(() => {
        typeWriter(heroTitle, originalText, 80);
    }, 1000);
});

// Parallax effect for floating shapes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        shape.style.transform = `translateY(${yPos}px)`;
    });
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Scroll progress indicator
const scrollProgress = document.createElement('div');
scrollProgress.style.position = 'fixed';
scrollProgress.style.top = '0';
scrollProgress.style.left = '0';
scrollProgress.style.width = '0%';
scrollProgress.style.height = '3px';
scrollProgress.style.background = 'linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd)';
scrollProgress.style.zIndex = '9999';
scrollProgress.style.transition = 'width 0.3s ease';
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.offsetHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
});

// Mouse cursor effect removed as requested

// Enhanced CSS for blue theme effects
const style = document.createElement('style');
style.textContent = `
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(59, 130, 246, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    
    .particle {
        position: fixed;
        width: 4px;
        height: 4px;
        background: radial-gradient(circle, #60a5fa, #3b82f6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        animation: particleFade 1s ease-out forwards;
    }
    
    @keyframes particleFloat {
    0% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
    100% {
        opacity: 0;
        transform: translateY(-30px) scale(0.5);
    }
}

@keyframes particleOrbit {
    0% {
        transform: translate(-50%, -50%) rotate(0deg) translateX(var(--orbit-x, 30px)) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translate(-50%, -50%) rotate(360deg) translateX(var(--orbit-x, 30px)) rotate(-360deg);
        opacity: 0;
    }
}

@keyframes floatAround {
    0%, 100% {
        transform: translateY(0px) rotate(0deg);
        opacity: 0.8;
    }
    25% {
        transform: translateY(-10px) rotate(90deg);
        opacity: 1;
    }
    50% {
        transform: translateY(-5px) rotate(180deg);
        opacity: 0.6;
    }
    75% {
        transform: translateY(-15px) rotate(270deg);
        opacity: 1;
    }
}    
`;
document.head.appendChild(style);

// Loading Screen Functionality
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const progressFill = document.querySelector('.progress-fill');
    const progressPercentage = document.querySelector('.progress-percentage');
    
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        progressFill.style.width = progress + '%';
        progressPercentage.textContent = Math.round(progress) + '%';
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            
            // Wait a moment then fade out loading screen
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                mainContent.classList.add('show');
                
                // Remove loading screen from DOM after animation
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 800);
            }, 500);
        }
    }, 100);
});


// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Enhanced particle effects for skills
function createSkillParticles(element) {
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 6 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = `rgba(${59 + Math.random() * 40}, ${130 + Math.random() * 40}, 246, ${0.6 + Math.random() * 0.4})`;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '10';
        
        const angle = (i / 12) * Math.PI * 2;
        const distance = 30 + Math.random() * 20;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.transform = 'translate(-50%, -50%)';
        
        particle.style.animation = `particleOrbit 2s linear infinite`;
        particle.style.animationDelay = `${i * 0.1}s`;
        
        // Add custom properties for orbit animation
        particle.style.setProperty('--orbit-x', x + 'px');
        particle.style.setProperty('--orbit-y', y + 'px');
        
        element.appendChild(particle);
    }
}

// Create floating icons around skills
function createFloatingIcons(element) {
    const icons = ['✨', '⚡', '🔥', '💎', '⭐'];
    
    for (let i = 0; i < 3; i++) {
        const floatingIcon = document.createElement('div');
        floatingIcon.className = 'floating-icon';
        floatingIcon.textContent = icons[Math.floor(Math.random() * icons.length)];
        floatingIcon.style.position = 'absolute';
        floatingIcon.style.fontSize = '12px';
        floatingIcon.style.pointerEvents = 'none';
        floatingIcon.style.zIndex = '15';
        floatingIcon.style.opacity = '0.8';
        
        const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
        let x, y;
        
        switch(side) {
            case 0: // top
                x = Math.random() * 100;
                y = -20;
                break;
            case 1: // right
                x = 120;
                y = Math.random() * 100;
                break;
            case 2: // bottom
                x = Math.random() * 100;
                y = 120;
                break;
            case 3: // left
                x = -20;
                y = Math.random() * 100;
                break;
        }
        
        floatingIcon.style.left = x + '%';
        floatingIcon.style.top = y + '%';
        floatingIcon.style.animation = `floatAround 3s ease-in-out infinite`;
        floatingIcon.style.animationDelay = `${i * 0.5}s`;
        
        element.appendChild(floatingIcon);
    }
}

// Add floating animation to CSS
const floatingStyle = document.createElement('style');
floatingStyle.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 0.6;
        }
        90% {
            opacity: 0.6;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(floatingStyle);

// Create floating elements periodically
setInterval(createFloatingElements, 3000);

// Initial floating elements
createFloatingElements();