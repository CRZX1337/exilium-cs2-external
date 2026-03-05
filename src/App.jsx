import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import Features from './components/Features'
import Screenshots from './components/Screenshots'
import Downloads from './components/Downloads'
import Magnetic from './components/Magnetic'
import InteractiveGrid from './components/InteractiveGrid'; // Added InteractiveGrid import

function CustomCursor() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if it's a touch device
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouchDevice(true);
      // Also ensure body cursor is set to auto on touch devices
      document.body.style.cursor = 'auto';
      return;
    }

    const moveCursor = (e) => {
      cursorX.set(e.clientX); // Changed from e.clientX - 16
      cursorY.set(e.clientY); // Changed from e.clientY - 16
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []); // Dependency array remains empty for initial setup

  if (isTouchDevice) return null; // Do not render cursor on touch devices

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[var(--color-exilium-accent)]/50 pointer-events-none z-[100] hidden md:flex items-center justify-center mix-blend-screen"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    >
      <div className="w-1.5 h-1.5 bg-[var(--color-exilium-accent)] rounded-full shadow-[0_0_10px_var(--color-exilium-accent-glow)]"></div>
    </motion.div>
  );
}

// Synthetic subtle tick sound using Web Audio API
const playTick = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // High pitch tick
    oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); // Very quiet
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.05);
  } catch (e) { /* ignore if audio context locked */ }
};

function App() {
  const { scrollY } = useScroll();
  const navBackground = useTransform(
    scrollY,
    [0, 50],
    ["rgba(3, 10, 5, 0)", "rgba(3, 10, 5, 0.7)"]
  );
  const navBorder = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.05)"]
  );
  const navBlur = useTransform(
    scrollY,
    [0, 50],
    ["blur(0px)", "blur(20px)"]
  );

  // Disable right-click globally
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    // Document level subtle hover sounds
    const handleMouseOver = (e) => {
      if (e.target.closest('a') || e.target.closest('button')) {
        playTick();
      }
    };
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden selection:bg-[var(--color-exilium-accent)] selection:text-black">
      {/* Huge Ambient Rotating Background Orbs */}
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
          opacity: [0.03, 0.06, 0.03]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="fixed top-[-20%] left-[-10%] w-[80vw] h-[80vw] bg-[var(--color-exilium-accent)] rounded-full blur-[150px] pointer-events-none z-[-1]"
      />

      <motion.div
        animate={{
          rotate: -360,
          scale: [1, 1.3, 1],
          opacity: [0.02, 0.05, 0.02]
        }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#00ff41] rounded-full blur-[150px] pointer-events-none z-[-1]"
      />

      <CustomCursor />
      <InteractiveGrid /> {/* Added InteractiveGrid component here */}

      <motion.nav
        style={{
          backgroundColor: navBackground,
          borderBottomColor: navBorder,
          backdropFilter: navBlur,
          WebkitBackdropFilter: navBlur
        }}
        className="fixed w-full z-50 top-0 left-0 border-b border-transparent transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-20 w-full">
            <div className="hidden md:block">
              <div className="flex items-center space-x-2">
                <Magnetic intensity={0.2}><motion.a whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} href="#" className="text-gray-400 hover:text-white transition-all duration-300 px-4 py-2 rounded-lg text-sm font-semibold tracking-wide hover:bg-white/5 inline-block">Overview</motion.a></Magnetic>
                <Magnetic intensity={0.2}><motion.a whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} href="#features" className="text-gray-400 hover:text-white transition-all duration-300 px-4 py-2 rounded-lg text-sm font-semibold tracking-wide hover:bg-white/5 inline-block">Features</motion.a></Magnetic>
                <Magnetic intensity={0.2}><motion.a whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} href="#screenshots" className="text-gray-400 hover:text-white transition-all duration-300 px-4 py-2 rounded-lg text-sm font-semibold tracking-wide hover:bg-white/5 inline-block">Screenshots</motion.a></Magnetic>
                <div className="w-px h-6 bg-white/10 mx-2"></div>
                <Magnetic intensity={0.3}>
                  <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="#downloads" className="text-black bg-[var(--color-exilium-accent)] shadow-[0_0_15px_var(--color-exilium-accent-glow)] hover:shadow-[0_0_25px_rgba(57,255,20,0.4)] hover:bg-[#4dff2e] transition-all duration-300 px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide ml-2 inline-block">
                    Initialize Client
                  </motion.a>
                </Magnetic>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      <main>
        <Hero />

        {/* Subtle animated separator */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-10 hidden md:block max-w-7xl mx-auto origin-center"
        />

        <Features />

        {/* Subtle animated separator */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-10 hidden md:block max-w-7xl mx-auto origin-center"
        />

        <Screenshots />

        {/* Subtle animated separator */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-10 hidden md:block max-w-7xl mx-auto origin-center"
        />

        <Downloads />
      </main>

      <footer className="border-t border-white/5 bg-[#010502] pt-24 pb-12 mt-32 relative overflow-hidden">
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-exilium-accent)] to-transparent opacity-50"
        ></motion.div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-[var(--color-exilium-accent)] opacity-[0.03] blur-[120px] rounded-t-full pointer-events-none"></div>


        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
          <Magnetic intensity={0.5}>
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/20 font-black text-2xl leading-none mb-8 border border-white/5 hover:border-[var(--color-exilium-accent)] hover:text-[var(--color-exilium-accent)] cursor-pointer"
            >
              E
            </motion.div>
          </Magnetic>

          <div className="text-white/20 text-xs font-mono uppercase tracking-[0.3em] mb-12 flex items-center gap-4">
            <Magnetic intensity={0.1}><motion.span whileHover={{ color: "var(--color-exilium-accent)" }} className="cursor-pointer transition-colors inline-block">Secure</motion.span></Magnetic>
            <span className="w-1 h-1 rounded-full bg-white/20 relative"><span className="absolute inset-0 bg-[var(--color-exilium-accent)] rounded-full animate-ping opacity-20"></span></span>
            <Magnetic intensity={0.1}><motion.span whileHover={{ color: "var(--color-exilium-accent)" }} className="cursor-pointer transition-colors inline-block">Performant</motion.span></Magnetic>
            <span className="w-1 h-1 rounded-full bg-white/20 relative"><span className="absolute inset-0 bg-[var(--color-exilium-accent)] rounded-full animate-ping opacity-20 delay-75"></span></span>
            <Magnetic intensity={0.1}><motion.span whileHover={{ color: "var(--color-exilium-accent)" }} className="cursor-pointer transition-colors inline-block">Undetected</motion.span></Magnetic>
          </div>

          <p className="text-gray-600 text-sm font-light tracking-wide text-center mt-4">
            &copy; {new Date().getFullYear()} Exilium Project. Strictly for educational deployment.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
