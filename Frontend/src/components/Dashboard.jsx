import { useState, useEffect } from "react";
import ConnectButton from "./ConnectButton";
import { Sparkles, PlusCircle, LogOut, Headphones, ListMusic, Bot, Music, Menu, X, CheckCircle2, Circle, ExternalLink } from 'lucide-react';

export default function Dashboard() {
  const [token, setToken] = useState(null);
  const [songs, setSongs] = useState([]); 
  const [prompt, setPrompt] = useState("");
  const [aiFilteredSongs, setAiFilteredSongs] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  
  // Modern UI States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  // Forces complete iframe destruction on new data to stop background playback
  const [renderKey, setRenderKey] = useState(Date.now());

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const urlToken = queryParams.get("token");

    if (urlToken) {
        setToken(urlToken);
        localStorage.setItem("spotify_token", urlToken);
        window.history.replaceState({}, document.title, window.location.pathname);
        loadUserProfile(urlToken); 
    } else {
        const savedToken = localStorage.getItem("spotify_token");
        if (savedToken) {
            setToken(savedToken);
            loadUserProfile(savedToken); 
        }
    }
  }, []);

  const toggleTrackSelection = (trackId) => {
    setSelectedTracks(prev => 
        prev.includes(trackId) 
            ? prev.filter(id => id !== trackId) 
            : [...prev, trackId] 
    );
  };

  const loadUserProfile = async (currentToken) => {
    try {
        const response = await fetch("http://localhost:8000/api/me", {
            headers: { "Authorization": `Bearer ${currentToken}` }
        });
        if (response.ok) {
            const data = await response.json();
            setUserInfo(data);
        }
    } catch (error) {
        console.error("Profile fetch error:", error);
    }
  };

  const loadSongs = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/songs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error("Backend rejected the request.");
      
      const data = await response.json();
      setSongs(data);
      setAiFilteredSongs(null); // Reset AI filter
      setSelectedTracks([]); 
      setRenderKey(Date.now()); // Kill any playing iframes
      showToast("Library synchronized successfully.", "success");
    } catch (error) {
      console.error("Fetch failed:", error);
      showToast("Failed to fetch library. Check server logs.");
    }
  };

  const handleAiFilter = async () => {
    if (!prompt.trim() || songs.length === 0) return;
    setIsAiLoading(true);

    try {
        const response = await fetch("http://localhost:8000/api/filter-songs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                prompt: prompt,
                songs: songs 
            })
        });

        if (!response.ok) throw new Error("AI Engine failed processing.");

        const data = await response.json();
        setAiFilteredSongs(data.filtered_songs); 
        setSelectedTracks([]); 
        setRenderKey(Date.now()); // Strictly destroy old playing iframes
        showToast("AI filtering completed.", "success");
    } catch (error) {
        console.error("AI Error:", error);
        showToast("AI processing failed. Please try again.");
    } finally {
        setIsAiLoading(false);
    }
  };

  const initiatePlaylistCreation = () => {
    const songsToSave = aiFilteredSongs !== null ? aiFilteredSongs : songs;
    
    if (songsToSave.length === 0 || selectedTracks.length === 0) {
        showToast("Please select at least one track.", "error");
        return;
    }

    if (!playlistName.trim()) {
        showToast("Playlist name cannot be empty.", "error");
        return;
    }

    setPlaylistName(prev => prev.trim());
    setShowConfirmModal(true);
  };

  const executeCreatePlaylist = async () => {
    setShowConfirmModal(false);
    setIsCreating(true);
    
    const songsToSave = aiFilteredSongs !== null ? aiFilteredSongs : songs;
    
    try {
        const trackIdsToSave = songsToSave
            .filter(song => selectedTracks.includes(song.id))
            .map(song => song.id);
        
        const response = await fetch("http://localhost:8000/api/create-playlist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({
                name: playlistName,
                track_ids: trackIdsToSave
            })
        });

        if (!response.ok) throw new Error("Server rejected playlist creation.");

        await response.json();
        showToast(`Playlist '${playlistName}' created successfully!`, "success");
        setPlaylistName(""); 
        setSelectedTracks([]); 
        
    } catch (error) {
        console.error("Playlist Error:", error);
        showToast("Failed to create playlist. Verify server connection.", "error");
    } finally {
        setIsCreating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("spotify_token");
    setToken(null);
    setSongs([]); 
    setAiFilteredSongs(null); 
    setRenderKey(Date.now());
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  if (!token) return <ConnectButton />;

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans pb-15 relative">

      {/* CUSTOM TOAST NOTIFICATION */}
      {toast.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-5 fade-in duration-300">
          <div className={`px-6 py-3 rounded-full shadow-lg font-bold text-sm border ${
            toast.type === "success" 
              ? "bg-[#1DB954]/10 text-[#1DB954] border-[#1DB954]/30" 
              : "bg-[#e91429]/10 text-[#e91429] border-[#e91429]/30"
          }`}>
            {toast.message}
          </div>
        </div>
      )}

      {/* CUSTOM CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1E1E1E] border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-white mb-2">Confirm Playlist</h3>
            <p className="text-zinc-400 text-sm mb-6">
              Create <span className="text-white font-bold">"{playlistName}"</span> with <span className="text-[#1DB954] font-bold">{selectedTracks.length}</span> selected tracks?
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={executeCreatePlaylist}
                className="px-5 py-2.5 rounded-xl font-bold bg-[#1DB954] hover:bg-[#1ed760] text-black transition-all"
              >
                Create Playlist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="bg-[#1E1E1E] border-b border-zinc-800 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img className="w-8 h-8 text-[#1DB954]" src="/filterd.png" alt="Logo-Filterd" />
            <span className="font-bold text-xl tracking-tight text-white">Filterd</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            {userInfo && (
              <div className="flex items-center gap-3 text-sm bg-zinc-900/50 py-1.5 px-4 rounded-full border border-zinc-800">
                <Headphones className="w-4 h-4 text-[#1DB954]" />
                <div className="flex flex-col">
                  <span className="font-medium text-white">{userInfo.name}</span>
                  <span className="text-xs text-[#A7A7A7]">{userInfo.email}</span>
                </div>
              </div>
            )}
            <button 
              onClick={handleLogout}
              className="text-zinc-400 hover:text-white hover:bg-[#e91429]/20 transition-all flex items-center gap-2 text-sm font-bold bg-zinc-800/50 py-2.5 px-5 rounded-full"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          </div>
              {/* Mobile Hamburger Button */}
          <button 
            className="md:hidden text-zinc-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
            {/* Mobile Side Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#1E1E1E] border-b border-zinc-800 p-6 flex flex-col gap-4 shadow-xl">
            {userInfo && (
              <div className="flex items-center gap-4 bg-[#121212] p-4 rounded-xl border border-zinc-800">
                <Headphones className="w-6 h-6 text-[#1DB954]" />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-bold text-white text-base truncate">{userInfo.name}</span>
                  <span className="text-sm text-[#A7A7A7] truncate">{userInfo.email}</span>
                </div>
              </div>
            )}
            <button 
              onClick={handleLogout}
              className="w-full bg-[#e91429]/10 text-[#e91429] hover:bg-[#e91429] hover:text-white transition-all flex justify-center items-center gap-2 font-bold py-3.5 px-5 rounded-xl border border-[#e91429]/30"
            >
              <LogOut className="w-5 h-5" />
              Disconnect
            </button>
          </div>
        )}
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-8">

        {/* CONTROL PANEL */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          
          <div className="bg-[#1E1E1E] p-6 rounded-2xl border border-zinc-800 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1DB954] to-transparent opacity-50"></div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#1DB954]" />
              Vibe Analysis
            </h2>
            <div className="flex flex-col gap-3">
              <input 
                type="text" 
                placeholder="Specify the vibe (e.g., Gym motivation, Late night drive)" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-[#121212] border border-zinc-700 rounded-xl p-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954] transition-all"
              />
              <button 
                onClick={handleAiFilter} 
                disabled={isAiLoading || songs.length === 0}
                className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isAiLoading ? "Processing..." : "Filter Library"}
              </button>
            </div>
          </div>

          <div className="bg-[#1E1E1E] p-6 rounded-2xl border border-zinc-800 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zinc-500 to-transparent opacity-20"></div>
            
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#1DB954]" />
                Export to Spotify
                </h2>
                <span className="text-xs font-bold text-[#1DB954] bg-[#1DB954]/10 py-1.5 px-3 rounded-full">
                  {selectedTracks.length} Selected
                </span>
            </div>

            <div className="flex flex-col gap-3 py-1">
              <input 
                type="text" 
                placeholder="Enter playlist name..." 
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                className="w-full bg-[#121212] border border-zinc-700 rounded-xl p-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954] transition-all"
              />
              <button 
                onClick={initiatePlaylistCreation}
                disabled={isCreating || !playlistName.trim() || selectedTracks.length === 0}
                className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {selectedTracks.length === 0 ? "Select tracks to export" : "Create PlayList"}
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS AREA */}
        <div className="bg-[#1E1E1E] rounded-2xl border border-zinc-800 p-6 shadow-lg min-h-[400px]">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-zinc-800 gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ListMusic className="w-6 h-6 text-[#1DB954]" />
              {aiFilteredSongs !== null 
                ? <span className="text-[#1DB954]">AI Matches ({aiFilteredSongs.length} tracks)</span>
                : <span className="text-zinc-300">Library Overview</span>
              }
            </h2>
            
            <button 
              onClick={loadSongs}
              className="bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold py-2 px-5 rounded-full transition-all border border-zinc-700"
            >
              Sync Library
            </button>
          </div>

          {/* Render Logic mapped with renderKey to force unmounts */}
          <div className="w-full" key={renderKey}>
            {aiFilteredSongs !== null ? (
              
              aiFilteredSongs.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {aiFilteredSongs.slice(0, visibleCount).map((item, index) => {
                    const isSelected = selectedTracks.includes(item.id);
                    return (
                      <div 
                        key={item.id || index} 
                        className={`relative p-2 rounded-xl border transition-all ${isSelected ? 'bg-[#1DB954]/10 border-[#1DB954]' : 'bg-[#121212] border-zinc-800/50 hover:border-zinc-700'}`}
                      >
                        <button 
                          onClick={() => toggleTrackSelection(item.id)}
                          className="absolute -top-3 -right-3 z-10 bg-[#1E1E1E] rounded-full p-1 shadow-lg border border-zinc-700 hover:scale-110 transition-transform cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckCircle2 className="w-6 h-6 text-[#1DB954]" fill="#121212" />
                          ) : (
                            <Circle className="w-6 h-6 text-zinc-500 hover:text-white" />
                          )}
                        </button>

                        <a 
                          href={`spotify:track:${item.id}`} 
                          className="md:hidden absolute top-2 right-2 z-10 p-1.5 bg-black/60 rounded text-zinc-400 hover:text-white"
                          title="Open in Spotify App"
                        >
                           <ExternalLink className="w-4 h-4" />
                        </a>

                        <iframe 
                          src={`https://open.spotify.com/embed/track/${item.id}?utm_source=generator&theme=0`} 
                          width="100%" 
                          height="80" 
                          frameBorder="0" 
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                          loading="lazy"
                          className="rounded-lg"
                        ></iframe>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-[#121212] rounded-xl border border-[#ff4d4d]/30">
                  <p className="text-[#ff4d4d] text-lg font-bold mb-2">No matching tracks found in your library.</p>
                  <p className="text-zinc-500 text-sm">Adjust your prompt or sync library again.</p>
                </div>
              )

            ) : (
              
              songs.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {songs.slice(0, visibleCount).map((item, index) => {
                    const isSelected = selectedTracks.includes(item.id);
                    return (
                        <div 
                          key={item.id || index} 
                          className={`relative p-2 rounded-xl border transition-all ${isSelected ? 'bg-[#1DB954]/10 border-[#1DB954]' : 'bg-[#121212] border-zinc-800/50 hover:border-zinc-700'}`}
                        >
                          <button 
                            onClick={() => toggleTrackSelection(item.id)}
                            className="absolute -top-3 -right-3 z-10 bg-[#1E1E1E] rounded-full p-1 shadow-lg border border-zinc-700 hover:scale-110 transition-transform cursor-pointer"
                          >
                            {isSelected ? (
                              <CheckCircle2 className="w-6 h-6 text-[#1DB954]" fill="#121212" />
                            ) : (
                              <Circle className="w-6 h-6 text-zinc-500 hover:text-white" />
                            )}
                          </button>
                          
                          <a 
                            href={`spotify:track:${item.id}`} 
                            className="md:hidden absolute top-2 right-2 z-10 p-1.5 bg-black/60 rounded text-zinc-400 hover:text-white"
                            title="Open in Spotify App"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          <iframe 
                            src={`https://open.spotify.com/embed/track/${item.id}?utm_source=generator&theme=0`} 
                            width="100%" 
                            height="80" 
                            frameBorder="0" 
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                            loading="lazy"
                            className="rounded-lg"
                          ></iframe>
                        </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Music className="w-12 h-12 text-zinc-700 mb-4" />
                  <p className="text-[#b3b3b3] text-lg font-medium">No tracks loaded yet.</p>
                  <p className="text-zinc-500 text-sm mt-2">Initialize process by clicking <strong>'Sync Library'</strong>.</p>
                </div>
              )
            )}
          </div>

          {/* Pagination */}
          {((aiFilteredSongs || songs).length > visibleCount) && (
            <div className="flex justify-center mt-8">
              <button 
                onClick={() => setVisibleCount(prev => prev + 10)}
                className="bg-zinc-800 hover:bg-[#1DB954] text-zinc-300 hover:text-black font-bold py-2.5 px-6 rounded-full transition-all border border-zinc-700 hover:border-[#1DB954] text-sm"
              >
                Load More Tracks
              </button>
            </div>
          )}

        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-6 mt-0 mb-0 border-t border-zinc-800/50 pt-8 pb-6 flex flex-col items-center justify-center">
        <p className="text-zinc-500 text-sm">
          Engineered with <span className="text-[#1DB954]">♥</span> by <span className="text-zinc-300 font-medium tracking-wide">Navneet Kumar</span>
        </p>
        <div className="flex justify-center gap-6 mt-4">
          <a 
            href="https://www.linkedin.com/in/navneetkumar01/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-zinc-500 hover:text-[#1DB954] transition-colors text-sm font-medium"
          >
            LinkedIn
          </a>
          <a 
            href="https://github.com/NavneetKumar-GS" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-zinc-500 hover:text-[#1DB954] transition-colors text-sm font-medium"
          >
            GitHub
          </a>
          <a 
            href="mailto:navneetkumarbiz@gmail.com" 
            className="text-zinc-500 hover:text-[#1DB954] transition-colors text-sm font-medium"
          >
            Contact
          </a>
        </div>
      </footer>
    </div>  
  );
}