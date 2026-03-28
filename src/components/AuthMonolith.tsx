import React from 'react';

interface AuthMonolithProps {
  onAuthenticate: () => void;
}

export default function AuthMonolith({ onAuthenticate }: AuthMonolithProps) {
  return (
    <div className="w-[90vw] max-w-2xl backdrop-blur-3xl bg-white/60 border border-white/60 rounded-[3rem] p-8 md:p-16 shadow-[0_30px_100px_rgba(43,56,143,0.3)] relative overflow-hidden flex flex-col items-center pointer-events-auto transition-transform hover:scale-[1.01]">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#2B388F] via-[#E72428] to-[#F8D116]"></div>
      
      <img src="/causes-logo.svg" alt="Causes" className="h-12 md:h-14 w-auto mb-6 md:mb-8" />

      <h2 className="text-3xl md:text-5xl font-extrabold font-headline tracking-tighter text-slate-900 mb-3 md:mb-4 text-center">Unlock Your Impact</h2>
      <p className="text-base md:text-lg text-slate-600 font-medium mb-8 md:mb-10 text-center max-w-md">Join the core to manage your petitions, contact lawmakers with one click, and track your progress.</p>
      
      <div className="w-full flex flex-col gap-4 mb-6 md:mb-8">
        <button onClick={onAuthenticate} className="w-full bg-white text-slate-800 border-2 border-slate-200 hover:border-slate-300 font-bold py-3 md:py-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-3">
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>
      </div>

      <div className="flex items-center w-full gap-4 mb-6 md:mb-8">
        <div className="h-[1px] bg-slate-200 flex-1"></div>
        <span className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest">Or Email</span>
        <div className="h-[1px] bg-slate-200 flex-1"></div>
      </div>

      <form className="w-full flex flex-col md:flex-row gap-2" onSubmit={(e) => { e.preventDefault(); onAuthenticate(); }}>
        <input type="email" placeholder="Your email address" className="flex-1 px-4 py-3 md:px-6 md:py-4 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-[#2B388F] transition-colors font-medium bg-white/80" required />
        <button type="submit" className="bg-[#2B388F] text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md">
          Continue
        </button>
      </form>
    </div>
  );
}
