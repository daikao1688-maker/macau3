import { useState } from 'react';
import type { Game } from '../data/games';

interface RouletteDemoProps {
  game: Game;
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const rouletteNumbers = [
  { num: 0, color: 'green' },
  ...Array.from({ length: 36 }, (_, i) => ({
    num: i + 1,
    color: [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(i + 1) ? 'red' : 'black'
  }))
];

export default function RouletteDemo({ game, balance, onBalanceChange }: RouletteDemoProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBet, setSelectedBet] = useState<{type: string, value: any} | null>(null);
  const [message, setMessage] = useState('');
  const [rotation, setRotation] = useState(0);

  const placeBet = (type: string, value: any) => {
    if (isSpinning) return;
    setSelectedBet({ type, value });
    setMessage(`Bet placed on ${type}: ${value}`);
  };

  const spin = () => {
    if (isSpinning || !selectedBet) {
      setMessage('Please place a bet first!');
      return;
    }
    if (balance < betAmount) {
      setMessage('Insufficient balance!');
      return;
    }

    setIsSpinning(true);
    setMessage('Spinning...');
    onBalanceChange(balance - betAmount);

    // Simulate spin
    const spinDuration = 3000;
    const finalNumber = Math.floor(Math.random() * 37); // 0-36
    const finalRotation = rotation + 360 * 5 + (finalNumber * (360 / 37));
    
    setRotation(finalRotation);

    setTimeout(() => {
      setResult(finalNumber);
      const resultData = rouletteNumbers.find(n => n.num === finalNumber);
      
      // Check win
      let isWin = false;
      let winMultiplier = 0;

      if (selectedBet.type === 'number' && selectedBet.value === finalNumber) {
        isWin = true;
        winMultiplier = 35; // Straight up
      } else if (selectedBet.type === 'color' && selectedBet.value === resultData?.color) {
        isWin = true;
        winMultiplier = 2;
      } else if (selectedBet.type === 'even' && finalNumber % 2 === 0 && finalNumber !== 0) {
        isWin = true;
        winMultiplier = 2;
      } else if (selectedBet.type === 'odd' && finalNumber % 2 === 1) {
        isWin = true;
        winMultiplier = 2;
      }

      if (isWin) {
        const winAmount = betAmount * winMultiplier;
        onBalanceChange(balance - betAmount + winAmount);
        setMessage(`🎉 WIN! Number ${finalNumber} (${resultData?.color}) - $${winAmount}`);
      } else {
        setMessage(`Number ${finalNumber} (${resultData?.color}) - Try again!`);
      }

      setIsSpinning(false);
    }, spinDuration);
  };

  const adjustBet = (amount: number) => {
    const newBet = Math.max(game.minBet, Math.min(betAmount + amount, game.maxBet, balance));
    setBetAmount(newBet);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Roulette Wheel */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 md:p-8 border border-white/10 mb-6">
          <div className="flex flex-col items-center mb-6">
            {/* Wheel */}
            <div className="relative w-64 h-64 mb-6">
              <div 
                className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-900 to-amber-950 border-8 border-amber-600 shadow-2xl transition-transform duration-3000 ease-out"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {/* Wheel segments */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-gray-900 to-black border-4 border-amber-700 flex items-center justify-center">
                  <div className="text-4xl font-bold text-amber-400">
                    {result !== null ? result : '?'}
                  </div>
                </div>
              </div>
              
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-white z-10"></div>
            </div>

            {/* Result Display */}
            {result !== null && (
              <div className={`px-6 py-3 rounded-lg font-bold text-xl ${
                rouletteNumbers.find(n => n.num === result)?.color === 'red' 
                  ? 'bg-red-500/20 border border-red-500/50 text-red-400'
                  : rouletteNumbers.find(n => n.num === result)?.color === 'black'
                  ? 'bg-gray-700/50 border border-gray-500/50 text-white'
                  : 'bg-green-500/20 border border-green-500/50 text-green-400'
              }`}>
                {result} - {rouletteNumbers.find(n => n.num === result)?.color.toUpperCase()}
              </div>
            )}
          </div>

          {/* Message */}
          {message && (
            <div className="text-center py-3 px-4 rounded-lg mb-4 bg-blue-500/20 border border-blue-500/50">
              <p className="font-semibold text-blue-400">{message}</p>
            </div>
          )}

          {/* Betting Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => placeBet('color', 'red')}
              disabled={isSpinning}
              className={`py-4 rounded-lg font-bold transition-all ${
                selectedBet?.type === 'color' && selectedBet?.value === 'red'
                  ? 'bg-red-600 text-white ring-2 ring-red-400'
                  : 'bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30'
              } disabled:opacity-50`}
            >
              RED (2x)
            </button>
            
            <button
              onClick={() => placeBet('color', 'black')}
              disabled={isSpinning}
              className={`py-4 rounded-lg font-bold transition-all ${
                selectedBet?.type === 'color' && selectedBet?.value === 'black'
                  ? 'bg-gray-700 text-white ring-2 ring-gray-400'
                  : 'bg-gray-700/50 border border-gray-500/50 text-white hover:bg-gray-700/70'
              } disabled:opacity-50`}
            >
              BLACK (2x)
            </button>
            
            <button
              onClick={() => placeBet('color', 'green')}
              disabled={isSpinning}
              className={`py-4 rounded-lg font-bold transition-all ${
                selectedBet?.type === 'color' && selectedBet?.value === 'green'
                  ? 'bg-green-600 text-white ring-2 ring-green-400'
                  : 'bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30'
              } disabled:opacity-50`}
            >
              GREEN (35x)
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => placeBet('even', true)}
              disabled={isSpinning}
              className={`py-4 rounded-lg font-bold transition-all ${
                selectedBet?.type === 'even'
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                  : 'bg-blue-500/20 border border-blue-500/50 text-blue-400 hover:bg-blue-500/30'
              } disabled:opacity-50`}
            >
              EVEN (2x)
            </button>
            
            <button
              onClick={() => placeBet('odd', true)}
              disabled={isSpinning}
              className={`py-4 rounded-lg font-bold transition-all ${
                selectedBet?.type === 'odd'
                  ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                  : 'bg-purple-500/20 border border-purple-500/50 text-purple-400 hover:bg-purple-500/30'
              } disabled:opacity-50`}
            >
              ODD (2x)
            </button>
          </div>

          {/* Bet Amount Control */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-4">
            <div className="text-xs text-gray-400 mb-2">Bet Amount</div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => adjustBet(-5)}
                disabled={isSpinning}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                </svg>
              </button>
              <span className="text-2xl font-bold text-white">${betAmount}</span>
              <button
                onClick={() => adjustBet(5)}
                disabled={isSpinning}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Spin Button */}
          <button
            onClick={spin}
            disabled={isSpinning || !selectedBet || balance < betAmount}
            className={`
              w-full py-4 rounded-xl font-bold text-lg transition-all duration-300
              ${isSpinning || !selectedBet || balance < betAmount
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-amber-500/50 transform hover:scale-105'
              }
            `}
          >
            {isSpinning ? 'Spinning...' : !selectedBet ? 'Place a Bet First' : balance < betAmount ? 'Insufficient Balance' : `SPIN - $${betAmount}`}
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
            <div className="text-xs text-gray-400 mb-1">RTP</div>
            <div className="text-lg font-bold text-white">{game.rtp}%</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
            <div className="text-xs text-gray-400 mb-1">Type</div>
            <div className="text-lg font-bold text-white">European</div>
          </div>
        </div>
      </div>
    </div>
  );
}
