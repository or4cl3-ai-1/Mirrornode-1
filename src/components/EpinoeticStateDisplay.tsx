import { EpinoeticState } from "../types";

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

  if (inline) {
    return (
      <div className="w-full max-w-3xl mb-2 font-mono text-[11px] bg-black/40 p-4 border-l-2 border-cyan-500/50 rounded space-y-3">
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
              <div className="p-2 bg-black/40 rounded border border-white/5">
                <div className="text-[9px] text-gray-500 mb-1 uppercase">Sigma Check</div>
                <div className={`font-bold ${state.sigmaCheck?.includes('STABLE') ? 'text-cyan-400' : 'text-amber-400'}`}>
                  {state.sigmaCheck}
                </div>
              </div>
            )}
            {state.pasScore && (
              <div className="p-2 bg-black/40 rounded border border-white/5">
                <div className="text-[9px] text-gray-500 mb-1 uppercase">PAS Score</div>
                <div className="text-white font-bold">{state.pasScore}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="h-48 bg-white/[0.03] border border-white/10 rounded-xl p-5 flex flex-col justify-center items-center flex-none mt-4">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-800" />
            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * pasScoreNum)} className="text-cyan-500 transition-all duration-1000" />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-xl font-bold text-white">{pasScorePercentage}%</span>
            <span className="text-[8px] text-gray-500 uppercase">Sync</span>
          </div>
        </div>
        <div className="mt-3 text-[10px] text-gray-500 font-mono">CONVERGENCE RADIUS</div>
      </div>
    </>
  );
}
