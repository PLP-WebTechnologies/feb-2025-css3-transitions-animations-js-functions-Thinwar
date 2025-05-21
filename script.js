// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme customizer
    initThemeCustomizer();
    // Initialize animations
    initAnimations();
    // Initialize settings
    initSettings();
    // Load saved preferences from localStorage
    loadPreferences();
});

// ==== Theme Customization Functions ====
function initThemeCustomizer() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    // Add click event to each theme button
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            changeTheme(theme);
            
            // Update active button
            themeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function changeTheme(theme) {
    // Remove any existing theme classes
    document.body.classList.remove('theme-blue', 'theme-purple', 'theme-green', 'theme-orange');
    
    // Add the selected theme class
    document.body.classList.add(theme);
    
    // Apply a subtle animation to show theme change
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0.8';
            setTimeout(() => {
                card.style.opacity = '1';
            }, 300);
        }, index * 100);
    });
    
    // Store the theme preference
    storePreference('theme', theme);
}

// ==== Animation Functions ====
function initAnimations() {
    const animatedBox = document.getElementById('animated-box');
    const bounceBtn = document.getElementById('bounce-btn');
    const rotateBtn = document.getElementById('rotate-btn');
    const pulseBtn = document.getElementById('pulse-btn');
    const shakeBtn = document.getElementById('shake-btn');
    const autoAnimation = document.getElementById('auto-animation');
    
    let animationInterval;
    
    // Click animation for animated box
    animatedBox.addEventListener('click', function() {
        playAnimation(this, 'bounce');
    });
    
    // Hover animation
    animatedBox.addEventListener('mouseenter', function() {
        if (!this.classList.contains('bounce') && 
            !this.classList.contains('rotate') && 
            !this.classList.contains('pulse') && 
            !this.classList.contains('shake')) {
            this.style.transform = 'scale(1.1)';
        }
    });
    
    animatedBox.addEventListener('mouseleave', function() {
        if (!this.classList.contains('bounce') && 
            !this.classList.contains('rotate') && 
            !this.classList.contains('pulse') && 
            !this.classList.contains('shake')) {
            this.style.transform = 'scale(1)';
        }
    });
    
    // Animation buttons
    bounceBtn.addEventListener('click', function() {
        playAnimation(animatedBox, 'bounce');
    });
    
    rotateBtn.addEventListener('click', function() {
        playAnimation(animatedBox, 'rotate');
    });
    
    pulseBtn.addEventListener('click', function() {
        playAnimation(animatedBox, 'pulse');
    });
    
    shakeBtn.addEventListener('click', function() {
        playAnimation(animatedBox, 'shake');
    });
    
    // Auto animation toggle
    autoAnimation.addEventListener('change', function() {
        if (this.checked) {
            // Start automatic animation cycle
            let animations = ['bounce', 'rotate', 'pulse', 'shake'];
            let currentAnimation = 0;
            
            // Play first animation immediately
            playAnimation(animatedBox, animations[currentAnimation]);
            
            // Setup interval for animation cycle
            animationInterval = setInterval(() => {
                currentAnimation = (currentAnimation + 1) % animations.length;
                playAnimation(animatedBox, animations[currentAnimation]);
            }, getAnimationDuration() * 1000);
            
            // Store preference
            storePreference('autoAnimate', true);
        } else {
            // Stop automatic animation
            clearInterval(animationInterval);
            
            // Remove all animations
            animatedBox.classList.remove('bounce', 'rotate', 'pulse', 'shake');
            
            // Store preference
            storePreference('autoAnimate', false);
        }
    });
}

function playAnimation(element, animationName) {
    // Remove any existing animations
    element.classList.remove('bounce', 'rotate', 'pulse', 'shake');
    
    // Force a reflow to ensure the animation runs again
    void element.offsetWidth;
    
    // Add the new animation class
    element.classList.add(animationName);
    
    // Remove the animation class after it completes (only for non-infinite animations)
    if (animationName !== 'pulse') {
        const duration = getAnimationDuration() * 1000;
        setTimeout(() => {
            element.classList.remove(animationName);
        }, duration);
    }
}

function getAnimationDuration() {
    // Get the current animation speed from the range input
    const speedValue = document.getElementById('animation-speed').value;
    return parseFloat(speedValue);
}

// ==== Settings Functions ====
function initSettings() {
    const speedSlider = document.getElementById('animation-speed');
    const speedValue = document.getElementById('speed-value');
    const sizeSlider = document.getElementById('animation-size');
    const sizeValue = document.getElementById('size-value');
    const roundedToggle = document.getElementById('rounded-corners');
    const shadowToggle = document.getElementById('show-shadow');
    const saveBtn = document.getElementById('save-btn');
    const resetBtn = document.getElementById('reset-btn');
    const animatedBox = document.getElementById('animated-box');
    
    // Animation speed slider
    speedSlider.addEventListener('input', function() {
        const speed = this.value;
        speedValue.textContent = speed + 'x';
        
        // Update CSS variable for animation speed
        document.documentElement.style.setProperty('--animation-speed', speed + 's');
        
        // Store preference
        storePreference('animationSpeed', speed);
    });
    
    // Size slider
    sizeSlider.addEventListener('input', function() {
        const size = this.value;
        sizeValue.textContent = size + 'px';
        
        // Update element size
        animatedBox.style.width = size + 'px';
        animatedBox.style.height = size + 'px';
        
        // Store preference
        storePreference('elementSize', size);
    });
    
    // Rounded corners toggle
    roundedToggle.addEventListener('change', function() {
        if (this.checked) {
            animatedBox.classList.add('rounded');
        } else {
            animatedBox.classList.remove('rounded');
        }
        
        // Store preference
        storePreference('roundedCorners', this.checked);
    });
    
    // Shadow toggle
    shadowToggle.addEventListener('change', function() {
        if (this.checked) {
            animatedBox.classList.add('shadow');
        } else {
            animatedBox.classList.remove('shadow');
        }
        
        // Store preference
        storePreference('showShadow', this.checked);
    });
    
    // Save button
    saveBtn.addEventListener('click', function() {
        saveAllPreferences();
        showStatusMessage('Preferences saved successfully!', 'success');
    });
    
    // Reset button
    resetBtn.addEventListener('click', function() {
        resetToDefaults();
        showStatusMessage('Reset to default settings', 'success');
    });
}

// ==== LocalStorage Functions ====
function storePreference(key, value) {
    // Store temporary preference in memory (will be saved when clicking "Save")
    window.temporaryPreferences = window.temporaryPreferences || {};
    window.temporaryPreferences[key] = value;
    
    // For immediate settings that need to be applied right away (convenience)
    if (['autoAnimate', 'animationSpeed', 'elementSize', 'roundedCorners', 'showShadow'].includes(key)) {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

function saveAllPreferences() {
    // Save all temporary preferences to localStorage
    if (window.temporaryPreferences) {
        for (const key in window.temporaryPreferences) {
            localStorage.setItem(key, JSON.stringify(window.temporaryPreferences[key]));
        }
        
        // Create a subtle "save" animation
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 300);
            }, index * 100);
        });
    }
}

function loadPreferences() {
    // Create a temporary preferences object
    window.temporaryPreferences = {};
    
    // Theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        const theme = JSON.parse(savedTheme);
        changeTheme(theme);
        
        // Update active button
        const themeBtn = document.querySelector(`.theme-btn[data-theme="${theme}"]`);
        if (themeBtn) {
            themeBtn.classList.add('active');
        }
    } else {
        // Set default theme
        document.querySelector('.theme-btn[data-theme="theme-blue"]').classList.add('active');
    }
    
    // Animation Speed
    const savedSpeed = localStorage.getItem('animationSpeed');
    if (savedSpeed) {
        const speed = JSON.parse(savedSpeed);
        const speedSlider = document.getElementById('animation-speed');
        const speedValue = document.getElementById('speed-value');
        
        speedSlider.value = speed;
        speedValue.textContent = speed + 'x';
        document.documentElement.style.setProperty('--animation-speed', speed + 's');
    }
    
    // Element Size
    const savedSize = localStorage.getItem('elementSize');
    if (savedSize) {
        const size = JSON.parse(savedSize);
        const sizeSlider = document.getElementById('animation-size');
        const sizeValue = document.getElementById('size-value');
        const animatedBox = document.getElementById('animated-box');
        
        sizeSlider.value = size;
        sizeValue.textContent = size + 'px';
        animatedBox.style.width = size + 'px';
        animatedBox.style.height = size + 'px';
    }
    
    // Rounded Corners
    const savedRounded = localStorage.getItem('roundedCorners');
    if (savedRounded) {
        const rounded = JSON.parse(savedRounded);
        const roundedToggle = document.getElementById('rounded-corners');
        const animatedBox = document.getElementById('animated-box');
        
        roundedToggle.checked = rounded;
        if (rounded) {
            animatedBox.classList.add('rounded');
        }
    }
    
    // Show Shadow
    const savedShadow = localStorage.getItem('showShadow');
    if (savedShadow) {
        const shadow = JSON.parse(savedShadow);
        const shadowToggle = document.getElementById('show-shadow');
        const animatedBox = document.getElementById('animated-box');
        
        shadowToggle.checked = shadow;
        if (shadow) {
            animatedBox.classList.add('shadow');
        }
    }
    
    // Auto Animate
    const savedAutoAnimate = localStorage.getItem('autoAnimate');
    if (savedAutoAnimate) {
        const autoAnimate = JSON.parse(savedAutoAnimate);
        const autoToggle = document.getElementById('auto-animation');
        
        autoToggle.checked = autoAnimate;
        if (autoAnimate) {
            // Trigger the change event to start the animation
            autoToggle.dispatchEvent(new Event('change'));
        }
    }
    
    // Show a welcome animation
    setTimeout(() => {
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0.8';
                card.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = '';
                }, 300);
            }, index * 150);
        });
    }, 500);
}

function resetToDefaults() {
    // Clear all localStorage items
    localStorage.removeItem('theme');
    localStorage.removeItem('animationSpeed');
    localStorage.removeItem('elementSize');
    localStorage.removeItem('roundedCorners');
    localStorage.removeItem('showShadow');
    localStorage.removeItem('autoAnimate');
    
    // Reset temporary preferences
    window.temporaryPreferences = {};
    
    // Reset theme
    document.body.classList.remove('theme-blue', 'theme-purple', 'theme-green', 'theme-orange');
    document.body.classList.add('theme-blue');
    
    // Reset active theme button
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('.theme-btn[data-theme="theme-blue"]').classList.add('active');
    
    // Reset animation speed
    const speedSlider = document.getElementById('animation-speed');
    const speedValue = document.getElementById('speed-value');
    speedSlider.value = 1;
    speedValue.textContent = '1x';
    document.documentElement.style.setProperty('--animation-speed', '1s');
    
    // Reset element size
    const sizeSlider = document.getElementById('animation-size');
    const sizeValue = document.getElementById('size-value');
    const animatedBox = document.getElementById('animated-box');
    sizeSlider.value = 150;