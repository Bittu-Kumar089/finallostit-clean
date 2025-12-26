import React from 'react';
import { ShieldCheck, Lock, Download, Box } from 'lucide-react';

interface NavbarProps {
  onOpenExtension: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenExtension }) => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>, id: string) => {
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

  return (
    <nav className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={(e) => handleScroll(e, 'top')}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-slate-900 p-2 rounded-lg border border-slate-800">
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                FileGuard
              </h1>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#scanner" onClick={(e) => handleScroll(e, 'scanner')} className="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors">Scanner</a>
            <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors">Features</a>
            <a href="#how-it-works" onClick={(e) => handleScroll(e, 'how-it-works')} className="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors">How it Works</a>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={onOpenExtension}
              className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-all hover:border-emerald-500/50"
            >
              <Box className="h-3.5 w-3.5" />
              <span>Get Extension</span>
            </button>

            <div className="flex items-center text-xs text-emerald-500/80 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <Lock className="h-3 w-3 mr-1.5" />
              <span className="font-medium">SECURE</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
