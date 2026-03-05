import { motion, useMotionValue, useMotionTemplate, useTransform, useSpring } from 'framer-motion';
import { Target, Focus, ShieldAlert, Eye, SlidersHorizontal } from 'lucide-react';

const features = [
    {
        name: 'Humanized Aimbot',
        description: 'Distance-based dynamic speed and micro-jitter to ensure assistance looks completely natural and legitimate.',
        icon: Target,
    },

    {
        name: 'Legit RCS',
        description: 'A delta-based Recoil Control System that smoothly adjusts to your spray patterns without unnatural snapping.',
        icon: ShieldAlert,
    },
    {
        name: 'Clean Visuals',
        description: 'Highly performant ESP, customizable 2D overlay Radar, and a built-in Bomb Timer for enhanced situational awareness.',
        icon: Eye,
    },
    {
        name: 'Categorized Configs',
        description: 'Separate, highly customizable configuration profiles tailored for Pistols, Heavy Pistols, SMGs, Rifles, and Snipers.',
        icon: SlidersHorizontal,
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
        }
    }
};

// Spotlight Card Component
const FeatureCard = ({ feature }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const springConfig = { damping: 20, stiffness: 300, mass: 0.2 };
    const springRotateX = useSpring(rotateX, springConfig);
    const springRotateY = useSpring(rotateY, springConfig);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const x = clientX - left;
        const y = clientY - top;
        mouseX.set(x);
        mouseY.set(y);

        const rX = ((y / height) - 0.5) * -15; // Max 15deg tilt
        const rY = ((x / width) - 0.5) * 15;
        rotateX.set(rX);
        rotateY.set(rY);
    }

    function handleMouseLeave() {
        rotateX.set(0);
        rotateY.set(0);
    }

    return (
        <motion.div
            variants={itemVariants}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="glass-card p-8 md:p-10 flex flex-col h-full z-10 relative overflow-visible group cursor-default"
            style={{
                perspective: 1000,
                rotateX: springRotateX,
                rotateY: springRotateY,
                transformStyle: "preserve-3d"
            }}
            whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 300, damping: 20 } }}
        >
            {/* Mouse Tracking Spotlight Gradient */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(57, 255, 20, 0.15),
              transparent 80%
            )
          `,
                }}
            />

            {/* Border Spotlight */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 z-20"
                style={{
                    border: '1px solid transparent',
                    background: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              rgba(57, 255, 20, 0.4),
              transparent 100%
            ) border-box
          `,
                    WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                }}
            />

            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-exilium-accent)] opacity-[0.02] rounded-full blur-[40px] group-hover:opacity-[0.05] group-hover:scale-150 transition-all duration-700 pointer-events-none"></div>

            <motion.div
                style={{ transform: "translateZ(40px)" }}
                className="w-16 h-16 bg-black/60 border border-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:border-[var(--color-exilium-accent)]/40 transition-colors duration-300 relative"
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="absolute inset-0 bg-[var(--color-exilium-accent)] blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
                <feature.icon className="w-8 h-8 text-gray-400 group-hover:text-[var(--color-exilium-accent)] transition-colors duration-300 relative z-10" strokeWidth={1.5} />
            </motion.div>

            <motion.h3 style={{ transform: "translateZ(30px)" }} className="text-2xl font-bold text-white mb-4 group-hover:text-[var(--color-exilium-accent)] transition-all duration-300 tracking-tight">
                {feature.name}
            </motion.h3>

            <motion.p style={{ transform: "translateZ(20px)" }} className="text-gray-400/80 leading-relaxed font-light text-[15px] flex-grow">
                {feature.description}
            </motion.p>
        </motion.div>
    );
};

export default function Features() {
    return (
        <section id="features" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16 sm:mb-24 relative px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 sm:mb-6 tracking-tight"
                >
                    Core <span className="text-[var(--color-exilium-accent)] text-glow">Features</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 max-w-2xl mx-auto text-lg font-light"
                >
                    Built from the ground up to give you a seamless advantage while ensuring legitimate-looking gameplay.
                </motion.p>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto"
            >
                {features.map((feature) => (
                    <FeatureCard key={feature.name} feature={feature} />
                ))}
            </motion.div>
        </section>
    );
}
