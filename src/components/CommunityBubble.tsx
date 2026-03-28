import React from 'react';

interface CommunityBubbleProps {
  user: string;
  avatar: string;
  message: string;
  likes: number;
}

export default function CommunityBubble({ user, avatar, message, likes }: CommunityBubbleProps) {
  return (
    <div className="relative group pointer-events-auto">
      {/* The main chat bubble */}
      <div className="backdrop-blur-2xl bg-white/80 border border-white/50 rounded-3xl rounded-tl-sm p-5 md:p-6 shadow-2xl max-w-[280px] md:max-w-sm transition-transform duration-300 hover:scale-[1.03] cursor-pointer">
        <p className="text-slate-800 font-medium text-base md:text-lg leading-snug mb-3">"{message}"</p>
        <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wide">
          Shared by {user}
        </div>
      </div>
      
      {/* Orbiting Avatar */}
      <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 w-12 h-12 md:w-14 md:h-14 rounded-full border-[3px] md:border-4 border-white shadow-lg overflow-hidden transition-transform duration-500 group-hover:-translate-y-2 group-hover:-translate-x-2">
        <img src={avatar} alt={user} className="w-full h-full object-cover" />
      </div>

      {/* Like Badge */}
      <div className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 bg-[#E72428] text-white font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-md text-xs md:text-sm border-2 border-white flex items-center gap-1 transition-transform duration-500 group-hover:translate-y-1 group-hover:translate-x-1">
        <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
        {likes}
      </div>
    </div>
  );
}
