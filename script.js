document.addEventListener('DOMContentLoaded', () => {
    const bubbleContainer = document.getElementById('bubble-container');
    const splashScreen = document.getElementById('splash-screen');
    const mainButton = document.querySelector('.main-button');
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;
    const isMobile = screenWidth <= 768;

    // Define bubble configurations for desktop and mobile
    const navBubbleConfig = {
        desktop: { count: 4, minSize: 120, range: 50 }, // 120px - 170px
        mobile:  { count: 4, minSize: 80,  range: 40 }  // 80px - 120px
    };
    const skillBubbleConfig = {
        desktop: { count: 50, minSize: 80, range: 20 }, // 40px - 80px
        mobile:  { count: 12,  minSize: 30, range: 30 }  // 30px - 60px
    };

    const navBubbles = [
        { text: 'Projects', href: 'projects.html' },
        { text: 'About Me', href: 'about.html' },
        { text: 'My Skills', href: 'skills.html' },
        { text: 'Contact', href: 'contact.html' },
    ];
    const skillBubbles = [
        'AI', 'Cloud', 'Data', 'SEO', 'DevOps', '1011', 'UX/UI', 'λ', '010', 'Wordpress', 'AI Agent', '{}'
    ];

    const allBubbles = [];

    function createBubble(config) {
        const element = document.createElement('a');
        element.className = 'bubble';
        element.textContent = config.text;

        // Determine size based on device type
        const sizeConfig = isMobile ? config.sizeProfile.mobile : config.sizeProfile.desktop;
        const size = Math.random() * sizeConfig.range + sizeConfig.minSize;
        
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.fontSize = `${size / (config.isNav ? 6 : 5)}px`;

        if (config.isNav) {
            element.classList.add('nav-bubble');
            element.href = config.href;
        } else {
            element.style.background = `radial-gradient(circle at 30% 30%, #fff, var(--bubble-color-2) 80%)`;
            element.style.pointerEvents = 'none';
        }
        
        bubbleContainer.appendChild(element);

        const bubbleObject = {
            element: element,
            x: Math.random() * (screenWidth - size),
            y: Math.random() * (screenHeight - size),
            vx: (Math.random() - 0.5) * 1, // Velocity in x-direction
            vy: (Math.random() - 0.5) * 1, // Velocity in y-direction
            radius: size / 2,
            mass: size // Mass proportional to size
        };

        allBubbles.push(bubbleObject);
    }

    // --- Create all bubbles ---
    navBubbles.slice(0, isMobile ? navBubbleConfig.mobile.count : navBubbleConfig.desktop.count).forEach(nav => {
        createBubble({ text: nav.text, href: nav.href, isNav: true, sizeProfile: navBubbleConfig });
    });
    skillBubbles.slice(0, isMobile ? skillBubbleConfig.mobile.count : skillBubbleConfig.desktop.count).forEach(skill => {
        createBubble({ text: skill, isNav: false, sizeProfile: skillBubbleConfig });
    });

    // --- Animation and Collision Logic ---
    function update() {
        allBubbles.forEach((bubble, index) => {
            // 1. Update position
            bubble.x += bubble.vx;
            bubble.y += bubble.vy;

            // 2. Wall collision
            if (bubble.x <= 0 || bubble.x + bubble.radius * 2 >= screenWidth) {
                bubble.vx *= -1;
                bubble.x = Math.max(0, Math.min(bubble.x, screenWidth - bubble.radius * 2));
            }
            if (bubble.y <= 0 || bubble.y + bubble.radius * 2 >= screenHeight) {
                bubble.vy *= -1;
                bubble.y = Math.max(0, Math.min(bubble.y, screenHeight - bubble.radius * 2));
            }

            // 3. Bubble-to-bubble collision
            for (let i = index + 1; i < allBubbles.length; i++) {
                const otherBubble = allBubbles[i];
                const dx = (otherBubble.x + otherBubble.radius) - (bubble.x + bubble.radius);
                const dy = (otherBubble.y + otherBubble.radius) - (bubble.y + bubble.radius);
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = bubble.radius + otherBubble.radius;

                if (distance < minDistance) {
                    resolveCollision(bubble, otherBubble);
                }
            }

            // 4. Apply new position to the DOM element
            bubble.element.style.transform = `translate3d(${bubble.x}px, ${bubble.y}px, 0)`;
        });

        requestAnimationFrame(update);
    }

    function resolveCollision(p1, p2) {
        // Elastic collision resolution
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Normal vector
        const nx = dx / distance;
        const ny = dy / distance;

        // Tangent vector
        const tx = -ny;
        const ty = nx;

        // Dot product tangent
        const dpTan1 = p1.vx * tx + p1.vy * ty;
        const dpTan2 = p2.vx * tx + p2.vy * ty;

        // Dot product normal
        const dpNorm1 = p1.vx * nx + p1.vy * ny;
        const dpNorm2 = p2.vx * nx + p2.vy * ny;

        // Conservation of momentum in 1D
        const m1 = (dpNorm1 * (p1.mass - p2.mass) + 2 * p2.mass * dpNorm2) / (p1.mass + p2.mass);
        const m2 = (dpNorm2 * (p2.mass - p1.mass) + 2 * p1.mass * dpNorm1) / (p1.mass + p2.mass);

        // Update velocities
        p1.vx = tx * dpTan1 + nx * m1;
        p1.vy = ty * dpTan1 + ny * m1;
        p2.vx = tx * dpTan2 + nx * m2;
        p2.vy = ty * dpTan2 + ny * m2;
    }

    // Handle window resizing
    window.addEventListener('resize', () => {
        screenWidth = window.innerWidth;
        screenHeight = window.innerHeight;
    });

    // Start the animation
    update();

    // Handle splash screen fade out
    if (mainButton) {
        mainButton.addEventListener('click', (e) => {
            // This is for single-page app navigation, but for now we let it go to the projects page.
            // To make it a single page app, we would use e.preventDefault() here.
            document.body.classList.remove('splash-active');
            splashScreen.classList.add('fade-out');
        });
    } else {
        document.body.classList.remove('splash-active');
    }
});
