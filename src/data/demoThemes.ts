// Demo Game Themes Configuration
// Unique visual themes for each game to make demos feel realistic and personalized

import type { Game } from './games';

export interface DemoTheme {
  // Visual Theme
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  
  // Slot-specific
  symbols?: string[];
  reelBackground?: string;
  
  // Atmosphere
  atmosphere: 'classic' | 'modern' | 'luxury' | 'adventure' | 'mystical' | 'festive' | 'electric';
  
  // UI Elements
  buttonStyle: 'rounded' | 'sharp' | 'pill' | 'hexagon';
  fontStyle: 'classic' | 'modern' | 'bold' | 'elegant';
  
  // Effects
  glowEffect: boolean;
  particleEffect: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
}

// Game-specific theme configurations
export const gameDemoThemes: Record<string, DemoTheme> = {
  // MEGA MOOLAH - Safari/Animal Theme
  'mega-moolah': {
    primaryColor: '#D4AF37', // Gold
    secondaryColor: '#8B4513', // Brown
    accentColor: '#FF6B35', // Orange
    backgroundColor: '#2C1810',
    gradientFrom: '#8B4513',
    gradientTo: '#2C1810',
    symbols: ['🦁', '🐘', '🦒', '🦓', '🐆', '💎', '🌴', '🌅', '🎰', '⭐'],
    reelBackground: 'from-amber-900/30 to-orange-900/30',
    atmosphere: 'adventure',
    buttonStyle: 'rounded',
    fontStyle: 'bold',
    glowEffect: true,
    particleEffect: false,
    animationSpeed: 'normal'
  },

  // MEGA FORTUNE DREAMS - Luxury/Yacht Theme
  'mega-fortune': {
    primaryColor: '#FFD700', // Gold
    secondaryColor: '#4169E1', // Royal Blue
    accentColor: '#FF1493', // Deep Pink
    backgroundColor: '#0A1929',
    gradientFrom: '#1E3A8A',
    gradientTo: '#0A1929',
    symbols: ['💎', '🛥️', '🍾', '💍', '👑', '💰', '⭐', '🎰', '💵', '🏆'],
    reelBackground: 'from-blue-900/40 to-purple-900/40',
    atmosphere: 'luxury',
    buttonStyle: 'pill',
    fontStyle: 'elegant',
    glowEffect: true,
    particleEffect: true,
    animationSpeed: 'normal'
  },

  // HALL OF GODS - Norse Mythology Theme
  'hall-of-gods': {
    primaryColor: '#87CEEB', // Sky Blue
    secondaryColor: '#4B0082', // Indigo
    accentColor: '#FFD700', // Gold
    backgroundColor: '#1A1A2E',
    gradientFrom: '#4B0082',
    gradientTo: '#1A1A2E',
    symbols: ['⚡', '🔨', '🛡️', '⚔️', '👑', '🐺', '🦅', '💎', '⭐', '🌩️'],
    reelBackground: 'from-indigo-900/40 to-purple-900/40',
    atmosphere: 'mystical',
    buttonStyle: 'hexagon',
    fontStyle: 'bold',
    glowEffect: true,
    particleEffect: true,
    animationSpeed: 'normal'
  },

  // STARBURST - Space/Gems Theme
  'starburst': {
    primaryColor: '#9333EA', // Purple
    secondaryColor: '#EC4899', // Pink
    accentColor: '#3B82F6', // Blue
    backgroundColor: '#0F0F23',
    gradientFrom: '#581C87',
    gradientTo: '#0F0F23',
    symbols: ['💎', '💠', '🔷', '🔶', '⭐', '✨', '🌟', '💫', '🔮', '🎆'],
    reelBackground: 'from-purple-900/40 to-pink-900/40',
    atmosphere: 'electric',
    buttonStyle: 'sharp',
    fontStyle: 'modern',
    glowEffect: true,
    particleEffect: true,
    animationSpeed: 'fast'
  },

  // GONZO'S QUEST MEGAWAYS - Aztec/Adventure Theme
  'gonzo-quest': {
    primaryColor: '#D4AF37', // Gold
    secondaryColor: '#8B4513', // Brown
    accentColor: '#228B22', // Forest Green
    backgroundColor: '#1A2F1A',
    gradientFrom: '#2F4F2F',
    gradientTo: '#1A2F1A',
    symbols: ['🗿', '🏺', '💎', '🌴', '🦜', '🐍', '⚱️', '📿', '🔱', '⭐'],
    reelBackground: 'from-green-900/40 to-amber-900/40',
    atmosphere: 'adventure',
    buttonStyle: 'rounded',
    fontStyle: 'bold',
    glowEffect: false,
    particleEffect: true,
    animationSpeed: 'normal'
  },

  // BOOK OF RA DELUXE - Egyptian Theme
  'book-of-ra': {
    primaryColor: '#FFD700', // Gold
    secondaryColor: '#8B4513', // Brown
    accentColor: '#4169E1', // Royal Blue
    backgroundColor: '#2C1810',
    gradientFrom: '#8B4513',
    gradientTo: '#2C1810',
    symbols: ['📖', '🔱', '👁️', '🏺', '🦅', '🐪', '💎', '⚱️', '🔺', '⭐'],
    reelBackground: 'from-amber-900/40 to-yellow-900/40',
    atmosphere: 'mystical',
    buttonStyle: 'sharp',
    fontStyle: 'classic',
    glowEffect: true,
    particleEffect: false,
    animationSpeed: 'normal'
  },

  // SWEET BONANZA XMAS - Christmas/Candy Theme
  'sweet-bonanza': {
    primaryColor: '#DC2626', // Red
    secondaryColor: '#16A34A', // Green
    accentColor: '#FBBF24', // Yellow
    backgroundColor: '#1E1B4B',
    gradientFrom: '#7C2D12',
    gradientTo: '#1E1B4B',
    symbols: ['🍬', '🍭', '🎄', '🎅', '⛄', '🎁', '🔔', '❄️', '⭐', '🍪'],
    reelBackground: 'from-red-900/40 to-green-900/40',
    atmosphere: 'festive',
    buttonStyle: 'pill',
    fontStyle: 'bold',
    glowEffect: true,
    particleEffect: true,
    animationSpeed: 'normal'
  },

  // GATES OF OLYMPUS - Greek Mythology Theme
  'gates-olympus': {
    primaryColor: '#FFD700', // Gold
    secondaryColor: '#4169E1', // Royal Blue
    accentColor: '#FF4500', // Orange Red
    backgroundColor: '#0A1929',
    gradientFrom: '#1E3A8A',
    gradientTo: '#0A1929',
    symbols: ['⚡', '👑', '🏛️', '🔱', '🦅', '💎', '🏺', '⚱️', '🌩️', '⭐'],
    reelBackground: 'from-blue-900/40 to-indigo-900/40',
    atmosphere: 'mystical',
    buttonStyle: 'hexagon',
    fontStyle: 'elegant',
    glowEffect: true,
    particleEffect: true,
    animationSpeed: 'fast'
  },

  // LIGHTNING ROULETTE - Electric/Modern Theme
  'lightning-roulette': {
    primaryColor: '#FBBF24', // Yellow
    secondaryColor: '#8B5CF6', // Purple
    accentColor: '#06B6D4', // Cyan
    backgroundColor: '#0F0F23',
    gradientFrom: '#581C87',
    gradientTo: '#0F0F23',
    atmosphere: 'electric',
    buttonStyle: 'pill',
    fontStyle: 'modern',
    glowEffect: true,
    particleEffect: true,
    animationSpeed: 'fast'
  },

  // VIP BLACKJACK - Luxury/VIP Theme
  'blackjack-vip': {
    primaryColor: '#FFD700', // Gold
    secondaryColor: '#1F2937', // Dark Gray
    accentColor: '#DC2626', // Red
    backgroundColor: '#0A1929',
    gradientFrom: '#1F2937',
    gradientTo: '#0A1929',
    atmosphere: 'luxury',
    buttonStyle: 'sharp',
    fontStyle: 'elegant',
    glowEffect: true,
    particleEffect: false,
    animationSpeed: 'slow'
  },

  // CRAZY TIME - Game Show/Colorful Theme
  'crazy-time': {
    primaryColor: '#EC4899', // Pink
    secondaryColor: '#8B5CF6', // Purple
    accentColor: '#FBBF24', // Yellow
    backgroundColor: '#1E1B4B',
    gradientFrom: '#7C2D12',
    gradientTo: '#1E1B4B',
    atmosphere: 'electric',
    buttonStyle: 'pill',
    fontStyle: 'bold',
    glowEffect: true,
    particleEffect: true,
    animationSpeed: 'fast'
  },

  // EUROPEAN ROULETTE - Classic/Professional Theme
  'european-roulette': {
    primaryColor: '#DC2626', // Red
    secondaryColor: '#1F2937', // Dark Gray
    accentColor: '#16A34A', // Green
    backgroundColor: '#0A1929',
    gradientFrom: '#1F2937',
    gradientTo: '#0A1929',
    atmosphere: 'classic',
    buttonStyle: 'rounded',
    fontStyle: 'classic',
    glowEffect: false,
    particleEffect: false,
    animationSpeed: 'normal'
  },

  // BACCARAT PRO - Elegant/VIP Theme
  'baccarat-pro': {
    primaryColor: '#16A34A', // Green
    secondaryColor: '#1F2937', // Dark Gray
    accentColor: '#FFD700', // Gold
    backgroundColor: '#0A1929',
    gradientFrom: '#1F2937',
    gradientTo: '#0A1929',
    atmosphere: 'luxury',
    buttonStyle: 'sharp',
    fontStyle: 'elegant',
    glowEffect: true,
    particleEffect: false,
    animationSpeed: 'slow'
  },

  // TEXAS HOLD'EM - Poker/Professional Theme
  'texas-holdem': {
    primaryColor: '#16A34A', // Green
    secondaryColor: '#1F2937', // Dark Gray
    accentColor: '#DC2626', // Red
    backgroundColor: '#0A1929',
    gradientFrom: '#1F2937',
    gradientTo: '#0A1929',
    atmosphere: 'classic',
    buttonStyle: 'rounded',
    fontStyle: 'classic',
    glowEffect: false,
    particleEffect: false,
    animationSpeed: 'normal'
  }
};

// Default theme for games without specific configuration
export const defaultDemoTheme: DemoTheme = {
  primaryColor: '#3B82F6', // Blue
  secondaryColor: '#8B5CF6', // Purple
  accentColor: '#EC4899', // Pink
  backgroundColor: '#0F172A',
  gradientFrom: '#1E293B',
  gradientTo: '#0F172A',
  symbols: ['🎰', '💎', '⭐', '🍒', '🍋', '🍊', '7️⃣', '🔔', '💰', 'BAR'],
  reelBackground: 'from-blue-900/30 to-purple-900/30',
  atmosphere: 'modern',
  buttonStyle: 'rounded',
  fontStyle: 'modern',
  glowEffect: true,
  particleEffect: false,
  animationSpeed: 'normal'
};

// Helper function to get theme for a game
export const getDemoTheme = (game: Game): DemoTheme => {
  return gameDemoThemes[game.id] || defaultDemoTheme;
};

// Helper function to get theme colors as CSS variables
export const getThemeStyles = (theme: DemoTheme) => {
  return {
    '--theme-primary': theme.primaryColor,
    '--theme-secondary': theme.secondaryColor,
    '--theme-accent': theme.accentColor,
    '--theme-bg': theme.backgroundColor,
    '--theme-gradient-from': theme.gradientFrom,
    '--theme-gradient-to': theme.gradientTo,
  } as React.CSSProperties;
};

// Helper to determine if game should use specific demo type
export const getDemoType = (game: Game): 'slot' | 'roulette' | 'blackjack' | 'live-casino' | 'poker' | 'baccarat' => {
  // Check specific game IDs first
  if (game.id.includes('roulette')) return 'roulette';
  if (game.id.includes('blackjack')) return 'blackjack';
  if (game.id.includes('baccarat')) return 'baccarat';
  if (game.id.includes('poker') || game.id.includes('holdem')) return 'poker';
  
  // Check by category
  if (game.category === 'slots' || game.category === 'jackpots') return 'slot';
  if (game.category === 'live-casino' || game.category === 'game-shows') return 'live-casino';
  if (game.category === 'poker') return 'poker';
  
  // Check by subcategory
  if (game.subcategory?.toLowerCase().includes('roulette')) return 'roulette';
  if (game.subcategory?.toLowerCase().includes('blackjack')) return 'blackjack';
  if (game.subcategory?.toLowerCase().includes('baccarat')) return 'baccarat';
  if (game.subcategory?.toLowerCase().includes('poker')) return 'poker';
  
  // Check by title
  const title = game.title.toLowerCase();
  if (title.includes('roulette')) return 'roulette';
  if (title.includes('blackjack')) return 'blackjack';
  if (title.includes('baccarat')) return 'baccarat';
  if (title.includes('poker') || title.includes('holdem')) return 'poker';
  
  // Default to slot for table games, live-casino for live games
  if (game.category === 'table-games') return 'roulette';
  
  return 'slot';
};
