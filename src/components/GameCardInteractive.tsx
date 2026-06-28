import { useState, useEffect } from 'react';
import GameDetailModal from './GameDetailModal';
import { games } from '../data/games';
import type { Game } from '../data/games';

export default function GameCardInteractive() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openGameDetail = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (game) {
      setSelectedGame(game);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedGame(null), 300);
  };

  // Listen for game card clicks
  useEffect(() => {
    const handleGameClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const button = target.closest('.game-detail-btn, .game-info-btn') as HTMLElement;
      
      if (button) {
        event.preventDefault();
        const gameId = button.getAttribute('data-game-id');
        if (gameId) {
          openGameDetail(gameId);
        }
      }
    };

    document.addEventListener('click', handleGameClick);
    
    return () => {
      document.removeEventListener('click', handleGameClick);
    };
  }, []);

  return (
    <GameDetailModal 
      game={selectedGame}
      isOpen={isModalOpen}
      onClose={closeModal}
    />
  );
}
