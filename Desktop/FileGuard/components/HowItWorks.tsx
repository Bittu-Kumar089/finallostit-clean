import React from 'react';
import { Upload, Binary, BrainCircuit, FileCheck } from 'lucide-react';

const steps = [
  {
    icon: <Upload className="h-8 w-8 text-white" />,
    title: "1. Upload",
    desc: "Drag & drop any file. The browser reads the raw binary data locally."
  },
  {
    icon: <Binary className="h-8 w-8 text-white" />,
    title: "2. Extraction",
    desc: "We extract file headers (Magic Bytes) and metadata properties."
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-white" />,
    title: "3. AI Analysis",
    desc: "Metadata is sent to Gemini AI to cross-reference against known threat patterns."
  },
  {
    icon: <FileCheck className="h-8 w-8 text-white" />,
    title: "4. Report",
    desc: "Receive a detailed safety score and actionable recommendations."
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-slate-900/30 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How FileGuard <span className="text-cyan-400">Works</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Transparency is key to security. Here is how our pipeline processes your data 
            without compromising your privacy.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 -translate-y-1/2"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-2xl bg-slate-900 border-2 border-slate-700 flex items-center justify-center mb-6 group-hover:border-emerald-500 group-hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] transition-all duration-300 relative">
                   <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   {step.icon}
                   <div className="absolute -bottom-3 bg-slate-950 px-3 text-xs font-mono text-slate-500 group-hover:text-emerald-400 transition-colors">
                     STEP 0{idx + 1}
                   </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 max-w-[200px] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;