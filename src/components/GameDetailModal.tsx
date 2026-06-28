import { useState, useEffect } from 'react';
import type { Game } from '../data/games';
import { gameProviders } from '../data/games';
import JackpotCounter from './JackpotCounter';

interface GameDetailModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function GameDetailModal({ game, isOpen, onClose }: GameDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'rules'>('overview');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !game) return null;

  const provider = gameProviders.find(p => p.id === game.provider);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPlayerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getVolatilityColor = (volatility: string) => {
    switch (volatility) {
      case 'low': return 'text-accent-green';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-accent-red';
      default: return 'text-gray-400';
    }
  };

  const getVolatilityBars = (volatility: string) => {
    const levels = { low: 1, medium: 2, high: 3 };
    const level = levels[volatility as keyof typeof levels] || 1;
    
    return Array.from({ length: 3 }, (_, i) => (
      <div
        key={i}
        className={`w-2 h-4 rounded-sm ${
          i < level 
            ? volatility === 'low' ? 'bg-accent-green' 
              : volatility === 'medium' ? 'bg-yellow-400' 
              : 'bg-accent-red'
            : 'bg-gray-600'
        }`}
      />
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-dark-800 rounded-2xl shadow-2xl border border-white/10">
        {/* Header */}
        <div className="relative">
          {/* Background Image */}
          <div className="h-64 overflow-hidden">
            <img 
              src={game.image} 
              alt={game.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-800 via-dark-800/50 to-transparent" />
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Game Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-3xl font-display font-bold text-white">{game.title}</h2>
                  
                  {game.hot && (
                    <span className="bg-gradient-to-r from-accent-red to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                      🔥 HOT
                    </span>
                  )}
                  
                  {game.new && (
                    <span className="bg-gradient-to-r from-accent-green to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      ✨ NEW
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-300">
                  <span>{provider?.name || game.provider}</span>
                  <span>•</span>
                  <span>{game.subcategory || game.category}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span>{game.rating}/5</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isFavorite 
                      ? 'bg-accent-red text-white' 
                      : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <svg className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                
                <button 
                  className="play-demo-btn bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white font-bold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                  data-game-id={game.id}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                  Play Demo
                </button>
                
                <button className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                  Play Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-white/5 rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'features', label: 'Features', icon: '⚡' },
              { id: 'rules', label: 'How to Play', icon: '📖' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-semibold text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Game Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-gray-400 text-xs mb-1">RTP</div>
                  <div className="text-white font-bold text-lg">{game.rtp}%</div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-gray-400 text-xs mb-1">Volatility</div>
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold capitalize ${getVolatilityColor(game.volatility)}`}>
                      {game.volatility}
                    </span>
                    <div className="flex space-x-1">
                      {getVolatilityBars(game.volatility)}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-gray-400 text-xs mb-1">Min Bet</div>
                  <div className="text-white font-bold text-lg">{formatCurrency(game.minBet)}</div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-gray-400 text-xs mb-1">Max Bet</div>
                  <div className="text-white font-bold text-lg">{formatCurrency(game.maxBet)}</div>
                </div>
              </div>

              {/* Jackpot Info */}
              {game.jackpot && game.jackpot > 0 && (
                <div className="bg-gradient-to-r from-primary-500/10 to-yellow-500/10 border border-primary-500/30 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1">Progressive Jackpot</h3>
                      <p className="text-gray-400 text-sm">Current jackpot amount</p>
                    </div>
                    <div className="text-right">
                      <JackpotCounter 
                        initialAmount={game.jackpot}
                        className="text-2xl font-display font-black text-primary-400"
                        increment={Math.floor(Math.random() * 50) + 10}
                        intervalMs={5000}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Game Description */}
              <div>
                <h3 className="text-white font-bold text-lg mb-3">About This Game</h3>
                <p className="text-gray-300 leading-relaxed">{game.description}</p>
              </div>

              {/* Live Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
                    <span className="text-gray-400 text-sm">Players Online</span>
                  </div>
                  <div className="text-white font-bold text-xl">{formatPlayerCount(game.players)}</div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-gray-400 text-sm mb-2">Popularity Rank</div>
                  <div className="flex items-center space-x-2">
                    <div className="text-white font-bold text-xl">#{Math.ceil((100 - game.popularity) / 10)}</div>
                    <div className="text-xs text-accent-green">↗️ Trending</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg mb-4">Game Features</h3>
              
              <div className="grid gap-3">
                {game.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-white font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Technical Details */}
              {(game.paylines || game.reels) && (
                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="text-white font-semibold mb-3">Technical Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {game.reels && (
                      <div>
                        <span className="text-gray-400">Reels:</span>
                        <span className="text-white ml-2 font-semibold">{game.reels}</span>
                      </div>
                    )}
                    {game.paylines && (
                      <div>
                        <span className="text-gray-400">Paylines:</span>
                        <span className="text-white ml-2 font-semibold">
                          {game.paylines === 0 ? 'Cluster Pays' : game.paylines.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg mb-4">How to Play</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="text-white font-semibold mb-2 flex items-center">
                    <span className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-2">1</span>
                    Set Your Bet
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Choose your bet amount between {formatCurrency(game.minBet)} and {formatCurrency(game.maxBet)} per spin.
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="text-white font-semibold mb-2 flex items-center">
                    <span className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-2">2</span>
                    Spin the Reels
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Click the spin button to start the game. {game.reels ? `The ${game.reels} reels will spin` : 'The reels will spin'} and stop to reveal symbols.
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="text-white font-semibold mb-2 flex items-center">
                    <span className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-2">3</span>
                    Win Combinations
                  </h4>
                  <p className="text-gray-300 text-sm">
                    {game.paylines === 0 
                      ? 'Match symbols in clusters to win. Winning symbols disappear and new ones fall down.'
                      : `Match symbols across the ${game.paylines} paylines to win prizes.`
                    }
                  </p>
                </div>

                {game.features.includes('Free Spins') && (
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="text-white font-semibold mb-2 flex items-center">
                      <span className="w-6 h-6 bg-secondary-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-2">🎁</span>
                      Bonus Features
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Trigger special bonus rounds and free spins for bigger wins and enhanced gameplay.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-accent-green/10 border border-accent-green/30 rounded-lg">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-accent-green flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-accent-green font-semibold text-sm mb-1">Responsible Gaming</h4>
                    <p className="text-gray-300 text-xs">
                      Set limits for your gaming session and remember that gambling should be fun. Play responsibly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}