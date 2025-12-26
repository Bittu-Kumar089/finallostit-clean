import React from 'react';
import { Cpu, ShieldAlert, FileSearch, Zap, Lock, ScanLine } from 'lucide-react';

const features = [
  {
    icon: <Cpu className="h-6 w-6 text-emerald-400" />,
    title: 'AI Heuristics',
    description: 'Advanced algorithms analyze file structure patterns that traditional antivirus might miss.'
  },
  {
    icon: <FileSearch className="h-6 w-6 text-cyan-400" />,
    title: 'Magic Byte Analysis',
    description: 'Verifies the true identity of a file by inspecting its hexadecimal header signature.'
  },
  {
    icon: <Lock className="h-6 w-6 text-indigo-400" />,
    title: 'Privacy First',
    description: 'Files are processed in-memory. Only metadata is sent for AI analysis, preserving your privacy.'
  },
  {
    icon: <ShieldAlert className="h-6 w-6 text-rose-400" />,
    title: 'Anomaly Detection',
    description: 'Detects double extensions, spoofed MIME types, and other common malware camouflage techniques.'
  },
  {
    icon: <ScanLine className="h-6 w-6 text-amber-400" />,
    title: 'Instant Reporting',
    description: 'Get a comprehensive breakdown of potential threats and technical details in seconds.'
  },
  {
    icon: <Zap className="h-6 w-6 text-purple-400" />,
    title: 'Lightweight',
    description: 'No installation required. Runs directly in your browser with minimal resource usage.'
  }
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/50"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Military-Grade <span className="text-emerald-400">Analysis</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Our multi-layered inspection engine combines static analysis with generative AI 
            to uncover hidden threats in everyday files.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="group p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10">
              <div className="h-12 w-12 rounded-lg bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-slate-700 group-hover:border-emerald-500/30">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;