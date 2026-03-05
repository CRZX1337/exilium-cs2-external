import { motion, useMotionValue, useMotionTemplate, useTransform } from 'framer-motion';
import { Crosshair } from 'lucide-react';
import { useEffect, useState } from 'react';
import Magnetic from './Magnetic';

// Floating animated background particles
const Particles = () => {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (windowSize.width === 0) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-[var(--color-exilium-accent)] rounded-full shadow-[0_0_15px_var(--color-exilium-accent-glow)]"
                    initial={{
                        x: Math.random() * windowSize.width,
                        y: Math.random() * windowSize.height,
                        opacity: Math.random() * 0.5 + 0.1,
                        scale: Math.random() * 2 + 0.5
                    }}
                    animate={{
                        y: [null, Math.random() * -200 - 100],
                        opacity: [null, 0],
                    }}
                    transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 5
                    }}
                />
            ))}
        </div>
    );
};

export default function Hero() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        // Normalize mouse coordinates for 3D tilt (-1 to 1)
        const x = (clientX / window.innerWidth) * 2 - 1;
        const y = (clientY / window.innerHeight) * 2 - 1;
        mouseX.set(x);
        mouseY.set(y);
    };

    const rotateX = useTransform(mouseY, [-1, 1], [5, -5]);
    const rotateY = useTransform(mouseX, [-1, 1], [-5, 5]);

    return (
        <section
            onMouseMove={handleMouseMove}
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-20"
            style={{ perspective: 1000 }}
        >
            <Particles />

            {/* Dynamic Background Elements */}
            <motion.div
                animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.03, 0.05, 0.03]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-exilium-accent)] blur-[120px] rounded-full pointer-events-none z-0"
            />

            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none z-0"></div>

            <motion.div
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="z-10 text-center max-w-5xl mx-auto relative"
            >
                <motion.div
                    style={{ transform: "translateZ(50px)" }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="flex justify-center mb-8 relative"
                >
                    <div className="p-5 bg-black/40 border border-white/10 backdrop-blur-xl rounded-full shadow-2xl relative group hover:border-[var(--color-exilium-accent)]/50 transition-colors duration-500">
                        <div className="absolute inset-0 bg-[var(--color-exilium-accent)] opacity-20 blur-xl rounded-full group-hover:opacity-60 transition-opacity duration-700 animate-pulse"></div>
                        <Crosshair className="w-10 h-10 text-[var(--color-exilium-accent)] relative z-10 drop-shadow-[0_0_10px_var(--color-exilium-accent-glow)]" strokeWidth={1.5} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.2 }}
                    className="mb-6 relative inline-block"
                >
                    <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-white tracking-tighter" style={{ textShadow: '0 0 80px rgba(255,255,255,0.1)' }}>
                        EXILIUM <span className="text-[var(--color-exilium-accent)] text-glow">CS2</span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-lg sm:text-xl lg:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto font-light tracking-wide px-4"
                >
                    Premium external assistance tool for CS2. Designed for high performance and strict security.
                </motion.p>

                <motion.div
                    style={{ transform: "translateZ(60px)" }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                >
                    <Magnetic intensity={0.4}>
                        <motion.a
                            whileHover={{ scale: 1.05, textShadow: "0 0 10px rgba(0,0,0,0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            href="#downloads"
                            className="btn-glow inline-block"
                        >
                            Download Client
                        </motion.a>
                    </Magnetic>

                    <Magnetic intensity={0.4}>
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href="#features"
                            className="btn-secondary inline-block"
                        >
                            Explore Architecture
                        </motion.a>
                    </Magnetic>
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
            >
                <span className="text-xs tracking-widest text-gray-500 uppercase font-semibold">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-[1px] h-12 bg-gradient-to-b from-gray-300 to-transparent"
                />
            </motion.div>
        </section>
    );
}
