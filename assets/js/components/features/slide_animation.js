document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '0px 0px 100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Add a slight delay based on position for stagger effect
                const delay = Array.from(entry.target.parentElement.children).indexOf(entry.target) * 50;
                
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, delay);
                
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all scroll-animate elements
    const animateElements = document.querySelectorAll('.scroll-animate');
    animateElements.forEach((element) => {
        observer.observe(element);
    });
    
    // Handle reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        animateElements.forEach((element) => {
            element.style.transition = 'opacity 0.2s ease';
            element.style.transform = 'none';
        });
    }

    // Tab functionality for capabilities section
    const selectorPills = document.querySelectorAll('.tab-item');
    const capabilityPanels = document.querySelectorAll('.capabilities-panel');
    
    selectorPills.forEach(pill => {
        pill.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all pills
            selectorPills.forEach(p => p.classList.remove('active'));
            // Add active class to clicked pill
            this.classList.add('active');
            
            // Hide all panels
            capabilityPanels.forEach(panel => panel.classList.remove('active'));
            // Show target panel
            const targetPanel = document.querySelector(`[data-panel="${targetTab}"]`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
});