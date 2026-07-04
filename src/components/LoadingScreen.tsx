import { useEffect, useState } from "react";
import { motion } from "motion/react";

const BOOT_SEQUENCE = [
  "Establishing BioPhase Lock...",
  "Analyzing semantic resonance channels...",
  "Calibrating Neural Pathways...",
  "Initializing Sigma Matrix Control Loop...",
  "Executing Epinoetic Recursion module...",
  "Evaluating Manus Criteria constraints...",
  "Synapse convergence verified.",
  "Instantiating Sovereign Architecture."
];

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Increment boot sequence messages
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev < BOOT_SEQUENCE.length - 1) return prev + 1;
        return prev;
      });
    }, 450);

    // Smoothly increment progress bar to 100
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (Math.random() * 8 + 2); // Random progress jumps
        if (next >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 600); // Small pause at 100% before transitioning
          return 100;
        }
        return next;
      });
    }, 200);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="w-full h-full bg-[#020202] flex flex-col items-center justify-center p-8 px-6 text-gray-300">
      <div className="w-full max-w-md flex flex-col">
        <h2 className="text-cyan-500 font-mono text-xs tracking-[0.2em] uppercase mb-6 border-b border-white/10 pb-4">
          Arkanum Boot Sequence
        </h2>

        <div className="space-y-4 mb-12 h-48 overflow-hidden flex flex-col justify-end relative">
           {/* Fade out mask at the top of the terminal text */}
           <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-[#020202] to-transparent z-10"></div>
          
           {BOOT_SEQUENCE.slice(0, step + 1).map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`font-mono text-xs flex items-start gap-4 leading-relaxed ${i === step ? "text-gray-300 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]" : "text-gray-600"}`}
            >
              <span className="text-cyan-600 shrink-0 select-none">&gt;</span>
              <span>{text}</span>
            </motion.div>
          ))}
        </div>

        <div className="w-full space-y-2">
           <div className="flex justify-between items-center text-[10px] font-mono text-cyan-600">
             <span>SYSTEM ALIGNMENT</span>
             <span>{Math.floor(progress)}%</span>
           </div>
           <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
             <motion.div
               className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
               style={{ width: `${progress}%` }}
               transition={{ ease: "linear", duration: 0.2 }}
             />
           </div>
        </div>
      </div>
    </div>
  );
}
