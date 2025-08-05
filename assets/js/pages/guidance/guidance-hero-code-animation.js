// Intelligent code snippet queuing system - only one snippet per row at a time
document.addEventListener('DOMContentLoaded', function() {
    // Define snippet groups for each row
    const snippetRows = {
        1: [
            document.querySelector('.row-1-snippet-1'),
            document.querySelector('.row-1-snippet-2')
        ],
        2: [
            document.querySelector('.row-2-snippet-1'),
            document.querySelector('.row-2-snippet-2')
        ],
        3: [
            document.querySelector('.row-3-snippet-1'),
            document.querySelector('.row-3-snippet-2')
        ]
    };

    // Track current snippet index for each row
    const currentIndex = { 1: 0, 2: 0, 3: 0 };

    // Continuous animation system - always visible code
    function startContinuousAnimation(rowNum) {
        const snippets = snippetRows[rowNum];
        if (!snippets || snippets.length === 0) return;
        
        function animateNextSnippet() {
            const snippet = snippets[currentIndex[rowNum]];
            if (!snippet) return;
            
            // Show and start animation
            snippet.style.display = 'block';
            snippet.style.opacity = '0.6';
            
            // Get animation direction and duration
            const direction = snippet.getAttribute('data-direction');
            const isMobile = window.innerWidth <= 768;
            let animationDuration;
            
            if (direction === 'left-to-right') {
                snippet.style.transform = 'translateX(-100vw)';
                animationDuration = isMobile ? 35000 : 30000;
                snippet.style.animation = isMobile ? 
                    'scrollLeftToRight 35s linear' : 
                    'scrollLeftToRight 30s linear';
            } else {
                snippet.style.transform = 'translateX(100vw)';
                animationDuration = isMobile ? 40000 : 35000;
                snippet.style.animation = isMobile ? 
                    'scrollRightToLeft 40s linear' : 
                    'scrollRightToLeft 35s linear';
            }
            
            // Schedule next snippet to start when current is 80% complete (overlapping)
            const overlapTime = animationDuration * 0.8; // Start next when 80% done
            setTimeout(() => {
                // Move to next snippet for the next cycle
                currentIndex[rowNum] = (currentIndex[rowNum] + 1) % snippets.length;
                animateNextSnippet(); // Start next snippet
            }, overlapTime);
            
            // Clean up current snippet when it's fully done
            setTimeout(() => {
                snippet.style.display = 'none';
                snippet.style.animation = '';
                snippet.style.transform = '';
                snippet.style.opacity = '0';
            }, animationDuration + 100);
        }
        
        // Start the continuous cycle
        animateNextSnippet();
    }

    // Initialize continuous animations immediately with minimal stagger
    setTimeout(() => startContinuousAnimation(1), 0);     // Row 1: immediate
    setTimeout(() => startContinuousAnimation(2), 100);   // Row 2: 0.1 seconds  
    setTimeout(() => startContinuousAnimation(3), 200);   // Row 3: 0.2 seconds

    // Smooth scroll functionality for the "See More" button
    const seeMoreButton = document.querySelector('.guidance-see-more .btn-see-more');
    
    if (seeMoreButton) {
        seeMoreButton.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector('#guidance');
            if (target) {
                // Calculate navbar height with some extra padding
                const navbar = document.querySelector('.navbar-fixed-top');
                let navbarHeight = 0;
                if (navbar) {
                    navbarHeight = navbar.offsetHeight;
                }
                
                // Add extra offset to ensure title is clearly visible
                const extraOffset = 20;
                
                // Get target position and subtract navbar height plus extra offset
                const targetPosition = target.offsetTop - navbarHeight - extraOffset;
                
                // Smooth scroll to the adjusted position
                window.scrollTo({
                    top: Math.max(0, targetPosition), // Ensure we don't scroll to negative position
                    behavior: 'smooth'
                });
            }
        });
    }
});