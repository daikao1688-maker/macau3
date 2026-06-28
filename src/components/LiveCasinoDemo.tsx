import { useState, useEffect } from 'react';
import type { Game } from '../data/games';

interface LiveCasinoDemoProps {
  game: Game;
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

export default function LiveCasinoDemo({ game, balance, onBalanceChange }: LiveCasinoDemoProps) {
  const [betAmount, setBetAmount] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState('Welcome to Live Casino Demo!');
  const [dealerAction, setDealerAction] = useState('Waiting for bets...');
  const [chatMessages, setChatMessages] = useState<Array<{user: string, text: string}>>([
    { user: 'Dealer', text: 'Welcome to the table! Place your bets.' },
    { user: 'Player_123', text: 'Good luck everyone!' }
  ]);

  useEffect(() => {
    // Simulate dealer actions
    const dealerMessages = [
      'No more bets...',
      'Dealing cards...',
      'Good luck!',
      'Place your bets',
      'Last bets please'
    ];

    const interval = setInterval(() => {
      if (!isPlaying) {
        const randomMessage = dealerMessages[Math.floor(Math.random() * dealerMessages.length)];
        setDealerAction(randomMessage);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const placeBet = () => {
    if (balance < betAmount) {
      setMessage('Insufficient balance!');
      return;
    }

    setIsPlaying(true);
    setMessage('Bet placed! Waiting for round to start...');
    setDealerAction('No more bets...');
    onBalanceChange(balance - betAmount);

    // Simulate live round
    setTimeout(() => {
      setDealerAction('Dealing...');
    }, 2000);

    setTimeout(() => {
      const isWin = Math.random() > 0.5;
      
      if (isWin) {
        const winMultiplier = Math.floor(Math.random() * 3) + 2; // 2x to 4x
        const winAmount = betAmount * winMultiplier;
        onBalanceChange(balance - betAmount + winAmount);
        setMessage(`🎉 You Win! ${winMultiplier}x - $${winAmount}`);
        setDealerAction('Congratulations!');
        
        // Add chat message
        setChatMessages(prev => [...prev, 
          { user: 'You', text: `Won $${winAmount}! 🎉` }
        ].slice(-5));
      } else {
        setMessage('Better luck next time!');
        setDealerAction('Next round starting soon...');
        
        setChatMessages(prev => [...prev,
          { user: 'You', text: 'Almost had it!' }
        ].slice(-5));
      }

      setIsPlaying(false);
    }, 5000);
  };

  const adjustBet = (amount: number) => {
    const newBet = Math.max(game.minBet, Math.min(betAmount + amount, game.maxBet, balance));
    setBetAmount(newBet);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Live Stream Simulation */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-white/10 mb-6">
          {/* Video Stream Area */}
          <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900">
            {/* Simulated Live Stream */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full flex items-center justify-center border-4 border-primary-500/50 animate-pulse">
                  <svg className="w-16 h-16 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Live Dealer</h3>
                  <p className="text-gray-400 text-sm mb-4">{dealerAction}</p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-500 font-semibold text-sm">LIVE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Indicators */}
            <div className="absolute top-4 left-4 flex items-center gap-3">
              <div className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                LIVE
              </div>
              <div className="bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
                👥 {Math.floor(Math.random() * 50) + 20} watching
              </div>
            </div>

            {/* Game Info Overlay */}
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="text-xs text-gray-400 mb-1">Table ID</div>
              <div className="text-white font-bold">#{game.id.slice(0, 8).toUpperCase()}</div>
            </div>

            {/* Betting Area Overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/70 backdrop-blur-md rounded-lg p-4 border border-white/20">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Min Bet</div>
                    <div className="text-white font-bold">${game.minBet}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Max Bet</div>
                    <div className="text-white font-bold">${game.maxBet.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">RTP</div>
                    <div className="text-green-400 font-bold">{game.rtp}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Game Controls */}
          <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50">
            {/* Message Display */}
            {message && (
              <div className={`text-center py-3 px-4 rounded-lg mb-4 ${
                message.includes('Win') 
                  ? 'bg-green-500/20 border border-green-500/50 text-green-400' 
                  : message.includes('Insufficient')
                  ? 'bg-red-500/20 border border-red-500/50 text-red-400'
                  : 'bg-blue-500/20 border border-blue-500/50 text-blue-400'
              }`}>
                <p className="font-semibold">{message}</p>
              </div>
            )}

            {/* Bet Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-xs text-gray-400 mb-2">Your Bet</div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => adjustBet(-5)}
                    disabled={isPlaying}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center disabled:opacity-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-2xl font-bold text-white">${betAmount}</span>
                  <button
                    onClick={() => adjustBet(5)}
                    disabled={isPlaying}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center disabled:opacity-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-xs text-gray-400 mb-2">Round Status</div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">{isPlaying ? 'In Progress' : 'Accepting Bets'}</span>
                  <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
                </div>
              </div>
            </div>

            {/* Quick Bet Buttons */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[5, 10, 25, 50].map(amount => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  disabled={isPlaying}
                  className={`py-2 rounded-lg font-semibold text-sm transition-all ${
                    betAmount === amount
                      ? 'bg-primary-500 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                  } disabled:opacity-50`}
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Place Bet Button */}
            <button
              onClick={placeBet}
              disabled={isPlaying || balance < betAmount}
              className={`
                w-full py-4 rounded-xl font-bold text-lg transition-all duration-300
                ${isPlaying || balance < betAmount
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-green-500/50 transform hover:scale-105'
                }
              `}
            >
              {isPlaying ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Round in Progress...
                </span>
              ) : balance < betAmount ? (
                'Insufficient Balance'
              ) : (
                `PLACE BET - $${betAmount}`
              )}
            </button>
          </div>
        </div>

        {/* Live Chat Simulation */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            <h4 className="text-white font-semibold">Live Chat</h4>
            <span className="text-xs text-gray-400">(Demo)</span>
          </div>
          
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {chatMessages.map((msg, i) => (
              <div key={i} className="text-sm">
                <span className={`font-semibold ${msg.user === 'Dealer' ? 'text-primary-400' : msg.user === 'You' ? 'text-green-400' : 'text-gray-400'}`}>
                  {msg.user}:
                </span>
                <span className="text-gray-300 ml-2">{msg.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Game Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
            <div className="text-2xl mb-2">🎥</div>
            <div className="text-xs text-gray-400 mb-1">HD Stream</div>
            <div className="text-white font-semibold text-sm">1080p</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
            <div className="text-2xl mb-2">💬</div>
            <div className="text-xs text-gray-400 mb-1">Live Chat</div>
            <div className="text-white font-semibold text-sm">Active</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
            <div className="text-2xl mb-2">👤</div>
            <div className="text-xs text-gray-400 mb-1">Dealer</div>
            <div className="text-white font-semibold text-sm">Professional</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-xs text-gray-400 mb-1">Speed</div>
            <div className="text-white font-semibold text-sm">Real-time</div>
          </div>
        </div>
      </div>
    </div>
  );
}
