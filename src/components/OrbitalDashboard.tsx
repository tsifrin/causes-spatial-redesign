'use client';

import { useState } from 'react';

interface Article {
  title: string;
  source: string;
  imageUrl: string;
}

interface OrbitalDashboardProps {
  isAuthenticated: boolean;
  onAuthenticate: () => void;
  onLogout: () => void;
}

const mockTopic = 'Climate Change';

const mockPetition = {
  title: 'Ban Single-Use Plastics by 2030',
  org: 'Causes Petitions',
  supporters: 452108,
  goal: 500000,
  image: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=400',
};

const mockArticles: Article[] = [
  { title: 'New EPA Rules Could Slash Carbon Emissions by 40%', source: 'Environment', imageUrl: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=200' },
  { title: 'Global Summit Reaches Historic Agreement on Ocean Conservation', source: 'Global', imageUrl: 'https://images.unsplash.com/photo-1498623116890-37e912163d5d?w=200' },
  { title: 'Why $4 Gasoline Is the Tipping Point for EVs', source: 'Economy', imageUrl: 'https://images.unsplash.com/photo-1617788138017-8149eb4044a2?w=200' },
];

const mockCommunity = [
  { user: 'Sarah J.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80', message: 'This is critical for our local parks. Please sign!' },
  { user: 'Marcus T.', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80', message: 'I called my rep today. Keep going!' },
  { user: 'Ana R.', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80', message: 'Shared with my whole network 🌎' },
];

function ConnectorLine({ angle, length }: { angle: number; length: number }) {
  return (
    <div
      className="absolute top-1/2 left-1/2 origin-left pointer-events-none"
      style={{
        width: `${length}px`,
        height: '1px',
        transform: `rotate(${angle}deg)`,
        background: 'linear-gradient(to right, rgba(43,56,143,0.6), transparent)',
      }}
    />
  );
}

export default function OrbitalDashboard({ isAuthenticated, onAuthenticate, onLogout }: OrbitalDashboardProps) {
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [lawmakerMessage, setLawmakerMessage] = useState(`I am writing regarding ${mockTopic}.`);
  const [lawmakerZip, setLawmakerZip] = useState('');
  const [petitionSigned, setPetitionSigned] = useState(false);

  return (
    <div className="relative w-full h-full bg-[#FAFAFD] overflow-hidden flex flex-col">

      {/* Focus Pull Overlay */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(250,250,253,0.85)', backdropFilter: 'blur(20px)' }}
          onClick={() => setActiveArticle(null)}
        >
          <div className="flex gap-6 max-w-6xl w-full px-6 items-start" onClick={e => e.stopPropagation()}>
            {/* Article Panel */}
            <div className="flex-1 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="h-64 overflow-hidden">
                <img src={activeArticle.imageUrl.replace('w=200', 'w=1200')} alt={activeArticle.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-8">
                <span className="text-xs font-bold uppercase tracking-widest text-[#E72428] mb-3 block">{activeArticle.source}</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">{activeArticle.title}</h2>
                <p className="text-slate-600 leading-relaxed mb-3">
                  Recent policy changes have set the stage for a significant shift in environmental regulation. Scientists and lawmakers alike are calling for immediate action to curb the growing climate crisis.
                </p>
                <p className="text-slate-600 leading-relaxed mb-3">
                  Communities across the country are already feeling the impact. Grassroots organizations have rallied hundreds of thousands of signatures in support of stronger protective legislation.
                </p>
                <p className="text-slate-600 leading-relaxed mb-6">
                  This report examines the data behind the proposals, the stakeholders involved, and what citizens can do right now to make their voices heard on this critical issue.
                </p>
                <div className="flex items-center gap-4 border-t border-gray-100 pt-5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Share</span>
                  {['X', 'FB', 'IN'].map(platform => (
                    <button key={platform} className="text-xs font-bold text-slate-600 border border-gray-200 px-3 py-1 rounded-full hover:border-[#2B388F] hover:text-[#2B388F] transition-colors">{platform}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Lawmaker Action Panel */}
            <div className="w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 flex-shrink-0 relative">
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r from-[#2B388F] via-[#E72428] to-[#1A8641]"></div>
              <h3 className="font-extrabold text-slate-900 text-lg mb-1 tracking-tight">Contact Your Lawmaker</h3>
              <p className="text-xs text-slate-500 mb-4">Topic extracted from article</p>
              <div className="bg-[#EEF0FA] rounded-xl px-3 py-2 mb-4 text-sm font-semibold text-[#2B388F]">
                📌 {mockTopic} / {activeArticle.source}
              </div>
              <textarea
                className="w-full bg-gray-50 rounded-xl p-3 text-sm text-slate-700 border border-gray-200 focus:outline-none focus:border-[#2B388F] resize-none mb-3 h-28"
                value={lawmakerMessage}
                onChange={e => setLawmakerMessage(e.target.value)}
                onClick={e => e.stopPropagation()}
              />
              <input
                className="w-full bg-gray-50 rounded-xl p-3 text-sm text-slate-700 border border-gray-200 focus:outline-none focus:border-[#2B388F] mb-4"
                placeholder="Your ZIP code to find lawmaker"
                value={lawmakerZip}
                onChange={e => setLawmakerZip(e.target.value)}
                onClick={e => e.stopPropagation()}
              />
              {isAuthenticated ? (
                <button className="w-full bg-[#2B388F] text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors" onClick={e => e.stopPropagation()}>
                  Send Message →
                </button>
              ) : (
                <div className="relative group">
                  <button disabled className="w-full bg-gray-200 text-gray-400 font-bold py-3 rounded-xl cursor-not-allowed">
                    Send Message
                  </button>
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Login to contact your lawmaker
                  </div>
                </div>
              )}
              <button className="w-full text-center text-xs text-slate-400 mt-3 hover:text-slate-600 transition-colors" onClick={() => setActiveArticle(null)}>
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Faint Background Rings (spatial continuity from tunnel) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {[500, 420, 330, 240].map((r, i) => (
          <div
            key={i}
            className="absolute rounded-full border"
            style={{
              width: `${r * 2}px`,
              height: `${r * 2}px`,
              borderColor: ['#2B388F', '#E72428', '#F8D116', '#1A8641'][i],
              opacity: 0.06,
            }}
          />
        ))}
      </div>

      {/* Dashboard Grid */}
      <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-3 gap-0 p-4 md:p-8 pt-6 overflow-auto">

        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-4">

          {/* Petitions Panel — BLUE */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="h-1 bg-[#2B388F]" />
            <div className="p-5 flex-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2B388F]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#2B388F]">Petitions</span>
              </div>
              <img src={mockPetition.image} alt="" className="w-full h-32 object-cover rounded-xl mb-4" />
              <h3 className="font-extrabold text-slate-900 text-base mb-2 leading-snug tracking-tight">{mockPetition.title}</h3>
              <p className="text-xs text-slate-400 mb-3">{mockPetition.org}</p>
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-semibold">{mockPetition.supporters.toLocaleString()} supporters</span>
                  <span className="text-slate-400">Goal: {mockPetition.goal.toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full">
                  <div className="h-full bg-[#2B388F] rounded-full" style={{ width: `${(mockPetition.supporters / mockPetition.goal) * 100}%` }} />
                </div>
              </div>
              <button
                onClick={() => { if (!petitionSigned) setPetitionSigned(true); }}
                className={`w-full font-bold py-2.5 rounded-xl transition-all text-sm ${petitionSigned ? 'bg-green-50 text-[#1A8641] border border-green-200' : 'bg-[#2B388F] text-white hover:bg-indigo-700'}`}
              >
                {petitionSigned ? '✓ Signed' : 'Sign Petition'}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[{ v: '325K+', l: 'Members' }, { v: '$50M+', l: 'Raised' }, { v: '20M+', l: 'Messages Sent' }, { v: '1.8M', l: 'Nonprofits' }].map(s => (
              <div key={s.l} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
                <div className="text-xl font-extrabold text-[#2B388F] tracking-tight">{s.v}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER COLUMN — Topic Lens + News */}
        <div className="flex flex-col gap-4 md:px-4">

          {/* Topic Lens */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-center flex flex-col items-center">
            {/* Real Causes Logo */}
            <img src="/causes-logo.svg" alt="Causes" className="h-8 w-auto mb-4" />
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Active Topic</div>
            <div className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tighter mb-3">{mockTopic}</div>
            <p className="text-sm text-slate-500">All content below is filtered around this topic across all four action areas.</p>
          </div>

          {/* News Panel — RED */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex-1">
            <div className="h-1 bg-[#E72428]" />
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#E72428]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#E72428]">News</span>
              </div>
              <div className="flex flex-col gap-3">
                {mockArticles.map((article, i) => (
                  <button
                    key={i}
                    className="flex gap-3 items-start text-left hover:bg-gray-50 rounded-2xl p-2 -mx-2 transition-colors group w-full"
                    onClick={() => setActiveArticle(article)}
                  >
                    <img src={article.imageUrl} alt="" className="w-14 h-14 object-cover rounded-xl flex-shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">{article.source}</span>
                      <span className="text-sm font-semibold text-slate-800 leading-snug group-hover:text-[#E72428] transition-colors">{article.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-4">

          {/* Lawmakers Panel — YELLOW */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-1 bg-[#F8D116]" />
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F8D116]" />
                <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Lawmakers</span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mb-3 tracking-tight">Contact Your Lawmaker</h3>
              <div className="bg-amber-50 rounded-xl px-3 py-2 mb-3 text-sm font-semibold text-amber-700 text-xs">
                📌 Pre-filled: {mockTopic}
              </div>
              <textarea
                className="w-full bg-gray-50 rounded-xl p-3 text-sm text-slate-700 border border-gray-200 focus:outline-none focus:border-[#2B388F] resize-none mb-3 h-24"
                value={lawmakerMessage}
                onChange={e => setLawmakerMessage(e.target.value)}
              />
              <input
                className="w-full bg-gray-50 rounded-xl p-3 text-sm text-slate-700 border border-gray-200 focus:outline-none focus:border-[#2B388F] mb-3"
                placeholder="Your ZIP code"
                value={lawmakerZip}
                onChange={e => setLawmakerZip(e.target.value)}
              />
              {isAuthenticated ? (
                <button className="w-full bg-[#F8D116] text-slate-900 font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors text-sm">
                  Send Message →
                </button>
              ) : (
                <button onClick={onAuthenticate} className="w-full bg-gray-100 text-slate-500 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm">
                  Login to Send →
                </button>
              )}
            </div>
          </div>

          {/* Community Panel — GREEN */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex-1">
            <div className="h-1 bg-[#1A8641]" />
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1A8641]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#1A8641]">Community</span>
              </div>
              <div className="flex flex-col gap-3">
                {mockCommunity.map((c, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <img src={c.avatar} alt={c.user} className="w-9 h-9 rounded-full flex-shrink-0 object-cover border-2 border-white shadow" />
                    <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3 flex-1">
                      <p className="text-sm text-slate-700 leading-snug">"{c.message}"</p>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1 block">{c.user}</span>
                    </div>
                  </div>
                ))}
              </div>

              {isAuthenticated ? (
                <div className="mt-4">
                  <input className="w-full bg-gray-50 rounded-xl p-3 text-sm border border-gray-200 focus:outline-none focus:border-[#1A8641]" placeholder="Share your voice..." />
                </div>
              ) : (
                <button onClick={onAuthenticate} className="mt-4 w-full text-center text-sm text-slate-400 hover:text-[#1A8641] transition-colors font-semibold">
                  Join to post →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
