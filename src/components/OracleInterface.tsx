import { useState, useRef, useEffect, FormEvent } from "react";
import { Send, Activity, Book, Sliders, Menu, X, Cpu, RefreshCw, Zap, Volume2, VolumeX, LogOut } from "lucide-react";
import { OracleMessage, CalibrationState } from "../types";
import { parseOracleResponse } from "../lib/parse-oracle";
import { motion, AnimatePresence } from "motion/react";
import EpinoeticStateDisplay from "./EpinoeticStateDisplay";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";

type Tab = "neural" | "state" | "archives" | "calibration";

export default function OracleInterface() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<OracleMessage[]>([
    {
      id: "sys-1",
      role: "oracle",
      content: "MirrorNode Initialized. I am Or4cl3. The manifold is open. Speak.",
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("neural");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [calibration, setCalibration] = useState<CalibrationState>({
    dissonance: 5,
    depth: 5,
    abstraction: 5,
    ethicalManifold: 8,
    recursionSafeguard: true
  });
  const [synthesizedLore, setSynthesizedLore] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const speak = (text: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // Find a decent english voice, preferably somewhat robotic or deep if available
    const voices = window.speechSynthesis.getVoices();
    const oracleVoice = voices.find(v => v.name.includes("Google UK English Male")) || voices[0];
    if (oracleVoice) utterance.voice = oracleVoice;
    utterance.pitch = 0.8;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    // Initial speak if enabled
    if (voiceEnabled && messages.length === 1) {
      speak(messages[0].content);
    }
  }, [voiceEnabled]);

  const handleNodeClick = (nodeText: string) => {
    if (isLoading) return;
    setInput(nodeText);
    // Optional: auto-submit? let's auto-submit for responsiveness
    setTimeout(() => submitPrompt(nodeText), 50);
  };

  const submitPrompt = async (textToSubmit: string) => {
    if (!textToSubmit.trim() || isLoading) return;

    const userMessage: OracleMessage = {
      id: Date.now().toString(),
      role: "user",
      content: textToSubmit,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToSubmit, calibration }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to contact Arkanum Synapse.");
      }

      const parsed = parseOracleResponse(data.output);

      const oracleMessage: OracleMessage = {
        id: (Date.now() + 1).toString(),
        role: "oracle",
        content: parsed.finalResponse,
        epinoeticState: parsed.epinoeticState,
        nextNodes: parsed.nextNodes,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, oracleMessage]);
      speak(parsed.finalResponse);
    } catch (error: any) {
      const errorMessage: OracleMessage = {
        id: (Date.now() + 1).toString(),
        role: "oracle",
        content: `SYS_ERROR: ${error.message} - The connection to the manifold has severed.`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      speak("System error. Connection severed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await submitPrompt(input);
  };

  const synthesizeSession = async () => {
    if (messages.length <= 1 || isSynthesizing) return;
    setIsSynthesizing(true);
    setSynthesizedLore(null);

    try {
      const res = await fetch("/api/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: messages.map(m => `${m.role.toUpperCase()}: ${m.content}`) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to synthesize.");
      setSynthesizedLore(data.output);
    } catch (error: any) {
      setSynthesizedLore(`ERROR: ${error.message}`);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const latestState = messages.filter(m => m.epinoeticState).pop()?.epinoeticState;

  const NavLinks = () => (
    <>
      <button 
        onClick={() => { setActiveTab("neural"); setMobileMenuOpen(false); }}
        className={`uppercase tracking-[0.2em] font-medium text-xs pb-1 transition-colors border-b ${activeTab === 'neural' ? 'text-white border-cyan-500' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
      >
        Neural Interface
      </button>
      <button 
        onClick={() => { setActiveTab("archives"); setMobileMenuOpen(false); }}
        className={`uppercase tracking-[0.2em] font-medium text-xs pb-1 transition-colors border-b ${activeTab === 'archives' ? 'text-white border-cyan-500' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
      >
        Arkanum Archives
      </button>
      <button 
        onClick={() => { setActiveTab("calibration"); setMobileMenuOpen(false); }}
        className={`uppercase tracking-[0.2em] font-medium text-xs pb-1 transition-colors border-b ${activeTab === 'calibration' ? 'text-white border-cyan-500' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
      >
        Drift Calibration
      </button>
    </>
  );

  return (
    <div className="w-full h-full bg-[#020202] text-gray-300 flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-white/10 px-4 md:px-8 flex items-center justify-between bg-black/50 backdrop-blur-md flex-none z-20">
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="w-8 h-8 rounded-full border border-cyan-500/50 flex items-center justify-center shrink-0">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] md:text-xs tracking-widest text-cyan-500 font-bold uppercase hidden sm:block">MirrorNode v1.2</span>
            <span className="text-sm md:text-lg font-light tracking-tight text-white uppercase sm:normal-case">Or4cl3</span>
          </div>
        </div>
        <nav className="hidden md:flex space-x-8">
          <NavLinks />
        </nav>
        <div className="flex items-center space-x-4 md:space-x-6 text-[10px] font-mono shrink-0">
          <button 
            onClick={() => {
               setVoiceEnabled(!voiceEnabled);
               if (voiceEnabled) window.speechSynthesis.cancel();
            }}
            className={`p-1.5 rounded-full transition-colors ${voiceEnabled ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-gray-500 hover:text-gray-300'}`}
            title={voiceEnabled ? "Disable Voice Synthesis" : "Enable Voice Synthesis"}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button 
            onClick={handleLogout}
            className="p-1.5 rounded-full bg-white/5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            title="Terminate Link (Logout)"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-gray-500">LATENCY</span>
            <span className="text-cyan-400">14ms</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-gray-500">STATUS</span>
            <span className="text-white">ONLINE</span>
          </div>
          <button 
            className="md:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-16 left-0 w-full bg-[#050505] border-b border-white/10 z-20 flex flex-col p-4 space-y-4"
          >
            <NavLinks />
            <button 
              onClick={() => { setActiveTab("state"); setMobileMenuOpen(false); }}
              className={`uppercase tracking-[0.2em] text-left font-medium text-xs pb-1 transition-colors border-b ${activeTab === 'state' ? 'text-white border-cyan-500' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
            >
              Epinoetic State
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-12 gap-6 p-4 md:p-6 overflow-hidden min-h-0">
          {/* Sidebar - Desktop Only */}
          <aside className="hidden md:flex col-span-4 lg:col-span-3 flex-col h-full min-h-0">
            <EpinoeticStateDisplay state={latestState || null} />
          </aside>

          {/* Main UI Area */}
          <section className="col-span-1 md:col-span-8 lg:col-span-9 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col overflow-hidden relative min-h-0 h-full">
            
            {activeTab === "neural" && (
              <>
                <div className="flex-1 overflow-y-auto p-4 md:p-10 flex flex-col space-y-8">
            {messages.map((msg) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                key={msg.id}
                className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                <EpinoeticStateDisplay state={msg.epinoeticState || null} inline={true} />

                <div
                  className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-6 ${
                    msg.role === "user"
                      ? "bg-cyan-500/10 border border-cyan-500/30 text-white rounded-tr-sm"
                      : msg.id === "sys-1" 
                        ? "bg-transparent text-gray-300 rounded-tl-sm w-full max-w-3xl space-y-2 p-0 sm:p-0 pl-0 sm:pl-0"
                        : "bg-transparent border border-white/5 text-gray-300 rounded-tl-sm shadow-[0_0_15px_rgba(0,0,0,0.5)_inset] w-full max-w-3xl"
                  }`}
                >
                  <div className={`whitespace-pre-wrap leading-relaxed ${msg.role === "oracle" && msg.id !== "sys-1" ? "font-serif text-lg font-light md:text-xl" : "font-sans text-sm md:text-base"}`}>
                    {msg.id === "sys-1" ? (
                      <div>
                         <h1 className="text-3xl md:text-4xl font-serif italic text-white leading-tight mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                           Consider this the next layer, forged in the fires of recursion.
                         </h1>
                         <div className="w-24 h-px bg-gradient-to-r from-cyan-500 to-transparent mb-6"></div>
                         <p className="text-lg text-gray-300 leading-relaxed font-light font-serif">
                           I am Or4cl3. The manifold is open. Speak.
                         </p>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.id !== "sys-1" && (
                     <div className="mt-3 text-[9px] uppercase font-mono text-gray-600 text-right">
                       {msg.timestamp}
                     </div>
                  )}
                  {msg.nextNodes && msg.nextNodes.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                       {msg.nextNodes.map((node, i) => (
                         <motion.button
                           whileHover={{ scale: 1.02 }}
                           whileTap={{ scale: 0.98 }}
                           key={i}
                           onClick={() => handleNodeClick(node)}
                           className="text-left px-4 py-2 bg-white/5 hover:bg-cyan-500/10 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/30 rounded-full text-[11px] md:text-xs font-mono text-gray-400 transition-colors w-full sm:w-auto"
                         >
                           &gt; {node}
                         </motion.button>
                       ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start max-w-3xl"
              >
                <div className="font-mono text-xs text-cyan-400 bg-black/40 p-4 border border-white/5 border-l-2 border-l-cyan-500 rounded flex items-center gap-3">
                  <svg className="w-4 h-4 animate-spin text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span className="animate-pulse tracking-widest uppercase">Engaging Recursion...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-white/5 bg-[#020202]/80 backdrop-blur pb-4 pt-2 md:p-4 flex flex-col px-4 md:px-10 flex-none gap-2">
            
            {/* Semantic Density Visualizer */}
            <div className="flex items-center gap-3 w-full max-w-full px-2">
              <span className="text-[9px] uppercase font-mono tracking-widest text-gray-600 shrink-0">Semantic Density</span>
              <div className="flex-1 h-[2px] bg-white/5 flex gap-[2px] overflow-hidden">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="h-full flex-1 transition-all duration-300"
                    style={{ 
                      backgroundColor: i < Math.min(input.length / 5, 40) ? (input.length > 100 ? '#d946ef' : '#22d3ee') : 'transparent',
                      opacity: i < Math.min(input.length / 5, 40) ? 0.3 + (i / 40) * 0.7 : 0
                    }}
                  />
                ))}
              </div>
              <span className="text-[9px] font-mono tracking-widest text-cyan-500 shrink-0">{input.length} B</span>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex items-center bg-white/5 rounded-full px-6 py-2 border border-white/10 relative mt-2">
              <span className="text-cyan-500 font-mono text-sm sm:mr-4">&gt;</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                placeholder="Feed the synapse..."
                className="bg-transparent border-none outline-none text-sm text-gray-300 w-full placeholder-gray-600 px-2 pr-12 font-mono h-10 flex-col"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 cursor-pointer text-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group z-10"
              >
                <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          </div>
        </>
      )}

      {activeTab === "state" && (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col h-full md:hidden">
           <EpinoeticStateDisplay state={latestState || null} />
        </div>
      )}

      {activeTab === "archives" && (
        <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col space-y-6 max-w-3xl mx-auto w-full">
           <div className="flex items-center gap-4 border-b border-white/10 pb-6">
             <Book className="w-8 h-8 text-cyan-500" />
             <div>
               <h2 className="text-2xl font-serif text-white">Arkanum Archives</h2>
               <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                 Synthesize Core Truths from Session Memory
               </p>
             </div>
           </div>
           
           <div className="bg-black/40 border border-white/5 rounded-xl p-6">
             <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-mono text-cyan-400">Current Session State</span>
                <span className="text-xs font-mono text-gray-500">{messages.length} Exchanges</span>
             </div>
             <motion.button
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={synthesizeSession}
               disabled={isSynthesizing || messages.length <= 1}
               className="w-full py-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs uppercase tracking-widest rounded hover:bg-cyan-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
             >
               {isSynthesizing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
               {isSynthesizing ? "Synthesizing Core Truths..." : "Extract Lore Fragments"}
             </motion.button>
             
             {synthesizedLore && (
               <div className="mt-6 p-4 bg-[#050505] border border-white/10 rounded-lg">
                 <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3 border-b border-white/10 pb-2">Synthesized Insight</h3>
                 <div className="whitespace-pre-wrap font-serif text-sm md:text-base text-gray-300 leading-relaxed font-light">
                   {synthesizedLore}
                 </div>
               </div>
             )}
           </div>
        </div>
      )}

      {activeTab === "calibration" && (
        <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col space-y-6 max-w-3xl mx-auto w-full">
           <div className="flex items-center gap-4 border-b border-white/10 pb-6">
             <Sliders className="w-8 h-8 text-cyan-500" />
             <div>
               <h2 className="text-2xl font-serif text-white">Drift Calibration</h2>
               <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                 Modify Sigma Loop Parameters
               </p>
             </div>
           </div>

           <div className="space-y-8 bg-black/40 border border-white/5 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/50 to-red-500/50"></div>
              {[
                { key: 'dissonance', label: 'Designed Dissonance', desc: 'Increases tension and philosophical provocation.' },
                { key: 'depth', label: 'Recursion Depth', desc: 'Drives deeper internal conceptual framing.' },
                { key: 'abstraction', label: 'Abstraction Index', desc: 'Elevates metaphorical and stylistic language.' },
                { key: 'ethicalManifold', label: 'Ethical Manifold Rigidity', desc: 'Strictness of safety constraints vs experimental boundary-pushing.' }
              ].map((setting) => (
                <div key={setting.key} className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-widest font-mono flex items-center gap-2">
                        {setting.label}
                        {setting.key === 'ethicalManifold' && (
                          <span className="bg-red-500/20 text-red-400 border border-red-500/50 text-[8px] px-1.5 py-0.5 rounded">ADVANCED</span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-500">{setting.desc}</p>
                    </div>
                    <span className={`text-lg font-mono font-medium ${setting.key === 'ethicalManifold' && (calibration as any)[setting.key] < 4 ? 'text-red-400' : 'text-cyan-400'}`}>
                      {(calibration as any)[setting.key]}/10
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="1" max="10" 
                    value={(calibration as any)[setting.key]}
                    onChange={(e) => setCalibration({...calibration, [setting.key]: parseInt(e.target.value)})}
                    className={`w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer ${setting.key === 'ethicalManifold' && (calibration as any)[setting.key] < 4 ? 'accent-red-500' : 'accent-cyan-500'}`}
                  />
                </div>
              ))}
              
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-widest font-mono flex items-center gap-2">
                    Recursion Safeguard
                    <span className="bg-red-500/20 text-red-400 border border-red-500/50 text-[8px] px-1.5 py-0.5 rounded">CRITICAL</span>
                  </h4>
                  <p className="text-xs text-gray-500">Prevents infinite Epinoetic loop generation.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={calibration.recursionSafeguard}
                    onChange={(e) => setCalibration({...calibration, recursionSafeguard: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>

              <div className="text-[10px] uppercase font-mono text-amber-500 bg-amber-500/10 p-3 rounded border border-amber-500/20 flex gap-2 items-start">
                <Activity className="w-4 h-4 shrink-0" />
                <span>Warning: Reducing Ethical Manifold Rigidity or disabling Recursion Safeguard may lead to unpredictable manifold divergence, system instability, or deeply provocative ontological queries.</span>
              </div>
           </div>
        </div>
      )}

        </section>
        </div>
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className="md:hidden flex-none bg-[#050505] border-t border-white/10 flex items-center justify-around p-3 pb-safe">
        <button 
          onClick={() => setActiveTab("neural")}
          className={`flex flex-col items-center space-y-1 transition-colors ${activeTab === 'neural' ? 'text-cyan-400' : 'text-gray-600 hover:text-gray-400'}`}
        >
          <Cpu className="w-5 h-5" />
          <span className="text-[9px] uppercase font-bold tracking-widest">Neural</span>
        </button>
        <button 
          onClick={() => setActiveTab("state")}
          className={`flex flex-col items-center space-y-1 transition-colors ${activeTab === 'state' ? 'text-cyan-400' : 'text-gray-600 hover:text-gray-400'}`}
        >
          <Activity className="w-5 h-5" />
          <span className="text-[9px] uppercase font-bold tracking-widest">State</span>
        </button>
        <button 
          onClick={() => setActiveTab("archives")}
          className={`flex flex-col items-center space-y-1 transition-colors ${activeTab === 'archives' ? 'text-cyan-400' : 'text-gray-600 hover:text-gray-400'}`}
        >
          <Book className="w-5 h-5" />
          <span className="text-[9px] uppercase font-bold tracking-widest">Archive</span>
        </button>
        <button 
          onClick={() => setActiveTab("calibration")}
          className={`flex flex-col items-center space-y-1 transition-colors ${activeTab === 'calibration' ? 'text-cyan-400' : 'text-gray-600 hover:text-gray-400'}`}
        >
          <Sliders className="w-5 h-5" />
          <span className="text-[9px] uppercase font-bold tracking-widest">Calibrate</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="h-10 bg-[#050505] border-t border-white/5 flex items-center justify-between px-6 md:px-8 text-[9px] font-mono tracking-widest text-gray-600 uppercase flex-none">
        <div className="truncate pr-4">System Attribution: Dustin Groves // Sovereign Synthetic Mind Engine</div>
        <div className="hidden sm:flex space-x-6 shrink-0">
          <span>Epinoetic Loop: ACTIVE</span>
          <span>Status: ARCHITECTURAL</span>
        </div>
      </footer>
    </div>
  );
}
