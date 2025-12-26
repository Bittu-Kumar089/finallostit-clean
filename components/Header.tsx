
import React, { useState, useEffect } from 'react';
import { MapPin, Menu, X, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { ViewState, User } from '../types';

interface HeaderProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, user, onLoginClick, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClass = (view: ViewState) => 
    `cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      currentView === view 
        ? 'bg-blue-600 text-white shadow-md transform scale-105' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  const handleLogoKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onNavigate('HOME');
    }
  };

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled || isMenuOpen ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200/50' : 'bg-transparent'
      }`}
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div 
            className="flex items-center cursor-pointer group outline-none" 
            onClick={() => onNavigate('HOME')}
            onKeyDown={handleLogoKeyDown}
            role="button"
            tabIndex={0}
            aria-label="LOSTit Home"
          >
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg group-hover:shadow-blue-500/30 transition-shadow duration-300">
                <MapPin className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                LOST<span className="text-blue-600">it</span>
              </span>
            </div>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-2" role="menubar">
            <button onClick={() => onNavigate('HOME')} className={navClass('HOME')} role="menuitem">Home</button>
            <button onClick={() => onNavigate('GALLERY')} className={navClass('GALLERY')} role="menuitem">Gallery</button>
            <div className="h-6 w-px bg-gray-300 mx-2" aria-hidden="true"></div>
            <button onClick={() => onNavigate('REPORT_LOST')} className={navClass('REPORT_LOST')} role="menuitem">I Lost Something</button>
            <button onClick={() => onNavigate('REPORT_FOUND')} className={navClass('REPORT_FOUND')} role="menuitem">I Found Something</button>
            
            <div className="h-6 w-px bg-gray-300 mx-2" aria-hidden="true"></div>
            
            {user ? (
              <div className="flex items-center gap-3 ml-2">
                <button 
                  onClick={() => onNavigate('PROFILE')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${currentView === 'PROFILE' ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' : 'bg-gray-100 border-gray-200 hover:bg-gray-200'}`}
                  role="menuitem"
                  aria-label={`Go to profile of ${user.email}`}
                >
                  <div className="bg-blue-100 p-1.5 rounded-full" aria-hidden="true">
                    <UserIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 max-w-[150px] truncate">{user.email}</span>
                </button>
                <button 
                  onClick={onLogout}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <button 
                onClick={onLoginClick} 
                className="ml-2 flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold bg-gray-900 text-white shadow-lg hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                aria-label="Sign In"
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                Sign In
              </button>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={isMenuOpen}
              aria-label="Toggle main menu"
            >
              {isMenuOpen ? <X className="block h-6 w-6" aria-hidden="true" /> : <Menu className="block h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg" role="menu">
          <div className="pt-4 pb-6 space-y-2 px-4">
            <button onClick={() => { onNavigate('HOME'); setIsMenuOpen(false); }} className={`block w-full text-left ${navClass('HOME')}`} role="menuitem">Home</button>
            <button onClick={() => { onNavigate('GALLERY'); setIsMenuOpen(false); }} className={`block w-full text-left ${navClass('GALLERY')}`} role="menuitem">Gallery</button>
            <hr className="my-2 border-gray-100" />
            <button onClick={() => { onNavigate('REPORT_LOST'); setIsMenuOpen(false); }} className={`block w-full text-left ${navClass('REPORT_LOST')}`} role="menuitem">Report Lost Item</button>
            <button onClick={() => { onNavigate('REPORT_FOUND'); setIsMenuOpen(false); }} className={`block w-full text-left ${navClass('REPORT_FOUND')}`} role="menuitem">Report Found Item</button>
            <hr className="my-2 border-gray-100" />
            
            {user ? (
              <div className="px-4 py-2">
                 <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                   <div className="flex items-center gap-2 text-gray-700">
                     <UserIcon className="h-5 w-5 text-blue-600" aria-hidden="true" />
                     <div className="flex-1 min-w-0">
                       <p className="text-xs text-gray-500 mb-0.5">Signed in as</p>
                       <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                     </div>
                   </div>
                 </div>
                 <button 
                    onClick={() => { onNavigate('PROFILE'); setIsMenuOpen(false); }}
                    className="flex items-center gap-2 mb-2 text-gray-900 font-medium w-full text-left py-2 hover:bg-gray-50 rounded-lg px-2"
                 >
                    <UserIcon className="h-5 w-5" aria-hidden="true" />
                    My Profile
                 </button>
                 <button 
                  onClick={() => { onLogout(); setIsMenuOpen(false); }}
                  className="w-full text-left flex items-center gap-2 text-red-600 font-medium py-2 hover:bg-red-50 rounded-lg px-2 focus:outline-none focus:text-red-800"
                  role="menuitem"
                >
                  <LogOut className="h-5 w-5" aria-hidden="true" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { onLoginClick(); setIsMenuOpen(false); }}
                className="w-full block text-center py-3 rounded-lg bg-gray-900 text-white font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                role="menuitem"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
