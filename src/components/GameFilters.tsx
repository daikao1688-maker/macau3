import { useState, useEffect } from 'react';
import { gameCategories, gameProviders, games } from '../data/games';
import type { Game } from '../data/games';

interface GameFiltersProps {
  onFilterChange: (filteredGames: Game[]) => void;
  className?: string;
}

interface FilterState {
  category: string;
  provider: string;
  volatility: string;
  minRtp: number;
  maxRtp: number;
  hasJackpot: boolean;
  isHot: boolean;
  isNew: boolean;
  sortBy: 'popularity' | 'rating' | 'rtp' | 'newest' | 'jackpot' | 'name';
  sortOrder: 'asc' | 'desc';
}

export default function GameFilters({ onFilterChange, className = '' }: GameFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    provider: 'all',
    volatility: 'all',
    minRtp: 85,
    maxRtp: 100,
    hasJackpot: false,
    isHot: false,
    isNew: false,
    sortBy: 'popularity',
    sortOrder: 'desc'
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [resultCount, setResultCount] = useState(games.length);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const applyFilters = () => {
    let filteredGames = [...games];

    // Category filter
    if (filters.category !== 'all') {
      filteredGames = filteredGames.filter(game => game.category === filters.category);
    }

    // Provider filter
    if (filters.provider !== 'all') {
      filteredGames = filteredGames.filter(game => game.provider === filters.provider);
    }

    // Volatility filter
    if (filters.volatility !== 'all') {
      filteredGames = filteredGames.filter(game => game.volatility === filters.volatility);
    }

    // RTP filter
    filteredGames = filteredGames.filter(game => 
      game.rtp >= filters.minRtp && game.rtp <= filters.maxRtp
    );

    // Jackpot filter
    if (filters.hasJackpot) {
      filteredGames = filteredGames.filter(game => game.jackpot && game.jackpot > 0);
    }

    // Hot games filter
    if (filters.isHot) {
      filteredGames = filteredGames.filter(game => game.hot);
    }

    // New games filter
    if (filters.isNew) {
      filteredGames = filteredGames.filter(game => game.new);
    }

    // Sort games
    filteredGames.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'popularity':
          comparison = b.popularity - a.popularity;
          break;
        case 'rating':
          comparison = b.rating - a.rating;
          break;
        case 'rtp':
          comparison = b.rtp - a.rtp;
          break;
        case 'newest':
          comparison = new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
          break;
        case 'jackpot':
          comparison = (b.jackpot || 0) - (a.jackpot || 0);
          break;
        case 'name':
          comparison = a.title.localeCompare(b.title);
          break;
        default:
          comparison = 0;
      }

      return filters.sortOrder === 'asc' ? -comparison : comparison;
    });

    setResultCount(filteredGames.length);
    onFilterChange(filteredGames);
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      provider: 'all',
      volatility: 'all',
      minRtp: 85,
      maxRtp: 100,
      hasJackpot: false,
      isHot: false,
      isNew: false,
      sortBy: 'popularity',
      sortOrder: 'desc'
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.provider !== 'all') count++;
    if (filters.volatility !== 'all') count++;
    if (filters.minRtp > 85 || filters.maxRtp < 100) count++;
    if (filters.hasJackpot) count++;
    if (filters.isHot) count++;
    if (filters.isNew) count++;
    return count;
  };

  return (
    <div className={`bg-dark-800/50 backdrop-blur-lg border border-white/10 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-white font-display font-bold text-lg">Filters & Sort</h3>
          {getActiveFilterCount() > 0 && (
            <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-gray-400 text-sm">
            {resultCount} game{resultCount !== 1 ? 's' : ''} found
          </span>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors lg:hidden"
          >
            <svg 
              className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={`space-y-6 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        {/* Quick Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <label className="flex items-center space-x-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.hasJackpot}
              onChange={(e) => updateFilter('hasJackpot', e.target.checked)}
              className="w-4 h-4 bg-dark-900 border-white/20 rounded text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
            />
            <span className="text-gray-300 group-hover:text-white transition-colors text-sm">
              💰 Jackpots Only
            </span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.isHot}
              onChange={(e) => updateFilter('isHot', e.target.checked)}
              className="w-4 h-4 bg-dark-900 border-white/20 rounded text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
            />
            <span className="text-gray-300 group-hover:text-white transition-colors text-sm">
              🔥 Hot Games
            </span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.isNew}
              onChange={(e) => updateFilter('isNew', e.target.checked)}
              className="w-4 h-4 bg-dark-900 border-white/20 rounded text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
            />
            <span className="text-gray-300 group-hover:text-white transition-colors text-sm">
              ✨ New Games
            </span>
          </label>

          <button
            onClick={resetFilters}
            className="text-gray-400 hover:text-primary-500 transition-colors text-sm font-medium"
          >
            🔄 Reset All
          </button>
        </div>

        {/* Main Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full bg-dark-900/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20"
            >
              {gameCategories.map(category => (
                <option key={category.id} value={category.id} className="bg-dark-800">
                  {category.icon} {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>

          {/* Provider */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Provider</label>
            <select
              value={filters.provider}
              onChange={(e) => updateFilter('provider', e.target.value)}
              className="w-full bg-dark-900/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="all" className="bg-dark-800">All Providers</option>
              {gameProviders.map(provider => (
                <option key={provider.id} value={provider.id} className="bg-dark-800">
                  {provider.name}
                </option>
              ))}
            </select>
          </div>

          {/* Volatility */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Volatility</label>
            <select
              value={filters.volatility}
              onChange={(e) => updateFilter('volatility', e.target.value)}
              className="w-full bg-dark-900/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="all" className="bg-dark-800">All Volatility</option>
              <option value="low" className="bg-dark-800">🟢 Low Risk</option>
              <option value="medium" className="bg-dark-800">🟡 Medium Risk</option>
              <option value="high" className="bg-dark-800">🔴 High Risk</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Sort By</label>
            <div className="flex space-x-2">
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className="flex-1 bg-dark-900/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="popularity" className="bg-dark-800">Popularity</option>
                <option value="rating" className="bg-dark-800">Rating</option>
                <option value="rtp" className="bg-dark-800">RTP</option>
                <option value="newest" className="bg-dark-800">Newest</option>
                <option value="jackpot" className="bg-dark-800">Jackpot</option>
                <option value="name" className="bg-dark-800">Name</option>
              </select>
              
              <button
                onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                className="w-10 h-10 bg-dark-900/50 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:border-primary-500/50 transition-all"
              >
                <svg 
                  className={`w-4 h-4 transform transition-transform ${filters.sortOrder === 'asc' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* RTP Range */}
        <div>
          <label className="block text-gray-300 text-sm font-semibold mb-3">
            RTP Range: {filters.minRtp}% - {filters.maxRtp}%
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="85"
              max="100"
              step="0.1"
              value={filters.minRtp}
              onChange={(e) => updateFilter('minRtp', parseFloat(e.target.value))}
              className="flex-1 h-2 bg-dark-900 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-gray-400 text-sm w-12">Min</span>
            <input
              type="range"
              min="85"
              max="100"
              step="0.1"
              value={filters.maxRtp}
              onChange={(e) => updateFilter('maxRtp', parseFloat(e.target.value))}
              className="flex-1 h-2 bg-dark-900 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-gray-400 text-sm w-12">Max</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add custom slider styles
const sliderStyles = `
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f59e0b, #6366f1);
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  .slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f59e0b, #6366f1);
    cursor: pointer;
    border: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = sliderStyles;
  document.head.appendChild(styleSheet);
}