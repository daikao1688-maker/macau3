import gamesContent from '../../content/casino/games.json';
import providersContent from '../../content/casino/providers.json';

export interface GameProvider {
  id: string;
  name: string;
  logo: string;
  established: number;
  description: string;
}

export interface Game {
  id: string;
  title: string;
  slug: string;
  category: 'slots' | 'table-games' | 'live-casino' | 'jackpots' | 'poker' | 'game-shows';
  subcategory?: string;
  provider: string;
  image: string;
  thumbnail: string;
  jackpot?: number;
  rating: number;
  players: number;
  hot: boolean;
  new: boolean;
  featured: boolean;
  rtp: number;
  volatility: 'low' | 'medium' | 'high';
  minBet: number;
  maxBet: number;
  paylines?: number;
  reels?: number;
  features: string[];
  description: string;
  releaseDate: string;
  tags: string[];
  popularity: number;
  lastPlayed?: string;
}

export const gameProviders = providersContent.providers as GameProvider[];
export const games = gamesContent.games as Game[];

// Game categories for filtering
export const gameCategories = [
  { id: 'all', name: 'All Games', count: games.length, icon: '🎮' },
  { id: 'slots', name: 'Slots', count: games.filter((g) => g.category === 'slots').length, icon: '🎰' },
  { id: 'jackpots', name: 'Jackpots', count: games.filter((g) => g.category === 'jackpots').length, icon: '💰' },
  { id: 'live-casino', name: 'Live Casino', count: games.filter((g) => g.category === 'live-casino').length, icon: '🎥' },
  { id: 'table-games', name: 'Table Games', count: games.filter((g) => g.category === 'table-games').length, icon: '🃏' },
  { id: 'poker', name: 'Poker', count: games.filter((g) => g.category === 'poker').length, icon: '♠️' },
  { id: 'game-shows', name: 'Game Shows', count: games.filter((g) => g.category === 'game-shows').length, icon: '🎪' }
];

// Utility functions
export const getGamesByCategory = (category: string) => {
  if (category === 'all') return games;
  return games.filter((game) => game.category === category);
};

export const getGamesByProvider = (provider: string) => {
  return games.filter((game) => game.provider === provider);
};

export const getFeaturedGames = () => {
  return games.filter((game) => game.featured);
};

export const getHotGames = () => {
  return games.filter((game) => game.hot);
};

export const getNewGames = () => {
  return games.filter((game) => game.new);
};

export const getJackpotGames = () => {
  return games.filter((game) => game.jackpot && game.jackpot > 0);
};

export const searchGames = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return games.filter((game) =>
    game.title.toLowerCase().includes(lowercaseQuery) ||
    game.provider.toLowerCase().includes(lowercaseQuery) ||
    game.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)) ||
    game.description.toLowerCase().includes(lowercaseQuery)
  );
};

export const sortGames = (games: Game[], sortBy: 'popularity' | 'rating' | 'rtp' | 'newest' | 'jackpot') => {
  return [...games].sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return b.popularity - a.popularity;
      case 'rating':
        return b.rating - a.rating;
      case 'rtp':
        return b.rtp - a.rtp;
      case 'newest':
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      case 'jackpot':
        return (b.jackpot || 0) - (a.jackpot || 0);
      default:
        return 0;
    }
  });
};
