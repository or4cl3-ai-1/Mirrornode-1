import { EpinoeticState } from "../types";
import { motion } from "motion/react";

interface EpinoeticStateDisplayProps {
  state: EpinoeticState | null;
  inline?: boolean;
}

export default function EpinoeticStateDisplay({ state, inline = false }: EpinoeticStateDisplayProps) {
  if (!state) {
    if (inline) return null;
    return (
      <div className="flex-1 flex items-center justify-center text-xs text-gray-600 font-mono italic">
        Awaiting instantiation...
      </div>
    );
  }

  const pasScoreNum = parseFloat(state.pasScore || "0");
  const pasScorePercentage = Math.round(pasScoreNum * 100);
  const isStable = state.sigmaCheck?.includes('STABLE') ?? true;

  if (inline) {
    return (
      <div className="w-full max-w-3xl mb-2 font-mono text-[11px] bg-black/40 p-4 border-l-2 border-cyan-500/50 rounded space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-20">
           <motion.div 
             animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
             transition={{ duration: isStable ? 4 : 1.5, repeat: Infinity, ease: "easeInOut" }}
             className={`w-8 h-8 rounded-full blur-xl ${isStable ? 'bg-cyan-500' : 'bg-red-500'}`}
           />
        </div>
        <div className="text-cyan-500 font-bold border-b border-white/10 pb-2 mb-2 uppercase">
          Epinoetic State
        </div>
        {state.biophaseLock && (
          <div>
            <span className="text-gray-500">&lt;biophase_lock&gt; </span>
            <span className="text-gray-300">{state.biophaseLock}</span>
          </div>
        )}
        {state.recursiveMonologue && (
          <div>
            <span className="text-purple-400">&lt;recursive_monologue&gt; </span>
            <span className="text-gray-500 italic">"{state.recursiveMonologue}"</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl p-5 flex flex-col overflow-y-auto min-h-0">
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 sticky top-0 bg-[#020202] pb-2 z-10 -mt-2 pt-2">
          Epinoetic State
        </h3>
        <div className="font-mono text-[11px] space-y-4">
          {state.biophaseLock && (
            <div className="p-3 bg-black/40 rounded border-l-2 border-cyan-500/50">
              <div className="text-cyan-500 mb-1 font-bold">&lt;biophase_lock&gt;</div>
              <div className="text-gray-400">{state.biophaseLock}</div>
            </div>
          )}
          {state.recursiveMonologue && (
            <div className="p-3 bg-black/40 rounded border-l-2 border-purple-500/50">
              <div className="text-purple-400 mb-1 font-bold">&lt;recursive_monologue&gt;</div>
              <div className="text-gray-500 italic">{state.recursiveMonologue}</div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2 text-center">
            {state.sigmaCheck && (
              <div className="p-2 bg-black/40 rounded border border-white/5 relative overflow-hidden flex flex-col items-center justify-center">
                <div className="text-[9px] text-gray-500 mb-2 uppercase z-10">Sigma Check</div>
                
                {/* Dynamic Drift Visualizer */}
                <div className="flex items-center gap-2 mb-2 z-10">
                   <div className="flex gap-1">
                     {[...Array(5)].map((_, i) => (
                       <motion.div
                         key={i}
                         animate={{ height: isStable ? [4, 8, 4] : [4, 16, 4] }}
                         transition={{ 
                           duration: isStable ? 2 : 0.5, 
                           repeat: Infinity, 
                           delay: i * 0.1,
                           ease: "easeInOut" 
                         }}
                         className={`w-1 rounded-full ${isStable ? 'bg-cyan-500' : 'bg-red-500'}`}
                       />
                     ))}
                   </div>
                </div>

                <div className={`font-bold z-10 text-[10px] tracking-wider ${isStable ? 'text-cyan-400' : 'text-red-400'}`}>
                  {state.sigmaCheck}
                </div>
                
                {/* Background glow based on drift */}
                <motion.div 
                  animate={{ opacity: [0.1, 0.2, 0.1] }}
                  transition={{ duration: isStable ? 3 : 1, repeat: Infinity }}
                  className={`absolute inset-0 ${isStable ? 'bg-cyan-500/10' : 'bg-red-500/20'}`}
                />
              </div>
            )}
            {state.pasScore && (
              <div className="p-2 bg-black/40 rounded border border-white/5 flex flex-col justify-center">
                <div className="text-[9px] text-gray-500 mb-1 uppercase">PAS Score</div>
                <div className="text-white font-bold">{state.pasScore}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="h-48 bg-white/[0.03] border border-white/10 rounded-xl p-5 flex flex-col justify-center items-center flex-none mt-4 relative overflow-hidden">
        <motion.div 
           animate={{ rotate: isStable ? 360 : -360 }}
           transition={{ duration: isStable ? 20 : 5, repeat: Infinity, ease: "linear" }}
           className="absolute inset-0 opacity-10"
           style={{
             backgroundImage: 'radial-gradient(circle at center, transparent 40%, rgba(34, 211, 238, 0.4) 40%, transparent 41%, transparent 60%, rgba(34, 211, 238, 0.4) 60%, transparent 61%)'
           }}
        />
        <div className="relative w-24 h-24 flex items-center justify-center z-10">
          <svg className="w-full h-full -rotate-90">
            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-800" />
            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * pasScoreNum)} className="text-cyan-500 transition-all duration-1000" />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-xl font-bold text-white">{pasScorePercentage}%</span>
            <span className="text-[8px] text-gray-500 uppercase">Sync</span>
          </div>
        </div>
        <div className="mt-3 text-[10px] text-gray-500 font-mono z-10">CONVERGENCE RADIUS</div>
      </div>
    </>
  );
}
