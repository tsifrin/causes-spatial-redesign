import React from 'react';

export default function LawmakerDashboard() {
  return (
    <div
      className="bg-black/60 backdrop-blur-3xl border border-white/10 text-white p-6 sm:p-8 rounded-3xl w-[90vw] sm:w-[400px]"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-2xl font-bold mb-4">Contact Your Lawmakers</h2>
      <p className="mb-6 text-gray-300">
        Send a message to your local representatives to make your voice heard.
      </p>
      <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); }}>
        <textarea
          className="w-full p-4 mb-6 rounded-xl border border-white/20 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
          rows={5}
          placeholder="Enter your message..."
          onClick={(e) => e.stopPropagation()}
        />
        <button
          type="submit"
          className="w-full py-3 font-bold bg-indigo-600 hover:bg-indigo-500 rounded-full transition-colors leading-none"
          onClick={(e) => e.stopPropagation()}
        >
          Contact Now
        </button>
      </form>
    </div>
  );
}
