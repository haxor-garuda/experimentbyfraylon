
import React, { useState, useCallback, useRef, useEffect } from 'react';
import BackgroundEffects from './components/BackgroundEffects';
import OracleResponse from './components/OracleResponse';
import { fetchOracleResponse } from './services/geminiService';
import { OracleResult } from './types';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OracleResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetchOracleResponse(query);
      setResult(response);
    } catch (err) {
      setError("The connection to the beyond was severed. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setQuery('');
    inputRef.current?.focus();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center px-4 pt-20 pb-10">
      <BackgroundEffects />
      
      {/* Header */}
      <header className="mb-20 text-center animate-pulse-slow">
        <h1 className="text-5xl md:text-7xl font-cinzel tracking-[0.3em] text-white mb-2">
          THE ORACLE
        </h1>
        <p className="text-zinc-500 uppercase tracking-[0.5em] text-[10px] md:text-xs">
          Beyond Search • Within Meaning
        </p>
      </header>

      {/* Main Container */}
      <main className="w-full flex flex-col items-center">
        {!result && !loading && (
          <div className="w-full max-w-xl animate-fade-in">
            <form onSubmit={handleSubmit} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Seek an interpretation..."
                className="w-full bg-transparent border-b border-white/20 py-4 px-2 text-2xl md:text-3xl font-light text-center focus:outline-none focus:border-white/60 transition-colors placeholder:text-zinc-700 text-zinc-200"
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
          <div className="flex flex-col items-center justify-center space-y-6 py-20 animate-pulse">
            <div className="w-16 h-16 border-t-2 border-r-2 border-white/20 rounded-full animate-spin" />
            <p className="text-zinc-500 tracking-[0.2em] font-cinzel text-sm">Consulting the shadows...</p>
          </div>
        )}

        {error && (
          <div className="text-red-800/80 bg-red-950/20 px-4 py-2 rounded-lg border border-red-900/30 mb-8">
            {error}
          </div>
        )}

        {result && (
          <div className="w-full flex flex-col items-center space-y-12">
            <OracleResponse result={result} isVisible={!!result} />
            <button 
              onClick={reset}
              className="px-8 py-3 border border-white/10 hover:border-white/30 text-zinc-500 hover:text-white transition-all rounded font-cinzel tracking-widest text-xs uppercase"
            >
              Ask Another
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto pt-20 text-[10px] uppercase tracking-[0.4em] text-zinc-800 pointer-events-none">
        Everything is a symbol.
      </footer>

      <style>{`
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        .animate-pulse-slow {
          animation: pulseSlow 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
