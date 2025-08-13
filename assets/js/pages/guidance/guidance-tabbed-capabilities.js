
document.addEventListener('DOMContentLoaded', function() {
    // Capabilities section pill selector functionality
    const selectorPills = document.querySelectorAll('.selector-pill');
    const capabilityPanels = document.querySelectorAll('.capabilities-panel');
    selectorPills.forEach((pill) => {
        pill.addEventListener('click', () => {
            const targetTab = pill.getAttribute('data-tab');
            
            // Remove active class from all pills and panels
            selectorPills.forEach((p) => p.classList.remove('active'));
            capabilityPanels.forEach((panel) => panel.classList.remove('active'));
            
            // Add active class to clicked pill and corresponding panel
            pill.classList.add('active');
            const targetPanel = document.querySelector(`[data-panel="${targetTab}"]`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // Add keyboard navigation support for accessibility
    selectorPills.forEach((pill, index) => {
        pill.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                const direction = e.key === 'ArrowLeft' ? -1 : 1;
                const nextIndex = (index + direction + selectorPills.length) % selectorPills.length;
                selectorPills[nextIndex].click();
                selectorPills[nextIndex].focus();
            }
        });
    });
});