import { useState, useEffect, useRef } from 'react';
import { games, searchGames, gameProviders } from '../data/games';
import type { Game } from '../data/games';

interface GameSearchProps {
  onGameSelect?: (game: Game) => void;
  onSearchResults?: (results: Game[]) => void;
  placeholder?: string;
  className?: string;
}

export default function GameSearch({ 
  onGameSelect, 
  onSearchResults,
  placeholder = "Search games, providers, or features...",
  className = ""
}: GameSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Game[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length >= 2) {
      const searchResults = searchGames(query);
      setResults(searchResults.slice(0, 8)); // Limit to 8 results
      setIsOpen(true);
      setSelectedIndex(-1);
      
      // Notify parent component
      onSearchResults?.(searchResults);
    } else {
      setResults([]);
      setIsOpen(false);
      onSearchResults?.([]);
    }
  }, [query, onSearchResults]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleGameSelect = (game: Game) => {
    setQuery(game.title);
    setIsOpen(false);
    onGameSelect?.(game);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleGameSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      inputRef.current && 
      !inputRef.current.contains(e.target as Node) &&
      resultsRef.current &&
      !resultsRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getProviderName = (providerId: string) => {
    const provider = gameProviders.find(p => p.id === providerId);
    return provider?.name || providerId;
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-primary-500/30 text-primary-300 rounded px-1">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg 
            className="w-5 h-5 text-gray-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className="
            w-full pl-12 pr-4 py-3 
            bg-dark-900/50 border border-white/10 rounded-xl 
            text-white placeholder-gray-500 
            focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 
            transition-all duration-300
          "
        />

        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              onSearchResults?.([]);
            }}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div 
          ref={resultsRef}
          className="
            absolute top-full left-0 right-0 mt-2 
            bg-dark-800/95 backdrop-blur-lg border border-white/10 rounded-xl 
            shadow-2xl z-50 max-h-96 overflow-y-auto
          "
        >
          <div className="p-2">
            <div className="text-xs text-gray-400 px-3 py-2 border-b border-white/10">
              Found {results.length} game{results.length !== 1 ? 's' : ''}
            </div>
            
            {results.map((game, index) => (
              <button
                key={game.id}
                onClick={() => handleGameSelect(game)}
                className={`
                  w-full flex items-center space-x-3 p-3 rounded-lg text-left
                  transition-all duration-200 hover:bg-white/10
                  ${selectedIndex === index ? 'bg-primary-500/20 border border-primary-500/50' : ''}
                `}
              >
                {/* Game Thumbnail */}
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20">
                  <img 
                    src={game.thumbnail} 
                    alt={game.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Game Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-white font-semibold text-sm truncate">
                      {highlightMatch(game.title, query)}
                    </h4>
                    
                    {game.hot && (
                      <span className="text-xs bg-accent-red/20 text-accent-red px-2 py-0.5 rounded-full">
                        🔥 HOT
                      </span>
                    )}
                    
                    {game.new && (
                      <span className="text-xs bg-accent-green/20 text-accent-green px-2 py-0.5 rounded-full">
                        ✨ NEW
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3 text-xs text-gray-400">
                    <span>{getProviderName(game.provider)}</span>
                    <span>•</span>
                    <span>RTP {game.rtp}%</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      <span>{game.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Jackpot Badge */}
                {game.jackpot && (
                  <div className="flex-shrink-0">
                    <div className="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full font-semibold">
                      ${(game.jackpot / 1000000).toFixed(1)}M
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="
          absolute top-full left-0 right-0 mt-2 
          bg-dark-800/95 backdrop-blur-lg border border-white/10 rounded-xl 
          shadow-2xl z-50 p-6 text-center
        ">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.137 0-4.146.832-5.636 2.364M6 20.364A7.962 7.962 0 016 18c0-4.418 3.582-8 8-8s8 3.582 8 8a7.962 7.962 0 01-2 5.291" />
            </svg>
          </div>
          <p className="text-white font-semibold mb-1">No games found</p>
          <p className="text-gray-400 text-sm">
            Try searching for different keywords or browse our categories
          </p>
        </div>
      )}
    </div>
  );
}