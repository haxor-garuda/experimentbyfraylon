
import React from 'react';
import { OracleResult } from '../types';

interface Props {
  result: OracleResult;
  isVisible: boolean;
}

const OracleResponse: React.FC<Props> = ({ result, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="max-w-2xl w-full mx-auto animate-fade-in p-8 rounded-lg bg-black/40 backdrop-blur-md border border-white/5 shadow-2xl transition-all duration-1000">
      <div className="mb-6 flex items-center gap-4">
        <span className="text-[10px] uppercase tracking-[0.4em] text-gold-400 opacity-50 font-cinzel">
          The Revelation • {result.type}
        </span>
        <div className="h-[1px] flex-grow bg-gradient-to-r from-white/10 to-transparent" />
      </div>

      {result.type === 'IMAGE' && (
        <div className="space-y-6">
          {result.imageUrl ? (
            <div className="relative group overflow-hidden rounded shadow-2xl border border-white/10">
              <img 
                src={result.imageUrl} 
                alt="The Oracle's Vision" 
                className="w-full aspect-square object-cover transition-transform duration-[3000ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
          ) : (
            <div className="w-full aspect-square flex items-center justify-center bg-zinc-900/50 animate-pulse rounded border border-white/5">
               <span className="text-zinc-600 italic">Conjuring vision...</span>
            </div>
          )}
          <p className="text-xl md:text-2xl leading-relaxed italic text-zinc-300 font-light first-letter:text-3xl first-letter:font-cinzel">
            "{result.text}"
          </p>
        </div>
      )}

      {result.type === 'POEM' && (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
          <div className="text-zinc-400">
             <svg className="w-12 h-12 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M14 17h-4v-1h4v1zm7-11v11h-2V6h2zm-4 0v11h-2V6h2zM5 17h2V6H5v11zm14 2H5c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v11c0 1.1-.9 2-2 2z"/></svg>
          </div>
          <p className="text-3xl md:text-4xl leading-snug text-white font-medium whitespace-pre-line tracking-tight">
            {result.text}
          </p>
          <div className="h-[1px] w-24 bg-zinc-800" />
        </div>
      )}

      {result.type === 'SONIC' && (
        <div className="space-y-8 py-8">
           <div className="flex items-center justify-center space-x-1 h-12">
             {[...Array(12)].map((_, i) => (
               <div 
                 key={i} 
                 className="w-1 bg-white/20 rounded-full animate-wave"
                 style={{ 
                   height: `${Math.random() * 100}%`,
                   animationDelay: `${i * 0.1}s`,
                   animationDuration: '1.2s'
                 }}
               />
             ))}
           </div>
           <p className="text-lg md:text-xl text-zinc-400 italic text-center leading-relaxed max-w-lg mx-auto">
             {result.text}
           </p>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1.2s ease-out forwards;
        }
        @keyframes wave {
          0%, 100% { height: 20%; opacity: 0.2; }
          50% { height: 100%; opacity: 0.5; }
        }
        .animate-wave {
          animation: wave linear infinite;
        }
      `}</style>
    </div>
  );
};

export default OracleResponse;
