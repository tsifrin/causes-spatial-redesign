import React from 'react';

interface StatOrbiterProps {
  label: string;
  value: string;
}

export default function StatOrbiter({ label, value }: StatOrbiterProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-full aspect-square backdrop-blur-2xl bg-white/40 border border-white/50 shadow-[0_0_30px_rgba(255,255,255,0.4)] text-slate-800 transition-transform hover:scale-105 cursor-default min-w-[160px]">
      <span className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-1 font-headline drop-shadow-sm">{value}</span>
      <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#2B388F] text-center leading-tight">{label}</span>
    </div>
  );
}
