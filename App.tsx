
import React, { useState, useRef, useEffect } from 'react';
import BackgroundEffects from './components/BackgroundEffects';
import OracleResponse from './components/OracleResponse';
import OracleHistory from './components/OracleHistory';
import { fetchOracleResponse } from './services/geminiService';
import { OracleResult, HistoryItem } from './types';

const STORAGE_KEY = 'oracle_echoes';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OracleResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
    inputRef.current?.focus();
  }, []);

  // Save history whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetchOracleResponse(query);
      setResult(response);
      
      // Update history
      const newItem: HistoryItem = {
        query: query.trim(),
        result: response,
        timestamp: Date.now()
      };
      setHistory(prev => [newItem, ...prev].slice(0, 30)); // Keep last 30
    } catch (err) {
      setError("The connection to the beyond was severed. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectHistoryItem = (item: HistoryItem) => {
    setQuery(item.query);
    setResult(item.result);
    setIsHistoryOpen(false);
  };

  const clearHistory = () => {
    if (confirm("Are you sure you wish to forget your journeys?")) {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const reset = () => {
    setResult(null);
    setQuery('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center px-4 pt-20 pb-10">
      <BackgroundEffects />
      
      {/* History Toggle Button */}
      <button 
        onClick={() => setIsHistoryOpen(true)}
        className="fixed top-8 right-8 z-30 text-zinc-600 hover:text-white transition-all flex items-center gap-3 group"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity font-cinzel">Journal</span>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </button>

      <OracleHistory 
        history={history} 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        onSelectItem={selectHistoryItem}
        onClear={clearHistory}
      />

      {/* Header */}
      <header className={`mb-20 text-center transition-all duration-1000 ${result ? 'opacity-30 scale-90 translate-y--4' : 'opacity-100'}`}>
        <h1 className="text-5xl md:text-7xl font-cinzel tracking-[0.3em] text-white mb-2">
          THE ORACLE
        </h1>
        <p className="text-zinc-500 uppercase tracking-[0.5em] text-[10px] md:text-xs">
          Beyond Search • Within Meaning
        </p>
      </header>

      {/* Main Container */}
      <main className="w-full flex flex-col items-center flex-grow">
        {!result && !loading && (
          <div className="w-full max-w-xl animate-fade-in mt-10">
            <form onSubmit={handleSubmit} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Seek an interpretation..."
                className="w-full bg-transparent border-b border-white/20 py-4 px-2 text-2xl md:text-3xl font-light text-center focus:outline-none focus:border-white/60 transition-colors placeholder:text-zinc-800 text-zinc-200"
              />
              <button 
                type="submit" 
                disabled={!query.trim()}
                className="absolute right-0 bottom-4 text-zinc-500 hover:text-white transition-colors disabled:opacity-0"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
            <p className="mt-8 text-center text-zinc-600 italic text-sm">
              Ask about your fears, your dreams, or the silence between stars.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center space-y-8 py-20">
            <div className="relative w-20 h-20">
               <div className="absolute inset-0 border-t border-white/20 rounded-full animate-spin duration-[2000ms]" />
               <div className="absolute inset-2 border-b border-white/10 rounded-full animate-spin-reverse duration-[3000ms]" />
               <div className="absolute inset-4 border-l border-white/5 rounded-full animate-spin duration-[4000ms]" />
            </div>
            <p className="text-zinc-500 tracking-[0.3em] font-cinzel text-xs uppercase animate-pulse">
               Consulting the deep...
            </p>
          </div>
        )}

        {error && (
          <div className="text-red-800/80 bg-red-950/20 px-6 py-3 rounded border border-red-900/30 mb-8 animate-fade-in font-cinzel text-xs tracking-widest">
            {error}
          </div>
        )}

        {result && (
          <div className="w-full flex flex-col items-center space-y-16 animate-fade-in">
            <div className="text-center">
               <p className="text-zinc-600 uppercase tracking-[0.2em] text-[10px] mb-4">You asked:</p>
               <h2 className="text-2xl italic font-light text-zinc-400">"{query}"</h2>
            </div>
            
            <OracleResponse result={result} isVisible={!!result} />
            
            <button 
              onClick={reset}
              className="group relative px-10 py-4 overflow-hidden rounded bg-white/5 border border-white/10 transition-all hover:bg-white/10"
            >
              <span className="relative z-10 font-cinzel tracking-[0.4em] text-[10px] uppercase text-zinc-400 group-hover:text-white transition-colors">
                New Seek
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto pt-20 text-[10px] uppercase tracking-[0.5em] text-zinc-900 pointer-events-none">
        Every answer is another question.
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-reverse {
          animation: spin-reverse linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
