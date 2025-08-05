
// SVG Typing Animation
document.addEventListener('DOMContentLoaded', function() {
    // Multi-line GitHub typing animation
    const githubTypingContainer = document.querySelector('.github-integration-svg');
    if (githubTypingContainer) {
        const lines = [
            { element: githubTypingContainer.querySelector('.typing-text'), text: "/augury_one request review 'Can you review how we" },
            { element: githubTypingContainer.querySelector('.typing-text-line2'), text: 'implemented authorization for the new money' },
            { element: githubTypingContainer.querySelector('.typing-text-line3'), text: "movement endpoint?'" }
        ];
        
        let currentLineIndex = 0;
        let currentCharIndex = 0;
        let isAnimating = false;
        
        function typeNextChar() {
            if (currentLineIndex >= lines.length) {
                // Animation complete, reset after delay
                setTimeout(function() {
                    lines.forEach(line => {
                        if (line.element) line.element.textContent = '';
                    });
                    currentLineIndex = 0;
                    currentCharIndex = 0;
                    isAnimating = false; // Reset animation flag
                    setTimeout(startTyping, 1000);
                }, 3000);
                return;
            }
            
            const currentLine = lines[currentLineIndex];
            const currentText = currentLine.text;
            
            if (currentCharIndex < currentText.length) {
                // Type next character
                if (currentLine.element) {
                    currentLine.element.textContent = currentText.substring(0, currentCharIndex + 1);
                }
                currentCharIndex++;
                setTimeout(typeNextChar, 50);
            } else {
                // Move to next line
                currentLineIndex++;
                currentCharIndex = 0;
                setTimeout(typeNextChar, 100); // Small pause between lines
            }
        }
        
        function startTyping() {
            if (!isAnimating) {
                isAnimating = true;
                typeNextChar();
            }
        }
        
        // Start typing animation when element comes into view
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    setTimeout(startTyping, 500);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(githubTypingContainer);
    }
    
    // Handle other typing animations (if any)
    const otherTypingElements = document.querySelectorAll('.typing-text:not(.github-integration-svg .typing-text)');
    otherTypingElements.forEach(function(element) {
        const text = element.getAttribute('data-text');
        if (text) {
            let currentText = '';
            let currentIndex = 0;
            
            function typeWriter() {
                if (currentIndex < text.length) {
                    currentText += text.charAt(currentIndex);
                    element.textContent = currentText;
                    currentIndex++;
                    setTimeout(typeWriter, 50);
                } else {
                    // Reset after completion
                    setTimeout(function() {
                        currentText = '';
                        currentIndex = 0;
                        element.textContent = '';
                        setTimeout(typeWriter, 1000);
                    }, 3000);
                }
            }
            
            // Start typing animation when element comes into view
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        setTimeout(typeWriter, 500);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(element);
        }
    });
    
    // Position cursor next to typed text
    function updateCursor() {
        const cursor = document.querySelector('.cursor-blink');
        if (cursor) {
            // For GitHub integration, position cursor at end of last visible line
            const githubSvg = document.querySelector('.github-integration-svg');
            if (githubSvg) {
                const lines = [
                    githubSvg.querySelector('.typing-text'),
                    githubSvg.querySelector('.typing-text-line2'),
                    githubSvg.querySelector('.typing-text-line3')
                ];
                
                // Find the last line with content
                let lastLineWithContent = null;
                let lastLineIndex = -1;
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i] && lines[i].textContent.trim() !== '') {
                        lastLineWithContent = lines[i];
                        lastLineIndex = i;
                    }
                }
                
                if (lastLineWithContent) {
                    try {
                        const bbox = lastLineWithContent.getBBox();
                        cursor.setAttribute('x', 100 + bbox.width);
                        cursor.setAttribute('y', 125 + (lastLineIndex * 16)); // Adjust y position based on line
                    } catch (e) {
                        // Fallback positioning
                        cursor.setAttribute('x', 100);
                        cursor.setAttribute('y', 125);
                    }
                }
            }
        }
    }
    
    // Update cursor position periodically
    setInterval(updateCursor, 100);
});