import { useState, useEffect } from 'react';
import type { Game } from '../data/games';
import { getDemoType } from '../data/demoThemes';
import SlotDemo from './SlotDemo';
import RouletteDemo from './RouletteDemo';
import BlackjackDemo from './BlackjackDemo';
import LiveCasinoDemo from './LiveCasinoDemo';

interface DemoGameModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoGameModal({ game, isOpen, onClose }: DemoGameModalProps) {
  const [demoBalance, setDemoBalance] = useState(10000);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset balance when opening
      setDemoBalance(10000);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !game) return null;

  const getDemoComponent = () => {
    const demoType = getDemoType(game);
    
    switch (demoType) {
      case 'slot':
        return <SlotDemo game={game} balance={demoBalance} onBalanceChange={setDemoBalance} />;
      case 'roulette':
        return <RouletteDemo game={game} balance={demoBalance} onBalanceChange={setDemoBalance} />;
      case 'blackjack':
      case 'poker':
      case 'baccarat':
        return <BlackjackDemo game={game} balance={demoBalance} onBalanceChange={setDemoBalance} />;
      case 'live-casino':
        return <LiveCasinoDemo game={game} balance={demoBalance} onBalanceChange={setDemoBalance} />;
      default:
        return <SlotDemo game={game} balance={demoBalance} onBalanceChange={setDemoBalance} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-6xl max-h-[95vh] overflow-hidden bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl shadow-2xl border border-white/10">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-display font-bold text-white">{game.title}</h2>
                <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/50 rounded-full text-xs font-bold text-amber-400 uppercase tracking-wider animate-pulse">
                  Demo Mode
                </span>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Demo Balance */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg">
                <div className="text-xs text-gray-400 mb-0.5">Demo Balance</div>
                <div className="text-lg font-bold text-green-400">
                  ${demoBalance.toLocaleString()}
                </div>
              </div>
              
              <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
                <div className="text-xs text-gray-400 mb-0.5">Provider</div>
                <div className="text-sm font-semibold text-white capitalize">{game.provider}</div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-blue-400 font-medium">For Preview Only - No Real Money</span>
            </div>
          </div>
        </div>

        {/* Game Demo Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-140px)]">
          {getDemoComponent()}
        </div>

        {/* Footer Notice */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent p-4 border-t border-white/10">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>This is a demo preview. No real money is involved. Template for demonstration purposes only.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
