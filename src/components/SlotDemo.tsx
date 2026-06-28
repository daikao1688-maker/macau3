import { useState } from 'react';
import type { Game } from '../data/games';
import { getDemoTheme, getThemeStyles } from '../data/demoThemes';

interface SlotDemoProps {
  game: Game;
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

export default function SlotDemo({ game, balance, onBalanceChange }: SlotDemoProps) {
  // Get unique theme for this game
  const theme = getDemoTheme(game);
  const themeStyles = getThemeStyles(theme);
  const slotSymbols = theme.symbols || ['🍒', '🍋', '🍊', '🍇', '💎', '⭐', '7️⃣', '🔔', '💰', 'BAR'];
  
  const [reels, setReels] = useState([
    [slotSymbols[0], slotSymbols[1], slotSymbols[2]],
    [slotSymbols[3], slotSymbols[4], slotSymbols[5]],
    [slotSymbols[6], slotSymbols[7], slotSymbols[8]]
  ]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [betAmount, setBetAmount] = useState(Math.max(10, game.minBet));
  const [lastWin, setLastWin] = useState(0);
  const [message, setMessage] = useState('');

  const spin = () => {
    if (isSpinning) return;
    if (balance < betAmount) {
      setMessage('Insufficient balance!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    setIsSpinning(true);
    setLastWin(0);
    setMessage('');
    
    // Deduct bet
    onBalanceChange(balance - betAmount);

    // Simulate spinning animation
    const spinDuration = theme.animationSpeed === 'fast' ? 1500 : theme.animationSpeed === 'slow' ? 2500 : 2000;
    const spinInterval = setInterval(() => {
      setReels(prev => prev.map(reel => 
        reel.map(() => slotSymbols[Math.floor(Math.random() * slotSymbols.length)])
      ));
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      
      // Final result
      const finalReels = [
        [slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
         slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
         slotSymbols[Math.floor(Math.random() * slotSymbols.length)]],
        [slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
         slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
         slotSymbols[Math.floor(Math.random() * slotSymbols.length)]],
        [slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
         slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
         slotSymbols[Math.floor(Math.random() * slotSymbols.length)]]
      ];

      // Check for wins (middle row)
      const middleRow = [finalReels[0][1], finalReels[1][1], finalReels[2][1]];
      const isWin = middleRow[0] === middleRow[1] && middleRow[1] === middleRow[2];
      
      if (isWin) {
        const winMultiplier = Math.floor(Math.random() * 10) + 5; // 5x to 15x
        const winAmount = betAmount * winMultiplier;
        setLastWin(winAmount);
        onBalanceChange(balance - betAmount + winAmount);
        setMessage(`🎉 WIN! ${winMultiplier}x - $${winAmount}`);
      } else {
        // Small consolation prize sometimes
        if (Math.random() > 0.7) {
          const smallWin = betAmount * 2;
          setLastWin(smallWin);
          onBalanceChange(balance - betAmount + smallWin);
          setMessage(`✨ Small Win! $${smallWin}`);
        } else {
          setMessage('Try again!');
        }
      }

      setReels(finalReels);
      setIsSpinning(false);
    }, spinDuration);
  };

  const adjustBet = (amount: number) => {
    const newBet = Math.max(game.minBet, Math.min(betAmount + amount, game.maxBet, balance));
    setBetAmount(newBet);
  };

  // Get button gradient based on theme
  const getButtonGradient = () => {
    switch (theme.atmosphere) {
      case 'luxury':
        return 'from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 shadow-yellow-500/50';
      case 'mystical':
        return 'from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-purple-500/50';
      case 'adventure':
        return 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-green-500/50';
      case 'festive':
        return 'from-red-500 to-green-600 hover:from-red-600 hover:to-green-700 shadow-red-500/50';
      case 'electric':
        return 'from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 shadow-cyan-500/50';
      default:
        return 'from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-500/50';
    }
  };

  return (
    <div className="p-6 md:p-8" style={themeStyles}>
      <div className="max-w-4xl mx-auto">
        {/* Slot Machine */}
        <div className={`bg-gradient-to-br ${theme.reelBackground} rounded-2xl p-6 md:p-8 border border-white/10 mb-6 relative overflow-hidden`}>
          {/* Theme-specific background effect */}
          {theme.particleEffect && (
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
              <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
            </div>
          )}
          
          {/* Game Title Badge */}
          <div className="absolute top-4 left-4 z-10">
            <div className={`px-4 py-2 rounded-lg font-bold text-sm backdrop-blur-sm border ${
              theme.atmosphere === 'luxury' ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/50 text-yellow-400' :
              theme.atmosphere === 'mystical' ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border-purple-500/50 text-purple-400' :
              theme.atmosphere === 'adventure' ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50 text-green-400' :
              theme.atmosphere === 'festive' ? 'bg-gradient-to-r from-red-500/20 to-green-500/20 border-red-500/50 text-red-400' :
              theme.atmosphere === 'electric' ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/50 text-cyan-400' :
              'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/50 text-blue-400'
            }`}>
              {game.title}
            </div>
          </div>
          
          {/* Reels */}
          <div className="grid grid-cols-3 gap-4 mb-6 mt-16">
            {reels.map((reel, reelIndex) => (
              <div key={reelIndex} className="space-y-2">
                {reel.map((symbol, symbolIndex) => (
                  <div
                    key={symbolIndex}
                    className={`
                      aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl 
                      flex items-center justify-center text-4xl md:text-5xl border-2
                      ${symbolIndex === 1 ? `border-[var(--theme-accent)] shadow-lg ${theme.glowEffect ? 'shadow-[var(--theme-accent)]/50' : ''}` : 'border-white/10'}
                      ${isSpinning ? 'animate-pulse' : ''}
                      transition-all duration-300
                    `}
                    style={{
                      backgroundColor: symbolIndex === 1 ? 'rgba(0,0,0,0.3)' : undefined
                    }}
                  >
                    {symbol}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Payline Indicator */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className={`h-0.5 flex-1 bg-gradient-to-r from-transparent via-[var(--theme-accent)] to-transparent`}></div>
            <span className="text-xs font-bold" style={{ color: theme.accentColor }}>PAYLINE</span>
            <div className={`h-0.5 flex-1 bg-gradient-to-r from-[var(--theme-accent)] via-[var(--theme-accent)] to-transparent`}></div>
          </div>

          {/* Message */}
          {message && (
            <div className={`text-center py-3 px-4 rounded-lg mb-4 backdrop-blur-sm ${
              lastWin > 0 
                ? 'bg-green-500/20 border border-green-500/50 text-green-400' 
                : 'bg-blue-500/20 border border-blue-500/50 text-blue-400'
            } ${theme.glowEffect && lastWin > 0 ? 'shadow-lg shadow-green-500/30' : ''}`}>
              <p className="font-bold text-lg">{message}</p>
            </div>
          )}

          {/* Bet Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-xs text-gray-400 mb-2">Bet Amount</div>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => adjustBet(-5)}
                  disabled={isSpinning}
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center disabled:opacity-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-xl font-bold text-white">${betAmount}</span>
                <button
                  onClick={() => adjustBet(5)}
                  disabled={isSpinning}
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center disabled:opacity-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-xs text-gray-400 mb-2">Last Win</div>
              <div className="text-xl font-bold text-green-400">${lastWin}</div>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-xs text-gray-400 mb-2">RTP</div>
              <div className="text-xl font-bold text-blue-400">{game.rtp}%</div>
            </div>
          </div>

          {/* Spin Button */}
          <button
            onClick={spin}
            disabled={isSpinning || balance < betAmount}
            className={`
              w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 relative overflow-hidden
              ${isSpinning || balance < betAmount
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : `bg-gradient-to-r ${getButtonGradient()} text-white shadow-lg transform hover:scale-105`
              }
            `}
          >
            {isSpinning ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Spinning...
              </span>
            ) : balance < betAmount ? (
              'Insufficient Balance'
            ) : (
              `SPIN - $${betAmount}`
            )}
          </button>
        </div>

        {/* Game Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
            <div className="text-xs text-gray-400 mb-1">Min Bet</div>
            <div className="text-lg font-bold text-white">${game.minBet}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
            <div className="text-xs text-gray-400 mb-1">Max Bet</div>
            <div className="text-lg font-bold text-white">${game.maxBet}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
            <div className="text-xs text-gray-400 mb-1">Volatility</div>
            <div className="text-lg font-bold text-white capitalize">{game.volatility}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
            <div className="text-xs text-gray-400 mb-1">Paylines</div>
            <div className="text-lg font-bold text-white">{game.paylines || 'Cluster'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
