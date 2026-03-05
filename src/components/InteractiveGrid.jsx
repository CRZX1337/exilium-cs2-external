import { useEffect, useRef } from 'react';

const InteractiveGrid = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Settings
        const spacing = 40;
        const dotRadius = 1;

        let width, height;
        let points = [];

        // Mouse/Touch tracking
        let mouse = { x: -1000, y: -1000, radius: window.innerWidth < 768 ? 100 : 150 };

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            // Re-initialize grid points (reduce density on mobile for performance)
            const currentSpacing = width < 768 ? spacing * 1.5 : spacing;

            points = [];
            for (let x = 0; x < width; x += currentSpacing) {
                for (let y = 0; y < height; y += currentSpacing) {
                    points.push({
                        x, y,
                        ox: x, oy: y,
                        vx: 0, vy: 0
                    });
                }
            }
        };

        window.addEventListener('resize', resize);
        resize();

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        const handleTouchMove = (e) => {
            if (e.touches.length > 0) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
            }
        };
        const handleLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('mouseleave', handleLeave);
        window.addEventListener('touchend', handleLeave);

        let animationFrameId;
        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < points.length; i++) {
                let p = points[i];

                // Mouse interaction physics
                let dx = mouse.x - p.x;
                let dy = mouse.y - p.y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius) {
                    let angle = Math.atan2(dy, dx);
                    let force = (mouse.radius - dist) / mouse.radius; // 0 to 1
                    // Push away
                    p.vx -= Math.cos(angle) * force * 0.5;
                    p.vy -= Math.sin(angle) * force * 0.5;
                }

                // Friction
                p.vx *= 0.92;
                p.vy *= 0.92;

                // Return to original position (spring)
                p.vx += (p.ox - p.x) * 0.05;
                p.vy += (p.oy - p.y) * 0.05;

                // Apply velocity
                p.x += p.vx;
                p.y += p.vy;

                // Draw point
                ctx.beginPath();
                ctx.arc(p.x, p.y, dotRadius, 0, Math.PI * 2);

                // Fade opacity based on distance from origin and mouse proximity
                let alpha = 0.15;
                if (dist < mouse.radius * 2) {
                    alpha = 0.15 + (1 - (dist / (mouse.radius * 2))) * 0.5; // Brighter near mouse
                }

                ctx.fillStyle = `rgba(57, 255, 20, ${alpha})`; // Exilium green
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('mouseleave', handleLeave);
            window.removeEventListener('touchend', handleLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-0 mix-blend-screen"
            style={{ opacity: 0.6 }}
        />
    );
};

export default InteractiveGrid;
