import React from 'react';

interface PetitionCardProps {
  title: string;
  organization: string;
  date: string;
  image: string;
  signatureCount: number;
}

export default function PetitionCard({
  title,
  organization,
  date,
  image,
  signatureCount,
}: PetitionCardProps) {
  return (
    <div className="rounded-3xl backdrop-blur-2xl bg-white/80 border border-white/20 shadow-2xl p-8 sm:p-12 flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <div className="w-full h-64 sm:h-80 overflow-hidden rounded-2xl relative bg-gray-50">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
          {title}
        </h2>
        
        <div className="flex items-center text-lg font-medium text-slate-600 gap-3">
          <span>{organization}</span>
          <span className="text-slate-300 text-xl">&bull;</span>
          <span>{date}</span>
        </div>
      </div>

      <div className="mt-2 pt-8 border-t border-slate-200/60 flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <span className="text-4xl font-black text-slate-900">
            {signatureCount.toLocaleString()}
          </span>
          <span className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">
            Signatures
          </span>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="px-10 py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-lg rounded-full transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-blue-600/30 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Sign
        </button>
      </div>
    </div>
  );
}
