import React, { useState, useEffect } from 'react';
import { Scene } from './components/Scene';
import { BotStatus } from './types';
import { Activity, Zap, ServerOff, AlertTriangle, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [status, setStatus] = useState<BotStatus>(BotStatus.IDLE);
  const [metrics, setMetrics] = useState({ cpu: "0.0%", mem: "0.0GB", net: "0.0MB/s" });
  const [logs, setLogs] = useState<string[]>([`[SYS] INIT NEURAL CORE... OK`]);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
      setTimeout(() => setBooting(false), 2000);
  }, []);

  useEffect(() => {
      let interval: NodeJS.Timeout;

      const updateMetrics = () => {
          if (status === BotStatus.DISCONNECTED) {
              setMetrics({ cpu: "0.0%", mem: "0.1GB", net: "0.0MB/s" });
          } else if (status === BotStatus.ERROR) {
              setMetrics({ 
                  cpu: `${(95 + Math.random() * 5).toFixed(1)}%`, 
                  mem: "ERR_OOM", 
                  net: "TIME_OUT" 
              });
          } else if (status === BotStatus.WORKING) {
              setMetrics({ 
                  cpu: `${(85 + Math.random() * 15).toFixed(1)}%`, 
                  mem: `${(12 + Math.random() * 4).toFixed(1)}GB`, 
                  net: `${(120 + Math.random() * 60).toFixed(1)}MB/s` 
              });
          } else {
              setMetrics({ 
                  cpu: `${(5 + Math.random() * 10).toFixed(1)}%`, 
                  mem: `${(2 + Math.random() * 1).toFixed(1)}GB`, 
                  net: `${(0.5 + Math.random() * 2).toFixed(1)}MB/s` 
              });
          }
      };

      updateMetrics();
      interval = setInterval(updateMetrics, 200);

      return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
      // 1. Output initial status change
      const time = new Date().toISOString().split('T')[1].slice(0, -5);
      let msg = '';
      switch(status) {
          case BotStatus.IDLE: msg = `[${time}] Entering low-power standby mode...`; break;
          case BotStatus.WORKING: msg = `[${time}] Workload detected. Scaling compute resources...`; break;
          case BotStatus.DISCONNECTED: msg = `[${time}] WARNING: Connection lost. Attempting reconnect...`; break;
          case BotStatus.ERROR: msg = `[${time}] CRITICAL: Unhandled exception in neural matrix.`; break;
      }
      setLogs(prev => {
          const next = [...prev, msg];
          if (next.length > 5) next.shift();
          return next;
      });

      // 2. Setup interval for simulated logs while working
      let intervalId: NodeJS.Timeout;
      if (status === BotStatus.WORKING) {
        intervalId = setInterval(() => {
            if (Math.random() > 0.5) {
                const hexStr = Math.floor(Math.random() * 0xffffff).toString(16).toUpperCase().padStart(6, '0');
                const actions = ["COMPUTING_NODE", "REALLOCATING", "FLUSH_MEM", "PACKET_RECV", "SYNAPSE_FIRE", "AWAITING_IO"];
                const action = actions[Math.floor(Math.random() * actions.length)];
                
                const simTime = new Date().toISOString().split('T')[1].slice(0, -5);
                setLogs(prev => {
                    const next = [...prev, `[${simTime}] ${action} 0x${hexStr} -> ACK`];
                    if (next.length > 5) next.shift();
                    return next;
                });
            }
        }, 800);
      }

      return () => clearInterval(intervalId);
  }, [status]);

  const getStatusIcon = () => {
      switch(status) {
          case BotStatus.IDLE: return <Activity className="w-5 h-5 text-cyan-400" />;
          case BotStatus.WORKING: return <Zap className="w-5 h-5 text-amber-500" />;
          case BotStatus.DISCONNECTED: return <ServerOff className="w-5 h-5 text-slate-500" />;
          case BotStatus.ERROR: return <AlertTriangle className="w-5 h-5 text-red-500" />;
      }
  }

  return (
    <div className="w-full h-screen bg-black relative font-mono text-white overflow-hidden selection:bg-cyan-900">
      <AnimatePresence>
        {booting && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4 text-cyan-400"
            >
              <Zap className="w-12 h-12 animate-pulse" />
              <div className="text-4xl font-black tracking-widest">CLAWDBOT</div>
            </motion.div>
            <div className="mt-8 text-cyan-500/50 text-xs tracking-[0.5em] uppercase font-bold animate-pulse">
              Initializing Core...
            </div>
            <div className="w-64 h-1 bg-white/10 mt-6 rounded-full overflow-hidden relative">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-y-0 left-0 bg-cyan-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0 bg-black">
        <Scene status={status} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 z-[1] bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none mix-blend-screen" />

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 p-8 z-10 w-full max-w-xl pointer-events-none flex flex-col justify-start h-full">
        
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="backdrop-blur-sm bg-black/20 border border-white/10 p-6 rounded-2xl shadow-2xl"
        >
            <h1 className="text-5xl font-black tracking-tighter mb-1 bg-gradient-to-br from-cyan-300 via-blue-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm uppercase">
            Clawdbot
            </h1>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/50 mb-6 font-bold">
                Quantum Neural Engine v4.0.2
            </p>

            <div className="flex flex-col gap-4">
                <div className="flex items-center space-x-4 bg-black/40 border border-white/5 p-4 rounded-xl">
                    <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                        {getStatusIcon()}
                    </div>
                    <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Core Status</p>
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={status}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className={`text-lg font-bold tracking-widest uppercase ${
                                    status === BotStatus.IDLE ? 'text-cyan-400' :
                                    status === BotStatus.WORKING ? 'text-amber-500' :
                                    status === BotStatus.DISCONNECTED ? 'text-slate-500' : 'text-red-500'
                                }`}
                            >
                                {status}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    {[
                        { label: 'CPU', val: metrics.cpu },
                        { label: 'MEM', val: metrics.mem },
                        { label: 'NET', val: metrics.net }
                    ].map((m, i) => (
                        <div key={i} className="bg-black/40 border border-white/5 p-3 rounded-lg flex flex-col justify-center items-center">
                            <span className="text-[9px] text-white/30 uppercase tracking-widest mb-1">{m.label}</span>
                            <AnimatePresence mode="wait">
                                <motion.span 
                                    key={m.val} 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }}
                                    className={`text-xs font-bold ${status === BotStatus.ERROR ? 'text-red-400' : 'text-white/80'}`}
                                >
                                    {m.val}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="mt-8 border-t border-white/10 pt-6">
                <div className="flex items-center gap-2 mb-3">
                    <Terminal className="w-3 h-3 text-white/40" />
                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">System.Log</span>
                </div>
                <div className="flex flex-col gap-1 font-mono text-[10px] bg-black/60 p-4 rounded-xl border border-white/5 h-32 overflow-hidden relative">
                    <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black/80 to-transparent z-10" />
                    <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black/80 to-transparent z-10" />
                    
                    <div className="flex flex-col justify-end h-full py-2">
                        {logs.map((log, i) => (
                            <motion.div 
                                key={log + i} 
                                initial={{ opacity: 0, x: -10 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                className={`mb-1 ${log.includes('CRITICAL') ? 'text-red-400 font-bold' : log.includes('WARNING') ? 'text-amber-400' : 'text-cyan-200/60'}`}
                            >
                                {log}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
      </div>

      {/* Control Panel (Sticky Bottom-Right) */}
      <div className="absolute bottom-8 right-8 z-20 flex flex-col items-end space-y-4">
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl w-64">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                <h3 className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                    Diagnostics
                </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                {[
                    { s: BotStatus.IDLE, label: 'Idle' },
                    { s: BotStatus.WORKING, label: 'Work' },
                    { s: BotStatus.DISCONNECTED, label: 'Halt' },
                    { s: BotStatus.ERROR, label: 'Panic' }
                ].map((btn) => {
                    const isActive = status === btn.s;
                    return (
                        <button 
                            key={btn.s}
                            onClick={() => setStatus(btn.s)}
                            className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                                isActive 
                                    ? btn.s === BotStatus.IDLE ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                                    : btn.s === BotStatus.WORKING ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                                    : btn.s === BotStatus.ERROR ? 'bg-red-500/20 text-red-300 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                                    : 'bg-slate-500/20 text-slate-300 border border-slate-500/50 shadow-[0_0_15px_rgba(100,116,139,0.3)]'
                                : 'bg-white/5 text-white/40 border border-transparent hover:bg-white/10 hover:text-white/80'
                            }`}
                        >
                            {btn.label}
                        </button>
                    )
                })}
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;
