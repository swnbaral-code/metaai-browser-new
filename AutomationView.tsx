
import React, { useState } from 'react';
import { Play, Plus, Zap, Workflow, Clock, Search, Bot, Database, Mail, Share2, MoreVertical, Globe } from 'lucide-react';

const AutomationView: React.FC = () => {
  const [nodes, setNodes] = useState([
    { id: '1', type: 'trigger', label: 'Daily Timer', position: { x: 100, y: 100 }, icon: <Clock className="w-5 h-5" /> },
    { id: '2', type: 'ai', label: 'AI Summarizer', position: { x: 400, y: 100 }, icon: <Bot className="w-5 h-5" /> },
    { id: '3', type: 'action', label: 'Email Report', position: { x: 700, y: 100 }, icon: <Mail className="w-5 h-5" /> },
  ]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const addNode = (label: string, type: string, icon: React.ReactNode) => {
    const newNode = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      label,
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
      icon
    };
    setNodes([...nodes, newNode as any]);
    setShowLibrary(false);
  };

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    const node = nodes.find(n => n.id === id);
    if (node) {
      setDraggingNodeId(id);
      setDragOffset({
        x: e.clientX - node.position.x,
        y: e.clientY - node.position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId) {
      setNodes(prev => prev.map(node => 
        node.id === draggingNodeId 
          ? { ...node, position: { x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y } }
          : node
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  return (
    <div 
      className="h-full flex flex-col bg-zinc-950 overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Header */}
      <div className="px-4 md:px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Zap className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white leading-tight">Automation Lab</h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold hidden xs:block">Node Workflow Builder</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 md:space-x-3">
          <button 
            onClick={() => setShowLibrary(!showLibrary)}
            className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors border border-zinc-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Node</span>
          </button>
          <button className="flex items-center space-x-2 px-4 md:px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold shadow-lg shadow-purple-500/20 transition-all text-sm">
            <Play className="w-4 h-4" />
            <span>Execute</span>
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] overflow-hidden">
        <div className="absolute inset-0 overflow-auto p-20">
          <div className="relative min-w-[1000px] min-h-[800px]">
            {nodes.map((node) => (
              <div 
                key={node.id} 
                onMouseDown={(e) => handleMouseDown(e, node.id)}
                style={{ left: node.position.x, top: node.position.y }}
                className={`absolute w-56 md:w-64 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-xl cursor-move group hover:border-purple-500/50 transition-all ${draggingNodeId === node.id ? 'scale-105 border-purple-500 shadow-purple-500/20 z-50' : 'z-10'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${node.type === 'trigger' ? 'bg-orange-500/10 text-orange-500' : node.type === 'ai' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'}`}>
                    {node.icon}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setNodes(nodes.filter(n => n.id !== node.id));
                    }}
                    className="p-1 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-zinc-200 font-bold text-sm md:text-base">{node.label}</h3>
                <p className="text-zinc-500 text-[10px] md:text-xs mt-1">Configured and ready</p>
                
                {/* Input/Output Sockets */}
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-zinc-800 border border-zinc-600 rounded-full" />
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-purple-500 border border-purple-300 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
              </div>
            ))}

            {/* Connection Lines (Dynamic-ish Mockup) */}
            <svg className="absolute inset-0 pointer-events-none w-full h-full opacity-30">
              {nodes.length >= 2 && nodes.slice(0, -1).map((node, i) => {
                const nextNode = nodes[i + 1];
                const startX = node.position.x + 256; // width
                const startY = node.position.y + 48; // approx center
                const endX = nextNode.position.x;
                const endY = nextNode.position.y + 48;
                return (
                  <path 
                    key={i}
                    d={`M ${startX} ${startY} C ${startX + 50} ${startY}, ${endX - 50} ${endY}, ${endX} ${endY}`} 
                    stroke="#a855f7" 
                    strokeWidth="2" 
                    fill="none" 
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Mini Library Panel */}
        <div className={`absolute left-4 md:left-6 top-4 md:top-6 bottom-4 md:bottom-6 w-64 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-2xl overflow-y-auto custom-scrollbar transition-all duration-300 z-40 ${showLibrary ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}`}>
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Library</h4>
            <button onClick={() => setShowLibrary(false)} className="text-zinc-500 hover:text-white">
              <Plus className="w-4 h-4 rotate-45" />
            </button>
          </div>
          <div className="space-y-6">
            <NodeLibraryGroup title="Triggers" onAdd={addNode} nodes={[
              { icon: <Clock className="w-4 h-4" />, label: 'Cron Timer', type: 'trigger' },
              { icon: <Globe className="w-4 h-4" />, label: 'Web Hook', type: 'trigger' },
              { icon: <Mail className="w-4 h-4" />, label: 'New Email', type: 'trigger' }
            ]} />
            <NodeLibraryGroup title="Logic" onAdd={addNode} nodes={[
              { icon: <Bot className="w-4 h-4" />, label: 'AI Agent', type: 'ai' },
              { icon: <Search className="w-4 h-4" />, label: 'Browser Search', type: 'ai' },
              { icon: <Database className="w-4 h-4" />, label: 'SQL Query', type: 'ai' }
            ]} />
            <NodeLibraryGroup title="Actions" onAdd={addNode} nodes={[
              { icon: <Share2 className="w-4 h-4" />, label: 'Social Post', type: 'action' },
              { icon: <Mail className="w-4 h-4" />, label: 'SMTP Send', type: 'action' },
              { icon: <MoreVertical className="w-4 h-4" />, label: 'HTTP Request', type: 'action' }
            ]} />
          </div>
        </div>
      </div>
    </div>
  );
};

const NodeLibraryGroup: React.FC<{ title: string; nodes: any[]; onAdd: (l: string, t: string, i: React.ReactNode) => void }> = ({ title, nodes, onAdd }) => (
  <div>
    <h5 className="text-[10px] font-bold text-zinc-600 uppercase mb-3 px-1">{title}</h5>
    <div className="space-y-2">
      {nodes.map((node, i) => (
        <div 
          key={i} 
          onClick={() => onAdd(node.label, node.type, node.icon)}
          className="flex items-center space-x-3 p-2 rounded-xl bg-zinc-800/50 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors"
        >
          <div className="text-zinc-400 w-4 h-4 flex items-center justify-center">
            {node.icon}
          </div>
          <span className="text-sm text-zinc-300 font-medium">{node.label}</span>
        </div>
      ))}
    </div>
  </div>
);

export default AutomationView;
