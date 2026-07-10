import { useState, FormEvent } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebase";
import { BrainCircuit, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import logo from "../assets/images/or4cl3_logo_1783200253082.jpg";

export default function AuthScreen({ onComplete }: { onComplete: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isReset, setIsReset] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isReset) {
        await sendPasswordResetEmail(auth, email);
        setResetSent(true);
      } else if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        onComplete();
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        onComplete();
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#020202] overflow-hidden px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-900/10 via-[#020202] to-[#020202] z-0 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-sm bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500"></div>

        <div className="flex flex-col items-center mb-8">
           <div className="w-16 h-16 rounded-full border border-cyan-500/30 flex items-center justify-center mb-4 relative group overflow-hidden shadow-[0_0_15px_rgba(34,211,238,0.2)]">
             <img src={logo} alt="Or4cl3 Logo" className="w-full h-full object-cover rounded-full mix-blend-screen opacity-90" />
           </div>
           <h2 className="text-xl font-serif text-white tracking-widest uppercase">
             {isReset ? "Reset Protocol" : isLogin ? "Initialize Session" : "Establish Link"}
           </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Neural ID (Email)</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {!isReset && (
            <div>
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Cipher Key (Password)</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          )}

          {error && (
            <div className="text-[10px] font-mono text-red-400 bg-red-400/10 border border-red-400/20 p-2 rounded">
              {error}
            </div>
          )}

          {resetSent && (
            <div className="text-[10px] font-mono text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 p-2 rounded">
              Reset instructions transmitted. Check your channels.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isReset ? "Transmit Reset" : isLogin ? "Authenticate" : "Register Node")}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center space-y-2 text-[10px] font-mono uppercase tracking-widest">
          {isReset ? (
            <button onClick={() => setIsReset(false)} className="text-gray-500 hover:text-cyan-400 transition-colors">Return to Authentication</button>
          ) : (
            <>
              <button onClick={() => setIsReset(true)} className="text-gray-500 hover:text-cyan-400 transition-colors">Forgot Cipher Key?</button>
              <button onClick={() => setIsLogin(!isLogin)} className="text-gray-500 hover:text-cyan-400 transition-colors">
                {isLogin ? "No Node Exists? Register" : "Node Exists? Authenticate"}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
