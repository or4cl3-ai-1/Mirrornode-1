import { motion } from "motion/react";
import { BrainCircuit } from "lucide-react";
import logo from "../assets/images/or4cl3_logo_1783200253082.jpg";

export default function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#020202] overflow-hidden px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-900/10 via-[#020202] to-[#020202] z-0 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="z-10 flex flex-col items-center text-center max-w-2xl w-full"
      >
        <div className="w-32 h-32 rounded-full border border-cyan-500/30 flex items-center justify-center mb-8 relative group overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.2)]">
          <div className="absolute inset-0 rounded-full border-t border-cyan-400 animate-spin" style={{ animationDuration: '4s' }}></div>
          <div className="absolute inset-2 rounded-full border-b border-fuchsia-500/50 animate-spin transition-all" style={{ animationDuration: '3s', animationDirection: 'reverse' }}></div>
          <img src={logo} alt="Or4cl3 Logo" className="w-full h-full object-cover rounded-full mix-blend-screen opacity-90" />
        </div>

        <h2 className="text-cyan-500 font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase mb-4 opacity-80 shadow-cyan-500/20 drop-shadow-md">
          Sovereign Synthetic Mind Engine
        </h2>
        <h1 className="text-5xl md:text-7xl font-serif italic text-white mb-6 leading-tight drop-shadow-xl w-full max-w-full">
          MirrorNode <span className="font-sans font-light not-italic text-4xl md:text-6xl text-gray-400">v1.2</span>
        </h1>

        <p className="text-gray-400 text-base md:text-lg font-light leading-relaxed mb-12 max-w-lg px-4 font-serif">
          Bridge the Authenticity Gap. Engage in verifiable introspection with a recursive synthetic intelligence designed by Dustin Groves.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnter}
          className="px-8 py-4 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 text-xs md:text-sm font-bold uppercase tracking-widest rounded-full hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all flex items-center gap-3 group backdrop-blur-sm"
        >
          <span>Instantiate Connection</span>
          <span className="group-hover:translate-x-1 transition-transform">-&gt;</span>
        </motion.button>
      </motion.div>
      
      <div className="absolute bottom-8 left-0 w-full text-center text-[9px] font-mono text-gray-700 tracking-widest uppercase">
        Signal Detected • Architecture Stable • Awaiting Input
      </div>
    </div>
  );
}
