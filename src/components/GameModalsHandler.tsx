import { useState, useEffect } from 'react';
import GameDetailModal from './GameDetailModal';
import DemoGameModal from './DemoGameModal';
import { games } from '../data/games';
import type { Game } from '../data/games';

export default function GameModalsHandler() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const openGameDetail = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (game) {
      setSelectedGame(game);
      setIsDetailModalOpen(true);
    }
  };

  const openGameDemo = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (game) {
      setSelectedGame(game);
      setIsDemoModalOpen(true);
    }
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setTimeout(() => {
      if (!isDemoModalOpen) {
        setSelectedGame(null);
      }
    }, 300);
  };

  const closeDemoModal = () => {
    setIsDemoModalOpen(false);
    setTimeout(() => {
      if (!isDetailModalOpen) {
        setSelectedGame(null);
      }
    }, 300);
  };

  // Listen for game card clicks
  useEffect(() => {
    const handleGameClick = (event: Event) => {
      const target = event.target as HTMLElement;
      
      // Check for detail button
      const detailButton = target.closest('.game-detail-btn, .game-info-btn') as HTMLElement;
      if (detailButton) {
        event.preventDefault();
        const gameId = detailButton.getAttribute('data-game-id');
        if (gameId) {
          openGameDetail(gameId);
        }
        return;
      }

      // Check for demo button
      const demoButton = target.closest('.play-demo-btn') as HTMLElement;
      if (demoButton) {
        event.preventDefault();
        const gameId = demoButton.getAttribute('data-game-id');
        if (gameId) {
          // Close detail modal if open, then open demo
          if (isDetailModalOpen) {
            setIsDetailModalOpen(false);
          }
          openGameDemo(gameId);
        }
        return;
      }
    };

    document.addEventListener('click', handleGameClick);
    
    return () => {
      document.removeEventListener('click', handleGameClick);
    };
  }, [isDetailModalOpen]);

  return (
    <>
      <GameDetailModal 
        game={selectedGame}
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
      />
      
      <DemoGameModal 
        game={selectedGame}
        isOpen={isDemoModalOpen}
        onClose={closeDemoModal}
      />
    </>
  );
}
