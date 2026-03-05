import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, AlertCircle, Clock, CheckCircle2, Terminal } from 'lucide-react';
import Magnetic from './Magnetic';

export default function Downloads() {
    const [stable, setStable] = useState(null);
    const [nightly, setNightly] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchReleases() {
            try {
                const res = await fetch('https://api.github.com/repos/CRZX1337/exilium-cs2-external/releases');
                if (!res.ok) throw new Error('Failed to fetch releases');
                const data = await res.json();

                const latestStable = data.find(r => !r.prerelease);
                const latestNightly = data.find(r => r.prerelease);

                setStable(latestStable || null);
                setNightly(latestNightly || null);
            } catch (err) {
                console.error("Error fetching GitHub releases:", err);
                setError("API Connection Refused. Ensure network stability.");
            } finally {
                setLoading(false);
            }
        }

        fetchReleases();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getDownloadUrl = (release) => {
        if (!release) return '#';
        const exeAsset = release.assets?.find(a => a.name.endsWith('.exe'));
        return exeAsset ? exeAsset.browser_download_url : release.html_url;
    };

    const ReleaseCard = ({ release, type }) => {
        if (!release) return null;

        const isStable = type === 'stable';
        const Icon = isStable ? CheckCircle2 : Terminal;
        const accentColor = isStable ? 'var(--color-exilium-accent)' : '#ff8a00';
        const badgeColor = isStable ? 'bg-[var(--color-exilium-accent)]/10 text-[var(--color-exilium-accent)] border border-[var(--color-exilium-accent)]/20' : 'bg-[#ff8a00]/10 text-[#ff8a00] border border-[#ff8a00]/20';
        const glowColor = isStable ? 'group-hover:shadow-[0_0_40px_rgba(57,255,20,0.15)]' : 'group-hover:shadow-[0_0_40px_rgba(255,138,0,0.15)]';
        const buttonHoverColor = isStable ? 'hover:bg-[var(--color-exilium-accent)] text-white hover:text-black hover:border-[var(--color-exilium-accent)]' : 'hover:bg-[#ff8a00] text-white hover:text-black hover:border-[#ff8a00]';
        const buttonHoverShadow = isStable ? 'hover:shadow-[0_0_20px_var(--color-exilium-accent-glow)]' : 'hover:shadow-[0_0_20px_rgba(255,138,0,0.3)]';

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`glass-card p-8 flex flex-col h-full bg-black/20 ${glowColor} relative group overflow-hidden`}
            >
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-10 transition-opacity duration-700 blur-[50px] rounded-full`} style={{ backgroundColor: accentColor }}></div>

                <div className="flex justify-between items-start mb-8 z-10">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl bg-black/40 border border-white/5 shadow-inner`}>
                            <Icon className="w-6 h-6" style={{ color: accentColor }} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white tracking-tight">{release.name || release.tag_name}</h3>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5 font-medium">
                                <Clock className="w-3.5 h-3.5" /> Compiled {formatDate(release.published_at)}
                            </p>
                        </div>
                    </div>
                    <span className={`px-4 py-1.5 text-xs font-bold uppercase rounded-full tracking-wider ${badgeColor}`}>
                        {isStable ? 'Stable Build' : 'Nightly Build'}
                    </span>
                </div>

                <div className="flex-grow mb-8 bg-[#020503] p-5 rounded-2xl border border-white/5 relative z-10 shadow-inner">
                    <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ backgroundColor: accentColor, opacity: 0.5 }}></div>
                    <h4 className="text-xs text-gray-600 uppercase font-bold mb-3 tracking-widest">Changelog Integration</h4>
                    <div className="text-sm text-gray-400 space-y-2 whitespace-pre-wrap font-mono leading-relaxed line-clamp-[6]">
                        {release.body || "Awaiting telemetry data..."}
                    </div>
                </div>

                <Magnetic intensity={0.15}>
                    <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        href={getDownloadUrl(release)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`relative overflow-hidden w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold tracking-wide z-10 transition-all duration-300 bg-black/40 border border-white/10 ${buttonHoverColor} ${buttonHoverShadow} group`}
                    >
                        <Download className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1" strokeWidth={2} />
                        Initialize Download
                    </motion.a>
                </Magnetic>
            </motion.div>
        );
    };

    return (
        <section id="downloads" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[var(--color-exilium-accent)] opacity-[0.01] blur-[100px] rounded-full pointer-events-none"></div>

            <div className="text-center mb-16 sm:mb-24 relative px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 sm:mb-6 tracking-tight"
                >
                    Download <span className="text-[var(--color-exilium-accent)] text-glow">Client</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 max-w-2xl mx-auto text-lg font-light"
                >
                    Get the latest version of Exilium CS2. Updates are compiled and released automatically.
                </motion.p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-32">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-t-2 border-r-2 border-[var(--color-exilium-accent)] rounded-full"
                    />
                </div>
            ) : error ? (
                <div className="glass-card p-8 flex flex-col items-center justify-center gap-4 text-red-400 border-red-500/20 max-w-2xl mx-auto text-center">
                    <AlertCircle className="w-10 h-10 text-red-500" strokeWidth={1.5} />
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Connection Error</h3>
                        <p className="text-gray-400 font-light">{error}</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    {stable && <ReleaseCard release={stable} type="stable" />}
                    {nightly ? (
                        <ReleaseCard release={nightly} type="nightly" />
                    ) : (
                        stable && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="glass-card p-12 flex flex-col justify-center items-center text-center bg-black/20 border-white/5"
                            >
                                <div className="w-20 h-20 bg-black/40 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                    <Terminal className="w-8 h-8 text-gray-600" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl font-black text-white tracking-tight mb-3">No Active Nightly Builds</h3>
                                <p className="text-gray-500 font-light text-sm max-w-[250px]">
                                    All current experimental branches have been merged into stable.
                                </p>
                            </motion.div>
                        )
                    )}
                </div>
            )}
        </section>
    );
}
