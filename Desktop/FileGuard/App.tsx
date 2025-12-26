
import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import FileUpload from './components/FileUpload';
import AnalysisReport from './components/AnalysisReport';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import TestSamples from './components/TestSamples';
import ExtensionTutorial from './components/ExtensionTutorial';
import { extractFileMetadata } from './utils/fileHelpers';
import { analyzeFileWithGemini } from './services/geminiService';
import { AnalysisState, FileMetadata } from './types';
import { MAX_FILE_SIZE_BYTES } from './constants';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for conditional class merging
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    status: 'idle',
    file: null,
    result: null,
  });
  
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [isExtensionPreview, setIsExtensionPreview] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);

  // Auto-detect if running inside a real Chrome Extension
  useEffect(() => {
    // @ts-ignore - chrome is available in extension context
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
      setIsExtensionPreview(true);
    }
  }, []);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToScanner = () => {
    const element = document.getElementById('scanner');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFileSelect = async (file: File) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert("File is too large for this demo (Max 10MB)");
      return;
    }

    setState(prev => ({ ...prev, status: 'analyzing', file, error: undefined }));
    if (!isExtensionPreview) scrollToScanner();

    try {
      const extractedMetadata = await extractFileMetadata(file);
      setMetadata(extractedMetadata);

      const result = await analyzeFileWithGemini(file, extractedMetadata);
      
      setState({
        status: 'complete',
        file,
        result,
      });

    } catch (error: any) {
      console.error(error);
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error.message || "An unexpected error occurred during analysis."
      }));
    }
  };

  const handleReset = () => {
    setState({ status: 'idle', file: null, result: null });
    setMetadata(null);
  };

  // Wrapper class determines if we show full site or extension popup view
  const wrapperClass = isExtensionPreview 
    ? "w-[375px] min-h-[500px] overflow-y-auto bg-slate-950 border-x border-b border-slate-700 mx-auto relative scrollbar-hide"
    : "min-h-screen bg-slate-950 text-slate-50 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200";

  return (
    <div className={isExtensionPreview ? "min-h-screen flex items-start justify-center bg-slate-900" : ""}>
      <div className={wrapperClass}>
        <Navbar onOpenExtension={() => setIsExtensionModalOpen(true)} />
        
        <ExtensionTutorial 
          isOpen={isExtensionModalOpen} 
          onClose={() => setIsExtensionModalOpen(false)}
          isPreviewMode={isExtensionPreview}
          onTogglePreview={(val) => {
             setIsExtensionPreview(val);
             setIsExtensionModalOpen(false); // Close modal when mode switches
          }}
        />
        
        {/* Hero Section - Hidden in Extension Mode */}
        {!isExtensionPreview && (
          <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-grid opacity-20"></div>
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse-slow"></div>
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse-slow animation-delay-2000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-700 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-medium text-slate-300">FileGuard v1.0 Live</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                Verify Files. <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
                  Stop Threats.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 leading-relaxed">
                The intelligent file analysis tool that uses AI heuristics and metadata forensics to 
                detect malicious patterns before you click open.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                <button 
                  onClick={scrollToScanner}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)] flex items-center gap-2 cursor-pointer z-20 relative"
                >
                  Analyze File Now
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Main Scanner Section */}
        <div 
          ref={scannerRef} 
          id="scanner" 
          className={cn(
            "relative z-10",
            !isExtensionPreview ? "-mt-20 mb-20 pointer-events-none" : "mt-4 px-4 pb-12"
          )}
        >
          <div className={cn(
            !isExtensionPreview ? "max-w-5xl mx-auto px-6" : ""
          )}>
            <div className={cn(
              "bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center justify-center relative pointer-events-auto",
              !isExtensionPreview ? "min-h-[500px] shadow-black/50 p-8 md:p-12" : "p-4 min-h-[400px]"
            )}>
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 opacity-50"></div>

               {state.status === 'idle' && (
                 <div className="w-full animate-in fade-in duration-500 flex flex-col items-center">
                   <div className="text-center mb-8">
                     <h2 className={cn("font-bold text-white mb-2", isExtensionPreview ? "text-xl" : "text-2xl")}>
                       Initialize Scan
                     </h2>
                     <p className="text-slate-400 text-sm">Upload a file to begin analysis</p>
                   </div>
                   <FileUpload onFileSelect={handleFileSelect} isLoading={false} />
                   
                   <TestSamples onFileSelect={handleFileSelect} isLoading={false} />
                 </div>
               )}

              {state.status === 'analyzing' && (
                <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-500">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-800/50"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                    <div className="absolute inset-4 rounded-full bg-emerald-500/10 animate-pulse flex items-center justify-center">
                       <ShieldCheck className="h-10 w-10 text-emerald-500/50" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-white tracking-tight">Analyzing...</h3>
                    <div className="flex flex-col gap-1 text-sm font-mono text-emerald-400/80">
                      <span className="animate-pulse">Reading Data... [OK]</span>
                      <span className="animate-pulse delay-150">Checking Heuristics... [OK]</span>
                    </div>
                  </div>
                </div>
              )}

              {state.status === 'complete' && state.result && metadata && (
                <AnalysisReport 
                  result={state.result} 
                  fileMetadata={metadata} 
                  reset={handleReset} 
                />
              )}

              {state.status === 'error' && (
                <div className="max-w-md w-full bg-rose-500/10 border border-rose-500/20 p-8 rounded-2xl text-center space-y-6 animate-in zoom-in duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/20 text-rose-500">
                    <span className="text-3xl font-bold">!</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Analysis Failed</h3>
                    <p className="text-rose-200/80">{state.error}</p>
                  </div>
                  <button 
                    onClick={handleReset}
                    className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-colors font-medium shadow-lg shadow-rose-900/20"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {!isExtensionPreview && <Features />}
        {!isExtensionPreview && <HowItWorks />}

        {/* Footer */}
        <footer className={cn("bg-slate-950 border-t border-slate-900 py-12", isExtensionPreview && "hidden")}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
               <p>© {new Date().getFullYear()} FileGuard AI. All rights reserved.</p>
               <p className="flex items-center gap-2">
                 <span>Powered by Priyanshu</span>
               </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
