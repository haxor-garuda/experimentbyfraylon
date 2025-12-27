
import React from 'react';
import { HistoryItem } from '../types';

interface Props {
  history: HistoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: HistoryItem) => void;
  onClear: () => void;
}

const OracleHistory: React.FC<Props> = ({ history, isOpen, onClose, onSelectItem, onClear }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-zinc-950 border-l border-white/5 z-50 transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full p-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="font-cinzel text-xl tracking-[0.2em] text-white">Journal of Echoes</h2>
            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-grow overflow-y-auto space-y-6 pr-2 custom-scrollbar">
            {history.length === 0 ? (
              <p className="text-zinc-600 italic text-center py-20">The journal remains empty. Seek and you shall remember.</p>
            ) : (
              history.map((item) => (
                <button
                  key={item.timestamp}
                  onClick={() => onSelectItem(item)}
                  className="w-full text-left group border-b border-white/5 pb-4 hover:border-white/20 transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300">
                      {item.result.type} • {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-zinc-300 group-hover:text-white transition-colors line-clamp-2 italic">
                    "{item.query}"
                  </p>
                </button>
              ))
            )}
          </div>

          {history.length > 0 && (
            <button 
              onClick={onClear}
              className="mt-8 py-2 text-[10px] uppercase tracking-widest text-zinc-700 hover:text-red-900 transition-colors text-center border border-white/5 rounded"
            >
              Exorcise the Past
            </button>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
        }
      `}</style>
    </>
  );
};

export default OracleHistory;
