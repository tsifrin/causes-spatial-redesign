import React from 'react';

export interface GlassCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  ctaText?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ title, description, icon, ctaText }) => {
  return (
    <div className="backdrop-blur-2xl bg-white/60 ring-1 ring-white/40 p-6 rounded-2xl shadow-xl flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/50 rounded-lg shadow-sm">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-700 leading-relaxed">
        {description}
      </p>
      {ctaText && (
        <button className="mt-auto px-4 py-2 bg-blue-600/90 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors w-fit shadow-md hover:shadow-lg backdrop-blur-sm">
          {ctaText}
        </button>
      )}
    </div>
  );
};
