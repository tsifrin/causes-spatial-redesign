'use client';

import { useState, useEffect } from 'react';

// Default speeds for the 4 zones (Blue, Red, Yellow, Green)
const DEFAULT_SPEEDS = [7, 7, 7, 7];

export default function SpeedTunerHUD() {
  const [speeds, setSpeeds] = useState(DEFAULT_SPEEDS);
  const [isOpen, setIsOpen] = useState(true);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('tunnelSpeeds');
      if (stored) {
        setSpeeds(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const updateSpeed = (index: number, val: number) => {
    const newSpeeds = [...speeds];
    newSpeeds[index] = val;
    setSpeeds(newSpeeds);
    localStorage.setItem('tunnelSpeeds', JSON.stringify(newSpeeds));
    // Dispatch global event so the animation loops can grab the new speeds instantly
    window.dispatchEvent(new CustomEvent('tunnel-speed-change', { detail: newSpeeds }));
  };

  const zones = [
    { name: 'Blue Ring Space', color: '#2B388F' },
    { name: 'Red Ring Space', color: '#E72428' },
    { name: 'Yellow Ring Space', color: '#F8D116' },
    { name: 'Green Ring Space', color: '#1A8641' },
  ];

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-[9999] bg-[#2B388F] text-white px-4 py-2 rounded-full font-bold shadow-xl opacity-50 hover:opacity-100"
      >
        Tune Speeds
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-gray-200 text-sm font-sans w-80 transition-all">
      <div className="flex justify-between items-center mb-5 border-b pb-3">
        <h3 className="font-bold text-slate-900 text-base">Auto-Scroll HUD</h3>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-800 text-lg">✕</button>
      </div>

      <div className="space-y-5">
        {zones.map((zone, i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-xs tracking-wide uppercase" style={{ color: zone.color }}>{zone.name}</span>
              <span className="bg-slate-100/50 px-2 py-0.5 rounded font-mono text-xs font-bold text-slate-700">{speeds[i]}px/frame</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="0.5"
              value={speeds[i]}
              onChange={(e) => updateSpeed(i, parseFloat(e.target.value))}
              className="w-full accent-slate-800"
            />
          </div>
        ))}
      </div>
      
      <p className="text-xs text-slate-500 mt-5 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
        Adjust the scroll velocity for each tunnel zone. Speeds save automatically. Set to 0 to pause progression.
      </p>
    </div>
  );
}
