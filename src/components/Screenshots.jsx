import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Image as ImageIcon, Lock, ShieldAlert } from 'lucide-react';

const placeholders = [
    {
        id: 1,
        title: 'Ingame ESP overlay active',
        status: 'CLASSIFIED',
        icon: Lock
    },
    {
        id: 2,
        title: 'Menu Configuration UI',
        status: 'AWAITING TELEMETRY',
        icon: ImageIcon
    },
    {
        id: 3,
        title: 'Aimbot Field of View',
        status: 'DATA REDACTED',
        icon: ShieldAlert
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
        }
    }
};

const ScreenshotPlaceholder = ({ item }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            variants={itemVariants}
            onMouseMove={handleMouseMove}
            className="group relative aspect-video w-full rounded-2xl overflow-hidden glass-card cursor-not-allowed border-white/5 bg-black/40"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {/* Mouse Tracking Spotlight Gradient */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 z-10"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            600px circle at ${mouseX}px ${mouseY}px,
                            rgba(57, 255, 20, 0.15),
                            transparent 80%
                        )
                    `,
                }}
            />

            {/* Ambient Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-[#030a05] to-[#07140a] opacity-90"></div>

            {/* Scanning Line Animation */}
            <motion.div
                animate={{ y: ["-10%", "110%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-exilium-accent)] to-transparent opacity-20 blur-[2px] z-0"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:border-[var(--color-exilium-accent)]/50 transition-colors duration-500 shadow-inner backdrop-blur-md"
                >
                    <item.icon className="w-8 h-8 text-gray-500 group-hover:text-[var(--color-exilium-accent)] transition-colors duration-500" strokeWidth={1.5} />
                </motion.div>

                <h3 className="text-xl font-bold text-white tracking-tight mb-2 opacity-90">{item.title}</h3>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-exilium-accent)] animate-pulse shadow-[0_0_10px_var(--color-exilium-accent-glow)]"></span>
                    <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-exilium-accent)] opacity-80">{item.status}</p>
                </div>
            </div>

            {/* Diagonal overlay pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}></div>
        </motion.div>
    );
};

export default function Screenshots() {
    return (
        <section id="screenshots" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16 sm:mb-24 relative px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 sm:mb-6 tracking-tight"
                >
                    In-Game <span className="text-[var(--color-exilium-accent)] text-glow">Screenshots</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 max-w-2xl mx-auto text-lg font-light relative z-10"
                >
                    View our clean, customizable overlay and interactive menu directly in-game.
                </motion.p>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
                {placeholders.map((item) => (
                    <ScreenshotPlaceholder key={item.id} item={item} />
                ))}
            </motion.div>
        </section>
    );
}
