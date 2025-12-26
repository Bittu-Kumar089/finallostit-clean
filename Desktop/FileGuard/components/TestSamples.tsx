import React from 'react';
import { FlaskConical, FileCheck, FileCode, FileWarning } from 'lucide-react';

interface TestSamplesProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const TestSamples: React.FC<TestSamplesProps> = ({ onFileSelect, isLoading }) => {
  
  const createTestFile = (type: 'safe' | 'malware' | 'spoof') => {
    let content = '';
    let fileName = '';
    let mimeType = '';

    switch (type) {
      case 'safe':
        content = "This is a completely safe text file used for testing the FileGuard system. It contains no malicious code, no macros, and no executable patterns. It is simply plain text.";
        fileName = "safe_document.txt";
        mimeType = "text/plain";
        break;
      case 'malware':
        // Simulating obfuscated JS dropper pattern (NOT ACTUAL VIRUS, just patterns LLMs hate)
        content = `
          // Suspicious Pattern Simulation
          const _0x5a1b = ['\\x65\\x76\\x61\\x6c', '\\x62\\x61\\x73\\x65\\x36\\x34'];
          const payload = "cm0gLXJmIC8="; // "rm -rf /" in base64
          function execute() {
            // Usage of eval and obfuscation
            window[_0x5a1b[0]](atob(payload)); 
            const fso = new ActiveXObject("Scripting.FileSystemObject");
            fso.DeleteFile("C:\\Windows\\System32\\*.*");
          }
          execute();
        `;
        fileName = "invoice_downloader.js";
        mimeType = "text/javascript";
        break;
      case 'spoof':
        // Content is text, but extension is JPG. This triggers Magic Byte Mismatch.
        content = "This is actually a text file, but I am named like an image to trick you.";
        fileName = "family_photo.jpg";
        mimeType = "image/jpeg"; // Browser might try to detect, but we force this name
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const file = new File([blob], fileName, { type: mimeType, lastModified: Date.now() });
    onFileSelect(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4 text-slate-300">
          <FlaskConical className="h-5 w-5 text-purple-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider">Accuracy Verification Lab</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => createTestFile('safe')}
            disabled={isLoading}
            className="flex items-center gap-3 p-3 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="p-2 rounded bg-slate-800 group-hover:bg-emerald-500/20 text-emerald-400 transition-colors">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-mono">Test A</div>
              <div className="text-sm font-medium text-slate-200">Safe File</div>
            </div>
          </button>

          <button
            onClick={() => createTestFile('malware')}
            disabled={isLoading}
            className="flex items-center gap-3 p-3 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-rose-500/10 hover:border-rose-500/50 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="p-2 rounded bg-slate-800 group-hover:bg-rose-500/20 text-rose-400 transition-colors">
              <FileCode className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-mono">Test B</div>
              <div className="text-sm font-medium text-slate-200">Malware Script</div>
            </div>
          </button>

          <button
            onClick={() => createTestFile('spoof')}
            disabled={isLoading}
            className="flex items-center gap-3 p-3 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-amber-500/10 hover:border-amber-500/50 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="p-2 rounded bg-slate-800 group-hover:bg-amber-500/20 text-amber-400 transition-colors">
              <FileWarning className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-mono">Test C</div>
              <div className="text-sm font-medium text-slate-200">Spoofed Ext</div>
            </div>
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-3 text-center">
          Click to generate simulated files and check AI accuracy without risking real malware.
        </p>
      </div>
    </div>
  );
};

export default TestSamples;