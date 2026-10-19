import React from 'react';
import { Music, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ConnectButton() {
  const handleLogin = () => {
    // This points to the backend route
    window.location.href = "http://localhost:8000/login";
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-4 font-sans text-white">
      {/* Centered Card with Floating Glow Effect */}
      <div className="bg-[#1E1E1E] w-full max-w-md rounded-2xl p-8 shadow-[0_0_50px_-12px_rgba(29,185,84,0.25)] border border-zinc-800">
        
        {/* Header Area */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-[#1DB954]/10 p-1.5 rounded-full mb-4">
            <img className="w-15 h-15 text-[#1DB954] rounded-full" src="/filterd.png" alt="Logo-Filterd" />
          </div>
          <h1 className="text-2xl font-bold mb-2 tracking-tight text-[#FFFFFF]">Filterd</h1>
          <p className="text-[#A7A7A7] text-sm leading-relaxed">
            Transform your natural language prompts into perfectly curated Spotify playlists by analyzing your Liked Songs.
          </p>
        </div>

        {/* Permissions & Transparency Card */}
        <div className="bg-[#121212] rounded-xl p-5 mb-8 border border-zinc-800/50">
          <h3 className="text-xs font-bold text-[#A7A7A7] uppercase tracking-wider mb-4">
            Agent Permissions Required
          </h3>
          <div className="space-y-3">
            {[
              "Read your Liked Songs library metadata",
              "Analyze your tracks' audio features (Tempo, Energy, Valence)",
              "Create new public/private playlists on your account",
              "Modify and add tracks to newly created playlists"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#1DB954] shrink-0" />
                <span className="text-sm text-zinc-300">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleLogin}
          className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-[#000000] font-bold py-3.5 px-6 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#1DB954]/20"
        >
          Connect with Spotify
        </button>

        {/* Privacy Footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[#A7A7A7] text-xs">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span className="text-center">Agent only reads music data. Account credentials are never stored.</span>
        </div>
        
      </div>
    </div>
  );
}