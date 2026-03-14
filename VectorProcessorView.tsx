import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Cpu, 
  Binary, 
  Layers, 
  ChevronRight, 
  RefreshCw, 
  Terminal,
  Box,
  Zap,
  Hash,
  Network,
  Share2
} from 'lucide-react';

const VectorProcessorView: React.FC = () => {
  const [coords, setCoords] = useState({ x: 1.0, y: 2.0, z: 3.0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>(['System initialized...', 'Awaiting vector input...']);

  const vectorSet = useMemo(() => {
    const { x, y, z } = coords;
    return [x, y, z, 0, -x, -y, -z];
  }, [coords]);

  const patterns = [
    { prefix: '0', suffix: '0', state: '{(01)-1}{(01)0}{(01)+1}' },
    { prefix: '0', suffix: '0', state: '{(01)-1}{(01)0}{(01)+1}' },
    { prefix: '1', suffix: '1', state: '{(01)-1}{(01)0}{(01)+1}' },
    { prefix: '1', suffix: '1', state: '{(01)-1}{(01)0}{(01)+1}' },
  ];

  const handleProcess = () => {
    setIsProcessing(true);
    setLogs(prev => [`Processing vector [${coords.x}, ${coords.y}, ${coords.z}]`, ...prev]);
    
    setTimeout(() => {
      setIsProcessing(false);
      setLogs(prev => [`Calculation complete. Vector set generated.`, ...prev]);
    }, 1500);
  };

  const handleReset = () => {
    setCoords({ x: 1.0, y: 2.0, z: 3.0 });
    setLogs(prev => ['System reset to default parameters.', ...prev]);
  };

  const copyVectorSet = () => {
    const text = `[${vectorSet.join(', ')}]`;
    navigator.clipboard.writeText(text);
    setLogs(prev => ['Vector set copied to clipboard.', ...prev]);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 font-mono text-zinc-400 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-zinc-900 flex items-center justify-between bg-zinc-950/50 backdrop-blur-md z-10">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <Activity className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tighter uppercase">Vector State Processor</h2>
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Calculation & Pattern Processing Unit</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleReset}
            className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-all"
            title="Reset to defaults"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-1 px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase">System Online</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input & Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-900 rounded-2xl p-6 space-y-6">
              <div className="flex items-center space-x-2 text-zinc-500 mb-2">
                <Cpu className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Input Parameters</span>
              </div>
              
              <div className="space-y-4">
                <CoordInput label="X-AXIS" value={coords.x} onChange={(v) => setCoords(p => ({ ...p, x: v }))} />
                <CoordInput label="Y-AXIS" value={coords.y} onChange={(v) => setCoords(p => ({ ...p, y: v }))} />
                <CoordInput label="Z-AXIS" value={coords.z} onChange={(v) => setCoords(p => ({ ...p, z: v }))} />
              </div>

              <button 
                onClick={handleProcess}
                disabled={isProcessing}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-zinc-950 font-black rounded-xl transition-all flex items-center justify-center space-x-2 uppercase tracking-tighter"
              >
                {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                <span>{isProcessing ? 'Processing...' : 'Execute Calculation'}</span>
              </button>
            </div>

            {/* Visual Diagram Section */}
            <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-6">
              <div className="flex items-center space-x-2 text-zinc-500 mb-4">
                <Network className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">State Convergence Diagram</span>
              </div>
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 font-mono text-[10px] leading-tight text-emerald-500/60 whitespace-pre overflow-x-auto">
{`0 1 0 1 0 1
\\ / \\ / \\ /
-1 0 +1
\\ |. /
. |. /
\\ |. /
Vector


0`}
              </div>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-6">
              <div className="flex items-center space-x-2 text-zinc-500 mb-4">
                <Terminal className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Process Logs</span>
              </div>
              <div className="space-y-2 h-48 overflow-y-auto custom-scrollbar text-[10px] font-mono">
                {logs.map((log, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <span className="text-emerald-500/50">[{new Date().toLocaleTimeString()}]</span>
                    <span className={i === 0 ? 'text-zinc-200' : 'text-zinc-600'}>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Visualization & Results */}
          <div className="lg:col-span-8 space-y-6">
            {/* Pattern Display */}
            <div className="bg-zinc-900/50 border border-zinc-900 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2 text-zinc-500">
                  <Binary className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Pattern Matrix Output</span>
                </div>
                <div className="text-[10px] text-zinc-600 uppercase tracking-widest">Format: State [Vector] State</div>
              </div>

              <div className="space-y-4">
                {patterns.map((p, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-center space-x-1 p-4 bg-zinc-950 border border-zinc-900 rounded-xl group hover:border-emerald-500/30 transition-all font-mono"
                  >
                    <span className="text-xl font-bold text-zinc-400">{p.prefix}</span>
                    <span className="text-sm font-bold text-emerald-500/80">[{p.state}Vector]</span>
                    <span className="text-xl font-bold text-zinc-400">{p.suffix}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Vector Set Result */}
            <div className="bg-zinc-900/50 border border-zinc-900 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2 text-zinc-500">
                  <Layers className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Calculated Vector Set</span>
                </div>
                <button 
                  onClick={copyVectorSet}
                  className="flex items-center space-x-2 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-[10px] text-zinc-400 transition-colors"
                >
                  <Share2 className="w-3 h-3" />
                  <span>Copy Set</span>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {['X', 'Y', 'Z', '0', '-X', '-Y', '-Z'].map((label, i) => (
                  <div key={i} className="text-center">
                    <div className="text-[10px] text-zinc-600 mb-2 font-bold uppercase">{label}</div>
                    <motion.div 
                      key={vectorSet[i]}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="py-4 bg-zinc-950 border border-zinc-900 rounded-xl text-zinc-200 font-bold text-lg"
                    >
                      {vectorSet[i]}
                    </motion.div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                <div className="flex items-center space-x-2 text-emerald-500 mb-2">
                  <Box className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Data Processing & Calculation</span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Vector = &#123; x, y, z, 0, -x, -y, -z &#125;
                  <br />
                  The system processes the input coordinates through a symmetrical state matrix, generating a 7-point vector set for spatial calculation.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const CoordInput: React.FC<{ label: string; value: number; onChange: (v: number) => void }> = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{label}</label>
      <span className="text-[10px] font-mono text-emerald-500">{value.toFixed(2)}</span>
    </div>
    <div className="flex items-center space-x-4">
      <button 
        onClick={() => onChange(value - 1)}
        className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-colors"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
      </button>
      <input 
        type="range" 
        min="-100" 
        max="100" 
        step="0.1"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 accent-emerald-500 h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer"
      />
      <button 
        onClick={() => onChange(value + 1)}
        className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export default VectorProcessorView;
