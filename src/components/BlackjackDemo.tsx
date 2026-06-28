import { useState } from 'react';
import type { Game } from '../data/games';

interface BlackjackDemoProps {
  game: Game;
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const cards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suits = ['♠️', '♥️', '♣️', '♦️'];

export default function BlackjackDemo({ game, balance, onBalanceChange }: BlackjackDemoProps) {
  const [playerHand, setPlayerHand] = useState<string[]>([]);
  const [dealerHand, setDealerHand] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'finished'>('betting');
  const [betAmount, setBetAmount] = useState(10);
  const [message, setMessage] = useState('Place your bet and deal!');

  const getCardValue = (card: string): number => {
    if (card === 'A') return 11;
    if (['J', 'Q', 'K'].includes(card)) return 10;
    return parseInt(card);
  };

  const getHandValue = (hand: string[]): number => {
    let value = hand.reduce((sum, card) => sum + getCardValue(card.split(' ')[0]), 0);
    let aces = hand.filter(card => card.startsWith('A')).length;
    
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }
    
    return value;
  };

  const drawCard = (): string => {
    const card = cards[Math.floor(Math.random() * cards.length)];
    const suit = suits[Math.floor(Math.random() * suits.length)];
    return `${card} ${suit}`;
  };

  const deal = () => {
    if (balance < betAmount) {
      setMessage('Insufficient balance!');
      return;
    }

    onBalanceChange(balance - betAmount);
    const newPlayerHand = [drawCard(), drawCard()];
    const newDealerHand = [drawCard(), '🎴']; // Hidden card
    
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setGameState('playing');
    setMessage('Hit or Stand?');
  };

  const hit = () => {
    const newHand = [...playerHand, drawCard()];
    setPlayerHand(newHand);
    
    const value = getHandValue(newHand);
    if (value > 21) {
      setMessage(`Bust! You lose $${betAmount}`);
      setGameState('finished');
    } else if (value === 21) {
      stand();
    }
  };

  const stand = () => {
    // Reveal dealer's hidden card and play dealer's hand
    let newDealerHand = [dealerHand[0], drawCard()];
    
    while (getHandValue(newDealerHand) < 17) {
      newDealerHand.push(drawCard());
    }
    
    setDealerHand(newDealerHand);
    
    const playerValue = getHandValue(playerHand);
    const dealerValue = getHandValue(newDealerHand);
    
    if (dealerValue > 21) {
      const winAmount = betAmount * 2;
      onBalanceChange(balance + winAmount);
      setMessage(`Dealer busts! You win $${winAmount}`);
    } else if (playerValue > dealerValue) {
      const winAmount = betAmount * 2;
      onBalanceChange(balance + winAmount);
      setMessage(`You win! $${winAmount}`);
    } else if (playerValue === dealerValue) {
      onBalanceChange(balance + betAmount);
      setMessage('Push! Bet returned');
    } else {
      setMessage(`Dealer wins! You lose $${betAmount}`);
    }
    
    setGameState('finished');
  };

  const newGame = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setGameState('betting');
    setMessage('Place your bet and deal!');
  };

  const adjustBet = (amount: number) => {
    const newBet = Math.max(game.minBet, Math.min(betAmount + amount, game.maxBet, balance));
    setBetAmount(newBet);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-green-900/30 to-green-950/30 rounded-2xl p-6 md:p-8 border border-green-500/20 mb-6">
          {/* Dealer Hand */}
          <div className="mb-8">
            <div className="text-sm text-gray-400 mb-3">Dealer's Hand {gameState !== 'betting' && `(${dealerHand[1] === '🎴' ? '?' : getHandValue(dealerHand)})`}</div>
            <div className="flex flex-wrap gap-3">
              {dealerHand.length > 0 ? dealerHand.map((card, i) => (
                <div key={i} className="w-20 h-28 bg-white rounded-lg shadow-lg flex items-center justify-center text-2xl font-bold">
                  {card}
                </div>
              )) : (
                <div className="text-gray-500">Waiting...</div>
              )}
            </div>
          </div>

          {/* Player Hand */}
          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-3">Your Hand {gameState !== 'betting' && `(${getHandValue(playerHand)})`}</div>
            <div className="flex flex-wrap gap-3">
              {playerHand.length > 0 ? playerHand.map((card, i) => (
                <div key={i} className="w-20 h-28 bg-white rounded-lg shadow-lg flex items-center justify-center text-2xl font-bold animate-slideInDown">
                  {card}
                </div>
              )) : (
                <div className="text-gray-500">Waiting...</div>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="text-center py-3 px-4 rounded-lg mb-6 bg-blue-500/20 border border-blue-500/50">
            <p className="font-semibold text-blue-400">{message}</p>
          </div>

          {/* Controls */}
          {gameState === 'betting' && (
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-xs text-gray-400 mb-2">Bet Amount</div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => adjustBet(-5)}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-2xl font-bold text-white">${betAmount}</span>
                  <button
                    onClick={() => adjustBet(5)}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <button
                onClick={deal}
                disabled={balance < betAmount}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl transition-all disabled:opacity-50"
              >
                DEAL - ${betAmount}
              </button>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={hit}
                className="py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all"
              >
                HIT
              </button>
              <button
                onClick={stand}
                className="py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl transition-all"
              >
                STAND
              </button>
            </div>
          )}

          {gameState === 'finished' && (
            <button
              onClick={newGame}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all"
            >
              NEW GAME
            </button>
          )}
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
            <div className="text-xs text-gray-400 mb-1">Decks</div>
            <div className="text-lg font-bold text-white">6</div>
          </div>
        </div>
      </div>
    </div>
  );
}
