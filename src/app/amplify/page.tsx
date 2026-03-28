'use client';

import { useState, useEffect, useRef } from 'react';
import { useScrollZ } from '@/hooks/useScrollZ';
import SpeedTunerHUD from '@/components/SpeedTunerHUD';

const TUNNEL_LENGTH = 11000;

const RING_COLORS = ['#2B388F', '#E72428', '#F8D116', '#1A8641'];

// Amplify tunnel stations — mapped to the same ring Z-coordinates as home page
const AMPLIFY_LAYERS = [
  {
    z: -2000,
    ringIndex: 0, // Blue
    label: 'SIGNAL',
    icon: '📡',
    headline: 'Content That Moves People',
    sub: 'Long-form speeches, ads, and interviews become optimized short clips — distributed across every major platform.',
  },
  {
    z: -4500,
    ringIndex: 1, // Red
    label: 'NETWORK',
    icon: '🕸️',
    headline: 'Hundreds of Real Creators. One Mission.',
    sub: 'A curated, vetted creator network activates simultaneously — posting, promoting, and engaging with approved content organically.',
  },
  {
    z: -6500,
    ringIndex: 2, // Yellow
    label: 'REACH',
    icon: '🚀',
    headline: 'Hundreds of Millions of Views',
    sub: 'TikTok. Instagram Reels. YouTube Shorts. Facebook. X. Real reach across every platform — without a single ad auction.',
  },
  {
    z: -8500,
    ringIndex: 3, // Green
    label: 'WIN 2026',
    icon: '🗳️',
    headline: 'Built for the 2026 Midterms',
    sub: 'Move early. Build infrastructure. Pay for performance. Reach persuadable audiences with authentic, peer-to-peer content.',
  },
];

const STATS = [
  { v: '100M+', l: 'Views Delivered' },
  { v: '10x', l: 'Lower CPM' },
  { v: '500+', l: 'Mission-Aligned Creators' },
  { v: '6', l: 'Platforms' },
];

export default function AmplifyPage() {
  const { currentZ, progress, addVelocity } = useScrollZ(TUNNEL_LENGTH);
  const progressRef = useRef(progress);
  progressRef.current = progress;

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
      if (stopped || progressRef.current >= 0.92) return;
      
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

    const timer = setTimeout(() => { animId = requestAnimationFrame(tick); }, 800);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animId);
      window.removeEventListener('tunnel-speed-change', handleSpeedChange);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
      window.removeEventListener('keydown', stop);
    };
  }, []);

  // New "Pushed Forward" assembly flight trajectory
  const getFlyingCardStyle = (anchorZ: number, xOffset: string, yOffset: string, scaleMultiplier = 1) => {
    // 1. Calculate how far the camera is from the native anchor
    const rawDist = currentZ + anchorZ; // e.g., 0 + -800 = -800. 800 + -800 = 0.
    let opacity = 0;
    
    // 2. Fly parameters
    // The card sits still until the camera is getting close (PUSH_START pixels away).
    // Then it shoots forward into the tunnel to the core.
    const PUSH_START = 800; 
    const PUSH_DURATION = 4000; // finishes flight 4000 px later
    const endWorldZ = -9500;

    let easedPush = 0;

    // 3. Visibility checking
    if (rawDist > -3500) { 
      // Fade in smoothly when 3500px away
      if (rawDist < -2500) opacity = (rawDist + 3500) / 1000;
      else opacity = 1;

      // 4. Calculate PUSH if close enough
      // The push triggers when rawDist > -PUSH_START.
      if (rawDist > -PUSH_START) {
        const pushProgress = Math.min(1, Math.max(0, (rawDist + PUSH_START) / PUSH_DURATION));
        easedPush = pushProgress * pushProgress * (3 - 2 * pushProgress); 
      }
    }

    const worldZ = anchorZ + (endWorldZ - anchorZ) * easedPush;
    const absoluteDist = currentZ + worldZ;

    // 5. Fade out if camera passes it (only possible at the very end of the tunnel)
    if (absoluteDist > 0) {
      opacity = Math.max(0, 1 - (absoluteDist / 800));
    }

    return {
      transform: `translateZ(${worldZ}px) translateX(${xOffset}) translateY(${yOffset}) scale(${scaleMultiplier})`,
      opacity: opacity.toFixed(3),
    };
  };

  return (
    <main className="min-h-[900vh] bg-[#FAFAFD]">
      <SpeedTunerHUD />

      {/* Fixed Nav — hidden during flight unless hovered */}
      <div className={`fixed top-0 w-full z-50 group/nav transition-opacity duration-500 ${progress > 0.92 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="absolute top-0 w-full h-16 bg-transparent" />
        <header className="relative w-full backdrop-blur-3xl border-b border-black/10 bg-white/40 shadow-sm transition-transform duration-500 -translate-y-full group-hover/nav:translate-y-0">
          <div className="flex justify-between items-center px-6 py-3 max-w-[1400px] mx-auto">
            <a href="/" className="flex items-center gap-3 group">
              <img src="/causes-logo.svg" alt="Causes" className="h-8 md:h-10 w-auto transition-transform group-hover:scale-105" />
            </a>
            <div className="flex items-center gap-6 text-sm font-semibold">
              <a href="/" className="text-slate-500 hover:text-[#2B388F] transition-colors">← Main Site</a>
              <span className="text-gray-300">|</span>
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#2B388F] to-[#E72428] opacity-60 blur-sm" />
                <span className="relative bg-white text-slate-900 font-black text-sm px-4 py-1.5 rounded-full border border-gray-200 block">
                  Causes Amplify ⚡
                </span>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* 3D Scene Container */}
      <div className="fixed top-0 left-0 w-[100vw] h-[100vh] overflow-hidden pointer-events-none" style={{ perspective: '1200px', zIndex: 10 }}>
        <div className="absolute top-0 left-0 w-full h-full" style={{ transformStyle: 'preserve-3d', willChange: 'transform', transform: `translateZ(${currentZ}px)` }}>
          
          <div className="absolute w-[200vw] h-[200vh] opacity-50 pointer-events-none dust-layer" style={{ transform: 'translateZ(-1000px)' }}></div>

          {/* Hero — Tunnel Entry */}
          <div
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none"
            style={{ 
              transformStyle: 'preserve-3d',
              willChange: 'transform, opacity',
              transform: `translateZ(${-100 + currentZ * 0.5}px)`,
              opacity: Math.max(0, 1 - (currentZ / 1500))
            }}
          >
            <div className="text-center px-6 max-w-4xl">
              <img src="/causes-logo.svg" alt="Causes" className="h-12 md:h-16 w-auto mx-auto mb-8" />
              <div className="inline-flex items-center gap-2 bg-white/60 border border-[#2B388F]/20 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm shadow-sm pointer-events-auto">
                <div className="w-2 h-2 rounded-full bg-[#E72428] animate-pulse" />
                <span className="text-[#2B388F] text-xs font-black uppercase tracking-widest">2026 Election Cycle</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-6 text-shadow-sm">
                Causes{' '}
                <span className="bg-gradient-to-r from-[#2B388F] via-[#E72428] to-[#F8D116] bg-clip-text text-transparent">
                  Amplify
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
                A distributed, mission-aligned social reach engine for democratic campaigns, PACs, and advocacy organizations.
              </p>
            </div>
          </div>

          {/* Layer 1: BLUE (SIGNAL) */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(0px)' }}>
            <div className="absolute flex items-center justify-center ring-shadow-wrapper">
              <div className="w-full h-full rounded-full ring-graphic" style={{ borderColor: '#2B388F' }}></div>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}>
            <div style={getFlyingCardStyle(-800, '-25vw', '-15vh')} className="pointer-events-auto">
              <div className="max-w-2xl w-full mx-6 rounded-3xl p-8 md:p-12 bg-white/70 backdrop-blur-2xl border relative overflow-hidden shadow-2xl transition-shadow hover:shadow-3xl" style={{ borderColor: '#2B388F30' }}>
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-[#2B388F]" />
                <div className="flex items-start gap-6">
                  <div className="text-4xl w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner bg-[#2B388F15]">📡</div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest mb-2 block text-[#2B388F]">SIGNAL</span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-3">Content That Moves People</h2>
                    <p className="text-slate-600 leading-relaxed text-base">Long-form speeches, ads, and interviews become optimized short clips — distributed across every major platform.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Layer 2: RED (NETWORK) */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(-2500px)' }}>
            <div className="absolute flex items-center justify-center ring-shadow-wrapper">
              <div className="w-full h-full rounded-full ring-graphic" style={{ borderColor: '#E72428' }}></div>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}>
            <div style={getFlyingCardStyle(-3300, '25vw', '10vh')} className="pointer-events-auto flex flex-col items-center">
              <div className="max-w-2xl w-full mx-6 rounded-3xl p-8 md:p-12 bg-white/70 backdrop-blur-2xl border relative overflow-hidden shadow-2xl transition-shadow hover:shadow-3xl" style={{ borderColor: '#E7242830' }}>
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-[#E72428]" />
                <div className="flex items-start gap-6">
                  <div className="text-4xl w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner bg-[#E7242815]">🕸️</div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest mb-2 block text-[#E72428]">NETWORK</span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-3">Hundreds of Real Creators. One Mission.</h2>
                    <p className="text-slate-600 leading-relaxed text-base">A curated, vetted creator network activates simultaneously — posting, promoting, and engaging with approved content organically.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Layer 3: YELLOW (REACH) */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(-5000px)' }}>
            <div className="absolute flex items-center justify-center ring-shadow-wrapper">
              <div className="w-full h-full rounded-full ring-graphic" style={{ borderColor: '#F8D116' }}></div>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}>
            <div style={getFlyingCardStyle(-5800, '-20vw', '25vh')} className="pointer-events-auto">
              <div className="max-w-2xl w-full mx-6 rounded-3xl p-8 md:p-12 bg-white/70 backdrop-blur-2xl border relative overflow-hidden shadow-2xl transition-shadow hover:shadow-3xl" style={{ borderColor: '#F8D11630' }}>
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-[#F8D116]" />
                <div className="flex items-start gap-6">
                  <div className="text-4xl w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner bg-[#F8D11615]">🚀</div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest mb-2 block text-[#F8D116]">REACH</span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-3">Hundreds of Millions of Views</h2>
                    <p className="text-slate-600 leading-relaxed text-base">TikTok. Instagram Reels. YouTube Shorts. Facebook. X. Real reach across every platform — without a single ad auction.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Layer 4: GREEN (WIN 2026) */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(-7500px)' }}>
            <div className="absolute flex items-center justify-center ring-shadow-wrapper">
              <div className="w-full h-full rounded-full ring-graphic" style={{ borderColor: '#1A8641' }}></div>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}>
            <div style={getFlyingCardStyle(-8000, '15vw', '-25vh')} className="pointer-events-auto">
              <div className="max-w-2xl w-full mx-6 rounded-3xl p-8 md:p-12 bg-white/70 backdrop-blur-2xl border relative overflow-hidden shadow-2xl transition-shadow hover:shadow-3xl" style={{ borderColor: '#1A864130' }}>
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-[#1A8641]" />
                <div className="flex items-start gap-6">
                  <div className="text-4xl w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner bg-[#1A864115]">🗳️</div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest mb-2 block text-[#1A8641]">WIN 2026</span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-3">Built for the Midterms</h2>
                    <p className="text-slate-600 leading-relaxed text-base">Move early. Build infrastructure. Pay for performance. Reach persuadable audiences with authentic, peer-to-peer content.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center transition-opacity duration-500 ${progress > 0.02 ? 'opacity-0' : 'opacity-100'} pointer-events-none`}>
        <span className="text-xs font-bold tracking-widest text-[#2B388F] uppercase mb-2 drop-shadow-sm bg-white/50 px-3 py-1 rounded-full backdrop-blur-md border border-white/50">Scroll to Explore</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#2B388F] to-transparent" />
      </div>

      {/* ACT 2: Amplify Dashboard — Civic Clarity light mode */}
      <div
        className="fixed inset-0 z-40 flex flex-col transition-all duration-700"
        style={{
          opacity: progress > 0.92 ? 1 : 0,
          pointerEvents: progress > 0.92 ? 'auto' : 'none',
          transform: `translateY(${progress > 0.92 ? '0' : '40px'})`,
          background: '#FAFAFD',
        }}
      >
        {/* Dashboard Nav */}
        <div className="backdrop-blur-3xl border-b border-black/10 bg-white/80 shadow-sm flex items-center justify-between px-6 py-3 flex-shrink-0">
          <img src="/causes-logo.svg" alt="Causes" className="h-8 w-auto" />
          <div className="flex items-center gap-6 text-sm font-semibold">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-slate-500 hover:text-[#2B388F] transition-colors">
              ← Re-enter Tunnel
            </button>
            <a href="/" className="text-slate-500 hover:text-[#2B388F] transition-colors">Main Site</a>
            <button className="bg-gradient-to-r from-[#2B388F] to-[#E72428] text-white px-5 py-2 rounded-full font-bold hover:opacity-90 transition-opacity">
              Request Access →
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-6 py-10">

            {/* Hero */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-[#EEF0FA] rounded-full px-4 py-1.5 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#E72428] animate-pulse" />
                <span className="text-[#2B388F] text-xs font-black uppercase tracking-widest">Mission-Aligned Partners Only</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4">
                The Modern Answer to<br />
                <span className="bg-gradient-to-r from-[#2B388F] via-[#E72428] to-[#F8D116] bg-clip-text text-transparent">
                  Breaking Through Noise
                </span>
              </h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
                Authentic, creator-driven social reach. Performance-based economics. A strategic advantage for the 2026 election cycle.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {STATS.map(s => (
                <div key={s.l} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
                  <div className="text-3xl font-black text-[#2B388F] tracking-tighter mb-1">{s.v}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400">{s.l}</div>
                </div>
              ))}
            </div>

            {/* Traditional vs Amplify */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2B388F] via-[#E72428] to-[#1A8641]" />
              <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">The Core Idea: Digital Field Organizers</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="text-[#E72428] font-black text-xs uppercase tracking-widest mb-4">Traditional Paid Media</div>
                  {['Pay premium CPMs directly to social platforms', 'Compete in saturated ad auctions', 'Rely solely on centralized paid reach', 'Fight against algorithms'].map(item => (
                    <div key={item} className="flex items-center gap-3 mb-3">
                      <span className="text-[#E72428] font-bold">✗</span>
                      <span className="text-slate-500 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-[#EEF0FA] rounded-2xl p-6">
                  <div className="text-[#2B388F] font-black text-xs uppercase tracking-widest mb-4">Causes Amplify</div>
                  {['Distribute through real people, real accounts, real communities', 'Pay for quality outcomes — not just impressions', 'Achieve organic reach at scale', 'Work with algorithms, not against them'].map(item => (
                    <div key={item} className="flex items-center gap-3 mb-3">
                      <span className="text-[#1A8641] font-bold">✓</span>
                      <span className="text-slate-700 text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[
                { color: '#2B388F', title: 'Micro-Influencer Distribution', desc: 'Campaigns provide source video. We clip, optimize, and distribute through hundreds of creator accounts simultaneously — generating algorithmic momentum and authentic reach at scale.' },
                { color: '#E72428', title: 'Owned Influencer Networks', desc: 'We recruit, train, and onboard mission-aligned creators for your organization. Build durable distribution infrastructure that compounds in value well beyond a single election cycle.' },
              ].map((uc) => (
                <div key={uc.title} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: uc.color }} />
                  <div className="w-3 h-3 rounded-full mb-4" style={{ background: uc.color }} />
                  <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{uc.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{uc.desc}</p>
                </div>
              ))}
            </div>

            {/* Who This Is For */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-8">
              <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Who This Is For</h3>
              <div className="grid md:grid-cols-3 gap-3">
                {['Federal, State & Local Campaigns', 'PACs, Super PACs & C4 Organizations', 'Advocacy Nonprofits & Issue Coalitions', 'Values-Aligned Brands', 'Media Properties & Publishers', 'Democratic-Aligned Organizations'].map(item => (
                  <div key={item} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                    <div className="w-2 h-2 rounded-full bg-[#2B388F] flex-shrink-0" />
                    <span className="text-slate-700 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-slate-400 text-sm mt-4 italic">Access is initially limited due to capacity and quality requirements.</p>
            </div>

            {/* CTA */}
            <div className="text-center py-8">
              <div className="inline-block relative max-w-xl w-full">
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#2B388F] via-[#E72428] to-[#F8D116] opacity-15 blur-xl" />
                <div className="relative bg-white border border-gray-100 rounded-3xl p-10 shadow-xl">
                  <img src="/causes-logo.svg" alt="Causes" className="h-8 w-auto mx-auto mb-6" />
                  <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Ready to Amplify Your Mission?</h3>
                  <p className="text-slate-500 mb-6 leading-relaxed text-sm">Offered under the Causes.com brand. Resold and supported by ConnectBlue. Available to select, mission-aligned partners only.</p>
                  <button className="w-full bg-gradient-to-r from-[#2B388F] to-[#E72428] text-white font-black py-4 rounded-2xl text-lg hover:opacity-90 transition-opacity">
                    Request Access →
                  </button>
                  <p className="text-slate-400 text-xs mt-4">Federal & state campaigns · PACs · Nonprofits · Values-aligned brands</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </main>
  );
}
