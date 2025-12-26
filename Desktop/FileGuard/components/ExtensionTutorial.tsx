
import React, { useState, useEffect } from 'react';
import { X, Download, Monitor, ArrowRight, CheckCircle, Smartphone, Chrome } from 'lucide-react';
import { generatePythonBackend } from '../utils/pythonGenerator';

interface ExtensionTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onTogglePreview: (enabled: boolean) => void;
  isPreviewMode: boolean;
}

const ExtensionTutorial: React.FC<ExtensionTutorialProps> = ({ 
  isOpen, 
  onClose, 
  onTogglePreview,
  isPreviewMode 
}) => {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) setStep(1);
  }, [isOpen]);

  if (!isOpen) return null;

  const downloadPythonScript = () => {
    const code = generatePythonBackend(process.env.API_KEY || '');
    const blob = new Blob([code], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'server.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Monitor className="h-5 w-5 text-emerald-400" />
              Browser Extension Setup
            </h2>
            <p className="text-sm text-slate-400">Run FileGuard as a persistent tool</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8 px-4 relative">
             <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10" />
             {[1, 2, 3, 4].map((s) => (
               <div key={s} className={`
                 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-4 border-slate-900
                 ${step >= s ? 'bg-emerald-500 text-slate-900' : 'bg-slate-800 text-slate-500'}
               `}>
                 {s}
               </div>
             ))}
          </div>

          <div className="min-h-[250px]">
            {step === 1 && (
              <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-4">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-8 w-8 text-emerald-400 animate-bounce" />
                </div>
                <h3 className="text-2xl font-bold text-white">1. Download Backend (Optional)</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  To run advanced system-level scans, FileGuard uses a local Python server. This is optional for basic analysis.
                </p>
                <button 
                  onClick={downloadPythonScript}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-600 font-medium inline-flex items-center gap-2 transition-all active:scale-95"
                >
                  {copied ? <CheckCircle className="h-5 w-5 text-emerald-400" /> : <Download className="h-5 w-5" />}
                  {copied ? 'Downloaded server.py' : 'Download Python Script'}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-4">
                <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Monitor className="h-8 w-8 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">2. Run Local Server</h3>
                <p className="text-slate-400 max-w-md mx-auto text-sm">
                  <span className="text-rose-400 font-bold">Important:</span> If the script closes immediately, you are missing libraries. Open a terminal and run:
                </p>
                <div className="bg-black/50 p-4 rounded-lg text-left font-mono text-sm text-emerald-400 border border-slate-800 max-w-md mx-auto relative group">
                  <p className="text-slate-500 select-none"># Install libraries</p>
                  <p className="mb-2 select-all">pip install flask flask-cors google-generativeai</p>
                  <p className="text-slate-500 select-none"># Run server</p>
                  <p className="select-all">python server.py</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-4">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">3. Preview Extension Mode</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  Toggle the preview to see how FileGuard looks as a 375px browser popup.
                </p>
                <button 
                  onClick={() => onTogglePreview(!isPreviewMode)}
                  className={`px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-all border ${
                    isPreviewMode 
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-900 border-transparent'
                  }`}
                >
                  <Monitor className="h-5 w-5" />
                  {isPreviewMode ? 'Exit Preview Mode' : 'Enable Popup Mode'}
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-4">
                <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Chrome className="h-8 w-8 text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">4. Install in Chrome</h3>
                <div className="text-left max-w-md mx-auto space-y-3 text-sm text-slate-300">
                  <p>1. Run <code className="bg-slate-800 px-1 rounded">npm run build</code> in your terminal.</p>
                  <p>2. Go to <code className="bg-slate-800 px-1 rounded">chrome://extensions</code>.</p>
                  <p>3. Enable <strong>Developer Mode</strong> (top right).</p>
                  <p>4. Click <strong>Load Unpacked</strong> and select the <code className="bg-slate-800 px-1 rounded">dist</code> folder.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-6 border-t border-slate-800 flex justify-between bg-slate-950/50">
           <button 
             onClick={() => setStep(Math.max(1, step - 1))}
             className={`px-4 py-2 text-slate-400 hover:text-white transition-colors ${step === 1 ? 'invisible' : ''}`}
           >
             Back
           </button>
           <button 
             onClick={() => {
               if (step < 4) setStep(step + 1);
               else onClose();
             }}
             className="px-6 py-2 bg-slate-100 hover:bg-white text-slate-900 rounded-lg font-medium transition-colors flex items-center gap-2"
           >
             {step === 4 ? 'Finish' : 'Next'}
             {step < 4 && <ArrowRight className="h-4 w-4" />}
           </button>
        </div>
      </div>
    </div>
  );
};

export default ExtensionTutorial;