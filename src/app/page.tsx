'use client';

import { useState, useEffect, useRef } from 'react';
import { useScrollZ } from '@/hooks/useScrollZ';
import { useFeeds } from '@/hooks/useFeeds';
import PetitionCard from '@/components/PetitionCard';
import NewsCarousel from '@/components/NewsCarousel';
import LawmakerDashboard from '@/components/LawmakerDashboard';
import StatOrbiter from '@/components/StatOrbiter';
import AuthMonolith from '@/components/AuthMonolith';
import CommunityBubble from '@/components/CommunityBubble';
import OrbitalDashboard from '@/components/OrbitalDashboard';
import SpeedTunerHUD from '@/components/SpeedTunerHUD';

const TUNNEL_LENGTH = 11000;

const mockArticles = [
  { title: "Trump Administration Will Pay $1B to Block 2 Offshore Wind...", imageUrl: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800", source: "Environment", date: "2 hrs ago" },
  { title: "Why $4 Gasoline Is the Tipping Point for EVs", imageUrl: "https://images.unsplash.com/photo-1617788138017-8149eb4044a2?w=800", source: "Economy", date: "4 hrs ago" },
  { title: "CA Schools Move to Minimize César Chávez's Role in Civil...", imageUrl: "https://images.unsplash.com/photo-1577883256038-16b7e09ef96a?w=800", source: "Education", date: "6 hrs ago" },
  { title: "Global Summit Reaches Historic Agreement on Ocean Conservation", imageUrl: "https://images.unsplash.com/photo-1498623116890-37e912163d5d?w=800", source: "Global", date: "8 hrs ago" }
];

export default function Home() {
  const { currentZ, progress, addVelocity } = useScrollZ(TUNNEL_LENGTH);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  // Auto-scroll: plays the tunnel cinematically on load.
  // Stops permanently the instant the user scrolls manually.
  useEffect(() => {
    let animId: number;
    let stopped = false;

    let currentSpeeds = [7, 7, 7, 7];
    try {
      const stored = localStorage.getItem('tunnelSpeeds');
      if (stored) currentSpeeds = JSON.parse(stored);
    } catch (e) {}

    const handleSpeedChange = (e: any) => {
      currentSpeeds = e.detail;
    };
    window.addEventListener('tunnel-speed-change', handleSpeedChange);

    const stop = () => { stopped = true; };
    window.addEventListener('wheel', stop, { passive: true, once: true });
    window.addEventListener('touchstart', stop, { passive: true, once: true });
    window.addEventListener('keydown', stop, { once: true });

    const tick = () => {
      if (stopped || progressRef.current >= 0.94) return;
      
      let speedIdx = 0;
      if (progressRef.current > 7500 / TUNNEL_LENGTH) speedIdx = 3;
      else if (progressRef.current > 5000 / TUNNEL_LENGTH) speedIdx = 2;
      else if (progressRef.current > 2500 / TUNNEL_LENGTH) speedIdx = 1;
      
      const speed = currentSpeeds[speedIdx];
      
      if (speed > 0) {
        if (addVelocity) addVelocity(speed);
        else window.scrollBy(0, speed);
      }
      
      animId = requestAnimationFrame(tick);
    };

    // Brief pause lets the page settle before starting.
    const timer = setTimeout(() => { animId = requestAnimationFrame(tick); }, 600);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animId);
      window.removeEventListener('tunnel-speed-change', handleSpeedChange);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
      window.removeEventListener('keydown', stop);
    };
  }, []); // Only runs on initial mount

  // Math for component opacities and scales
  const getCardStyle = (zPos: number, scaleMultiplier = 1) => {
    const dist = currentZ - Math.abs(zPos);
    let opacity = 0;
    let yOffset = 0;
    let zDepthScale = 1;

    if (dist > 300) {
      opacity = 0;
    } else if (dist > 0) {
      opacity = 1 - (dist / 300);
      zDepthScale = 1 + (dist / 1000);
    } else if (dist < -3500) {
      opacity = 0;
      yOffset = 40;
    } else {
      const revealProgress = (3500 - Math.abs(dist)) / 3500;
      opacity = Math.pow(revealProgress, 3);
      yOffset = 40 * (1 - revealProgress);
      zDepthScale = 0.85 + (revealProgress * 0.15);
    }

    return {
      opacity: Math.max(0, Math.min(1, opacity)).toFixed(3),
      transform: opacity > 0 ? `translateY(${yOffset}px) scale(${zDepthScale * scaleMultiplier})` : undefined,
    };
  };

  const getLayerStyle = (zPos: number, scaleMultiplier = 1) => {
    return {
      transform: `translateZ(${zPos}px)`,
      opacity: getCardStyle(zPos, scaleMultiplier).opacity,
    };
  };

  return (
    <main className="min-h-[900vh] bg-[#FAFAFD]">
      <SpeedTunerHUD />
      
      {/* Fixed Navigation HUD */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-3xl border-b border-black/10 bg-white/40 shadow-sm transition-all duration-300">
        <div className="flex justify-between items-center px-4 md:px-8 py-3 max-w-[1400px] mx-auto">
          <div 
            className="flex items-center gap-2 md:gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {/* Real Causes logo — icon+wordmark lockup */}
            <img src="/causes-logo.svg" alt="Causes" className="h-8 md:h-10 w-auto transition-transform group-hover:scale-105" />
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-semibold text-gray-700 text-[15px]">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">News</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Community</span>
            <a
              href="/amplify"
              className="relative group"
            >
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#2B388F] to-[#E72428] opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
              <span className="relative bg-black text-white text-sm font-bold px-4 py-1.5 rounded-full tracking-wide hover:bg-gray-900 transition-colors block">
                Amplify ⚡
              </span>
            </a>
            
            <div className="w-[1px] h-6 bg-gray-300 mx-2"></div>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-5">
                <div className="relative cursor-pointer hover:text-blue-600 transition-colors">
                  <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">4</span>
                </div>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-full transition-colors" onClick={() => setIsAuthenticated(false)}>
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">G</div>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <button onClick={() => setIsAuthenticated(true)} className="hover:text-blue-600 transition-colors">Login</button>
                <button onClick={() => setIsAuthenticated(true)} className="px-6 py-2.5 rounded-full border border-gray-300 hover:border-[#2B388F] hover:text-[#2B388F] font-bold transition-colors">Join Us</button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden flex items-center">
            <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </div>
        </div>
      </header>

      {/* Gateway Hero Section (Translates slightly away) */}
      <div 
        className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center pointer-events-none"
        style={{
          transform: `translateZ(${-100 + currentZ * 0.5}px)`,
          opacity: Math.max(0, 1 - (currentZ / 1500)),
          background: isAuthenticated ? 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=2000) center/cover' : 'linear-gradient(to bottom, #FAFAFD, #EAE6FE)',
          zIndex: 1
        }}
      >
        <div className="max-w-4xl text-center px-6 mt-20">
          <h1 className={`text-5xl md:text-8xl font-extrabold tracking-tighter mb-4 md:mb-6 ${isAuthenticated ? 'text-white drop-shadow-2xl' : 'text-slate-900'} whitespace-pre-wrap`}>
            {isAuthenticated ? 'News Feed' : 'We the People,\nIn Action'}
          </h1>
          <p className={`text-lg md:text-2xl font-medium mb-8 md:mb-12 ${isAuthenticated ? 'text-white/90 drop-shadow-md' : 'text-slate-600'}`}>
            {isAuthenticated ? 'This feed aggregates stories from across all Causes feeds.' : 'Discover petitions — collective action, one signature at a time.'}
          </p>
          
          <button className={`px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-base md:text-lg shadow-lg pointer-events-auto transition-transform hover:scale-105 ${isAuthenticated ? 'bg-white text-slate-900 border border-transparent' : 'bg-[#2B388F] text-white'}`}>
            {isAuthenticated ? 'Follow More Topics' : 'Explore More Petitions'}
          </button>
        </div>
      </div>

      {/* 3D Scene Container */}
      <div className="fixed top-0 left-0 w-[100vw] h-[100vh] overflow-hidden pointer-events-none" style={{ perspective: '1200px', zIndex: 10 }}>
        <div className="absolute top-0 left-0 w-full h-full" style={{ transformStyle: 'preserve-3d', willChange: 'transform', transform: `translateZ(${currentZ}px)` }}>
          
          <div className="absolute w-[200vw] h-[200vh] opacity-50 pointer-events-none dust-layer" style={{ transform: 'translateZ(-1000px)' }}></div>

          {/* Stats Orbiters */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity', ...getLayerStyle(-400) }}>
            <div style={{ transform: `${getCardStyle(-400).transform} translateX(-35vw) translateY(-25vh)` }} className="pointer-events-auto hidden md:block">
              <StatOrbiter label="Members" value="325K+" />
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity', ...getLayerStyle(-600) }}>
            <div style={{ transform: `${getCardStyle(-600).transform} translateX(30vw) translateY(20vh)` }} className="pointer-events-auto hidden md:block">
              <StatOrbiter label="Raised" value="$50M+" />
            </div>
          </div>

          {/* Layer 1: BLUE (Petitions) */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(0px)' }}>
            <div className="absolute flex items-center justify-center ring-shadow-wrapper">
              <div className="w-full h-full rounded-full ring-graphic" style={{ borderColor: '#2B388F' }}></div>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity', ...getLayerStyle(-800) }}>
            <div style={{ transform: getCardStyle(-800).transform }} className="pointer-events-auto">
              <PetitionCard 
                title="Stop Protecting the Powerful. Release Every Epstein File. UNREDACTED."
                organization="Causes Petitions"
                date="2/18/2026"
                image="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800"
                signatureCount={145829}
              />
            </div>
          </div>

          {/* Layer 2: RED (News) */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(-2500px)' }}>
            <div className="absolute flex items-center justify-center ring-shadow-wrapper">
              <div className="w-full h-full rounded-full ring-graphic" style={{ borderColor: '#E72428' }}></div>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity', ...getLayerStyle(-3300) }}>
            <div style={{ transform: getCardStyle(-3300).transform }} className="pointer-events-auto flex flex-col items-center">
              <div className="text-center mb-8 text-black text-5xl font-extrabold tracking-tight bg-white/50 backdrop-blur-md px-10 py-4 rounded-full border border-white/40 shadow-xl">Latest News Focus</div>
              <NewsCarousel articles={mockArticles} />
            </div>
          </div>

          {/* Layer 3: YELLOW (Community Echo) */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(-5000px)' }}>
            <div className="absolute flex items-center justify-center ring-shadow-wrapper">
              <div className="w-full h-full rounded-full ring-graphic" style={{ borderColor: '#F8D116' }}></div>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity', ...getLayerStyle(-5500) }}>
            <div style={{ transform: `${getCardStyle(-5500).transform} translateX(-20vw) translateY(-10vh)` }} className="pointer-events-auto">
              <CommunityBubble user="Sarah J." avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" message="This is critical for our local parks. Please sign!" likes={124} />
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity', ...getLayerStyle(-5800) }}>
            <div style={{ transform: `${getCardStyle(-5800).transform} translateX(15vw) translateY(15vh)` }} className="pointer-events-auto">
              <CommunityBubble user="Marcus T." avatar="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150" message="I called my rep today and they actually answered! Keep going." likes={892} />
            </div>
          </div>

          {/* Layer 4: GREEN (Lawmakers) */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(-7500px)' }}>
            <div className="absolute flex items-center justify-center ring-shadow-wrapper">
              <div className="w-full h-full rounded-full ring-graphic" style={{ borderColor: '#1A8641' }}></div>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity', ...getLayerStyle(-8000) }}>
            <div style={{ transform: getCardStyle(-8000).transform }} className="pointer-events-auto">
              <LawmakerDashboard />
            </div>
          </div>

          {/* Auth Monolith Gate */}
          {!isAuthenticated && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity', zIndex: 50, ...getLayerStyle(-9500) }}>
              <div style={{ transform: getCardStyle(-9500).transform }} className="pointer-events-auto">
                <AuthMonolith onAuthenticate={() => setIsAuthenticated(true)} />
              </div>
            </div>
          )}

          {/* Final Destination Core — glowing portal opening */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none" style={{ 
            transformStyle: 'preserve-3d', 
            transform: 'translateZ(-10500px)',
            opacity: Math.max(0, 1 - Math.max(0, currentZ - 8500) / 1000)
          }}>
            <div className="w-[50vmax] h-[50vmax] rounded-full" style={{ background: 'radial-gradient(circle, #ffffff 0%, rgba(255,255,255,0.95) 30%, rgba(255,255,255,0) 70%)', boxShadow: '0 0 150px 100px rgba(255,255,255,0.8)'}} />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center transition-opacity duration-500 ${progress > 0.02 ? 'opacity-0' : 'opacity-100'} pointer-events-none`}>
        <span className="text-xs font-bold tracking-widest text-[#2B388F] uppercase mb-2 drop-shadow-sm bg-white/50 px-3 py-1 rounded-full backdrop-blur-md border border-white/50">Scroll to Navigate</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#2B388F] to-transparent"></div>
      </div>

      {/* ACT 2: Orbital Dashboard */}
      <div
        className="fixed inset-0 z-40 flex flex-col transition-all duration-700"
        style={{
          opacity: progress > 0.94 ? 1 : 0,
          pointerEvents: progress > 0.94 ? 'auto' : 'none',
          transform: `translateY(${progress > 0.94 ? '0' : '40px'})`,
          background: '#FAFAFD',
        }}
      >
        <div className="backdrop-blur-3xl border-b border-black/10 bg-white/80 shadow-sm flex items-center justify-between px-6 py-3 flex-shrink-0">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/causes-logo.svg" alt="Causes" className="h-8 w-auto" />
          </div>
          <div className="flex items-center gap-6 text-sm font-semibold text-gray-600">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-slate-500 hover:text-[#2B388F] transition-colors">
              ← Re-enter Tunnel
            </button>
            <div className="w-px h-5 bg-gray-200" />
            {isAuthenticated ? (
              <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-2 text-slate-600 hover:text-red-500 transition-colors">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">G</div>
                Logout
              </button>
            ) : (
              <button onClick={() => setIsAuthenticated(true)} className="bg-[#2B388F] text-white px-5 py-2 rounded-full font-bold hover:bg-indigo-700 transition-colors">
                Join Us
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <OrbitalDashboard
            isAuthenticated={isAuthenticated}
            onAuthenticate={() => setIsAuthenticated(true)}
            onLogout={() => setIsAuthenticated(false)}
          />
        </div>
      </div>
    </main>

  );
}
