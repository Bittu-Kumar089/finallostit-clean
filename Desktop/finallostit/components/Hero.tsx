
import React from 'react';
import { Search, ShieldCheck, Cloud, ArrowRight, Zap, Camera, CheckCircle, Users, Clock, QrCode, Wallet, Sparkles, Shield, Globe, Star } from 'lucide-react';
import { ViewState } from '../types';

interface HeroProps {
  onNavigate: (view: ViewState) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <div className="relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-100/30 blur-[150px] animate-pulse-soft"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-indigo-100/30 blur-[150px] animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* --- HERO HEADER SECTION --- */}
      <div className="relative z-10 pt-32 pb-20 md:pt-48 md:pb-40 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">

          {/* Text Content - Refined for better balance */}
          <div className="lg:col-span-5 text-center lg:text-left animate-reveal order-2 lg:order-1">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50/80 backdrop-blur-md border border-blue-100 text-blue-700 text-[11px] font-black uppercase tracking-[0.2em] mb-10 shadow-sm">
              <Sparkles className="h-4 w-4 mr-2.5 text-blue-600" />
              Intelligence Meets Community
            </div>
            <h1 className="text-5xl tracking-tighter font-black text-gray-900 sm:text-6xl lg:text-7xl mb-10 leading-[1.0]">
              Find what <br /> you <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">lost.</span>
            </h1>
            <p className="mt-4 text-xl text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Recover your belongings with high-precision AI visual matching and a secure community-driven network.
            </p>

            <div className="mt-14 flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <button
                onClick={() => onNavigate('REPORT_LOST')}
                className="group relative px-10 py-6 bg-gray-900 text-white font-black rounded-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] hover:-translate-y-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-100"
              >
                <span className="relative z-10 flex items-center justify-center text-lg uppercase tracking-wider">
                  Post Lost <ArrowRight className="ml-4 h-5 w-5 group-hover:translate-x-3 transition-transform" />
                </span>
              </button>

              <button
                onClick={() => onNavigate('REPORT_FOUND')}
                className="group px-10 py-6 bg-white/50 backdrop-blur-xl text-gray-900 border-2 border-white font-black rounded-3xl shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-50"
              >
                <span className="flex items-center justify-center text-lg uppercase tracking-wider">
                  I Found Item
                </span>
              </button>
            </div>

            <div className="mt-14 flex items-center justify-center lg:justify-start gap-6">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    className="inline-block h-12 w-12 rounded-full ring-4 ring-white shadow-xl hover:scale-125 hover:z-50 transition-all cursor-pointer"
                    src={`https://api.dicebear.com/9.x/avataaars/svg?seed=User${i}`}
                    alt="User"
                  />
                ))}
                <div className="flex items-center justify-center h-12 w-12 rounded-full ring-4 ring-white bg-indigo-600 text-white text-[10px] font-black tracking-tighter">1.2k+</div>
              </div>
              <div className="text-xs font-black text-gray-400 uppercase tracking-[0.15em]">Unified across campus regions</div>
            </div>
          </div>

          {/* Cinematic Visual - Medium-Large Scale (7 columns) */}
          <div className="mt-20 lg:mt-0 lg:col-span-7 relative animate-reveal order-1 lg:order-2" style={{ animationDelay: '0.3s' }}>
            <div className="relative rounded-[3.5rem] bg-gray-950 shadow-[0_100px_120px_-40px_rgba(0,0,0,0.6)] overflow-hidden p-4 animate-float border border-white/10 group">

              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 via-transparent to-indigo-600/30 z-20 pointer-events-none"></div>

              <div className="aspect-[16/10] rounded-[2.75rem] overflow-hidden relative z-10 bg-gray-900">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover opacity-100"
                >
                  <source src="/lost-found-story.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-20 bg-[length:100%_2px,3px_100%] opacity-20"></div>
              </div>

              {/* Floating UI Badges */}
              <div className="absolute -bottom-10 -left-6 bg-white/95 backdrop-blur-3xl border border-white p-7 rounded-[2.5rem] z-30 max-w-[320px] shadow-2xl animate-float hidden sm:block" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-6">
                  <div className="bg-blue-50 p-5 rounded-2xl">
                    <Search className="h-9 w-9 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-black text-base uppercase tracking-wider">Visual Scan</p>
                    <p className="text-gray-400 text-xs font-bold mt-1.5 uppercase tracking-widest">Neural Match Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- STATS SECTION --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass rounded-[3.5rem] border border-white/60 p-16 card-shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20 text-center">
            <div className="group">
              <div className="text-6xl font-black text-gray-900 mb-3 group-hover:scale-110 transition-transform tabular-nums">98<span className="text-blue-600">%</span></div>
              <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Recovery Rate</div>
            </div>
            <div className="group border-x border-gray-100 px-10">
              <div className="text-6xl font-black text-gray-900 mb-3 group-hover:scale-110 transition-transform tabular-nums">1.2<span className="text-indigo-600">k</span></div>
              <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Verified Users</div>
            </div>
            <div className="group">
              <div className="text-6xl font-black text-gray-900 mb-3 group-hover:scale-110 transition-transform tabular-nums">&lt;2<span className="text-violet-600">h</span></div>
              <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Mean Match Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- KEY PLATFORM FEATURES GRID --- */}
      <div className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-24 animate-reveal">
            <h2 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.4em] mb-6">Capabilities</h2>
            <h3 className="text-4xl font-black text-gray-900 sm:text-6xl tracking-tighter leading-[1.1]">Powerful features for <br /> high-trust recovery.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Feature Cards */}
            {[
              { icon: Cloud, title: "AWS Serverless", desc: "Backend powered by Python Lambda functions ensuring 99.9% uptime and scalability.", color: "blue" },
              { icon: Shield, title: "Secure Verification", desc: "Identity protection is priority. We mask personal details and use QR codes.", color: "indigo" },
              { icon: Zap, title: "Gemini AI Engine", desc: "Visual recognition auto-tags your lost items, making the search 10x faster.", color: "violet" },
              { icon: Camera, title: "Visual Search", desc: "Don't know how to describe it? Just upload a picture for neural matching.", color: "emerald" },
              { icon: Users, title: "Community Driven", desc: "A platform built for honesty. Karma points for finders and reputation system.", color: "amber" },
              { icon: Clock, title: "Instant Alerts", desc: "Get notified the second a matching item is posted by another user.", color: "rose" }
            ].map((f, i) => (
              <div key={i} className="group bg-white p-12 rounded-[3rem] border border-gray-100 card-shadow hover-lift transition-all">
                <div className={`w-16 h-16 bg-${f.color}-50 text-${f.color}-600 rounded-[1.5rem] flex items-center justify-center mb-10 shadow-sm group-hover:scale-110 group-hover:bg-${f.color}-600 group-hover:text-white transition-all duration-500`}>
                  <f.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- MERGED TESTIMONIALS & CTA SECTION --- */}
      <div className="relative py-32 mx-4 sm:mx-8 lg:mx-16 mb-32 rounded-[5rem] bg-gray-950 overflow-hidden shadow-[0_80px_120px_-30px_rgba(0,0,0,0.7)] border border-white/5">
        {/* Background Atmosphere */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-blue-600 blur-[200px] opacity-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] rounded-full bg-indigo-600 blur-[200px] opacity-10 -translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          {/* Integrated Testimonials */}
          <div className="text-center mb-24 animate-reveal">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tighter mb-16">People love getting their stuff back.</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-all duration-300 text-left">
                <div className="flex gap-1 mb-8">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-gray-300 text-base leading-relaxed italic mb-10 font-medium">
                  "I thought my laptop was gone forever. Someone uploaded a photo 20 minutes after I left it in the library. Unbelievable!"
                </p>
                <div className="flex items-center gap-4 pt-8 border-t border-white/5">
                  <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-lg">AB</div>
                  <div>
                    <h4 className="text-white font-black text-sm">Abhay</h4>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-wider">Student, Btech Dept</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-all duration-300 text-left">
                <div className="flex gap-1 mb-8">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-gray-300 text-base leading-relaxed italic mb-10 font-medium">
                  "The AI auto-tagging is crazy. I just took a pic of the keys I found, and it filled out the description for me. Super easy."
                </p>
                <div className="flex items-center gap-4 pt-8 border-t border-white/5">
                  <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-lg">NI</div>
                  <div>
                    <h4 className="text-white font-black text-sm">Nilesh</h4>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-wider">Student</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-all duration-300 text-left">
                <div className="flex gap-1 mb-8">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-gray-300 text-base leading-relaxed italic mb-10 font-medium">
                  "This is exactly what our office complex needed. No more messy email chains about lost mugs and chargers."
                </p>
                <div className="flex items-center gap-4 pt-8 border-t border-white/5">
                  <div className="h-12 w-12 rounded-full bg-violet-600 flex items-center justify-center text-white font-black text-lg">JA</div>
                  <div>
                    <h4 className="text-white font-black text-sm">Jay</h4>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-wider">Student</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA Action */}
          <div className="max-w-4xl mx-auto text-center pt-24 border-t border-white/10 animate-reveal">
            <h3 className="text-5xl sm:text-7xl font-black text-white mb-10 tracking-[-0.05em] leading-[0.9]">Take the friction <br /> out of lost items.</h3>
            <p className="text-gray-400 text-xl mb-16 max-w-2xl mx-auto font-medium">
              Join the high-trust network and help make our shared spaces more connected and honest.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <button
                onClick={() => onNavigate('REPORT_LOST')}
                className="group px-14 py-7 bg-white text-gray-900 font-black rounded-3xl shadow-2xl hover:scale-105 hover:bg-gray-100 transition-all focus:outline-none focus:ring-4 focus:ring-white/10 text-xl uppercase tracking-widest"
              >
                Start Reporting
              </button>
              <button
                onClick={() => onNavigate('GALLERY')}
                className="flex items-center gap-4 text-white font-black text-xl uppercase tracking-widest hover:text-blue-400 transition-colors"
              >
                Browse Feed <ArrowRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
