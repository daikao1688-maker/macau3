// User State Management
// Frontend-only user state for template demonstration

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  joinDate: string;
  lastLogin: string;
  isVip: boolean;
  vipLevel: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  loyaltyPoints: number;
  totalDeposits: number;
  totalWithdrawals: number;
  gamesPlayed: number;
  favoriteGames: string[];
  preferences: UserPreferences;
  wallet: Wallet;
  bonuses: Bonus[];
  achievements: Achievement[];
}

export interface UserPreferences {
  language: string;
  currency: string;
  timezone: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    promotions: boolean;
    gameUpdates: boolean;
  };
  privacy: {
    showOnline: boolean;
    showStats: boolean;
    allowMessages: boolean;
  };
  gaming: {
    autoPlay: boolean;
    soundEffects: boolean;
    animations: boolean;
    quickSpin: boolean;
  };
}

export interface Wallet {
  balance: number;
  currency: string;
  bonusBalance: number;
  pendingWithdrawals: number;
  lifetimeDeposits: number;
  lifetimeWithdrawals: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'win' | 'bonus' | 'refund';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  timestamp: string;
  method?: string;
  reference?: string;
}

export interface Bonus {
  id: string;
  type: 'welcome' | 'reload' | 'cashback' | 'free_spins' | 'tournament' | 'vip';
  title: string;
  description: string;
  amount: number;
  currency: string;
  wageringRequirement: number;
  wageringProgress: number;
  expiryDate: string;
  status: 'active' | 'completed' | 'expired' | 'cancelled';
  termsUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'gaming' | 'loyalty' | 'social' | 'milestone';
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  reward?: {
    type: 'points' | 'bonus' | 'free_spins';
    amount: number;
  };
}

// Demo user data for template
export const demoUser: User = {
  id: 'user-demo-123',
  username: 'CasinoKing2024',
  email: 'demo@casinopro.com',
  firstName: 'Alex',
  lastName: 'Johnson',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&q=80',
  joinDate: '2024-01-15T10:30:00Z',
  lastLogin: '2024-03-15T14:22:00Z',
  isVip: true,
  vipLevel: 'gold',
  loyaltyPoints: 15750,
  totalDeposits: 25000,
  totalWithdrawals: 18500,
  gamesPlayed: 1247,
  favoriteGames: ['mega-moolah', 'starburst', 'lightning-roulette', 'crazy-time'],
  preferences: {
    language: 'en',
    currency: 'USD',
    timezone: 'America/New_York',
    notifications: {
      email: true,
      sms: false,
      push: true,
      promotions: true,
      gameUpdates: false
    },
    privacy: {
      showOnline: true,
      showStats: false,
      allowMessages: true
    },
    gaming: {
      autoPlay: false,
      soundEffects: true,
      animations: true,
      quickSpin: false
    }
  },
  wallet: {
    balance: 2847.50,
    currency: 'USD',
    bonusBalance: 125.00,
    pendingWithdrawals: 500.00,
    lifetimeDeposits: 25000,
    lifetimeWithdrawals: 18500,
    transactions: [
      {
        id: 'txn-001',
        type: 'deposit',
        amount: 500.00,
        currency: 'USD',
        status: 'completed',
        description: 'Credit Card Deposit',
        timestamp: '2024-03-15T10:30:00Z',
        method: 'Visa ****1234',
        reference: 'DEP-20240315-001'
      },
      {
        id: 'txn-002',
        type: 'win',
        amount: 1250.00,
        currency: 'USD',
        status: 'completed',
        description: 'Mega Moolah Jackpot Win',
        timestamp: '2024-03-14T18:45:00Z',
        reference: 'WIN-20240314-002'
      },
      {
        id: 'txn-003',
        type: 'withdrawal',
        amount: 500.00,
        currency: 'USD',
        status: 'pending',
        description: 'Bank Transfer Withdrawal',
        timestamp: '2024-03-13T16:20:00Z',
        method: 'Bank Transfer',
        reference: 'WTH-20240313-003'
      }
    ]
  },
  bonuses: [
    {
      id: 'bonus-001',
      type: 'welcome',
      title: 'Welcome Bonus',
      description: '100% match up to $1,000 + 200 Free Spins',
      amount: 1000.00,
      currency: 'USD',
      wageringRequirement: 35,
      wageringProgress: 28.5,
      expiryDate: '2024-04-15T23:59:59Z',
      status: 'active'
    },
    {
      id: 'bonus-002',
      type: 'cashback',
      title: 'Weekly Cashback',
      description: '10% cashback on all losses',
      amount: 125.00,
      currency: 'USD',
      wageringRequirement: 1,
      wageringProgress: 0,
      expiryDate: '2024-03-22T23:59:59Z',
      status: 'active'
    }
  ],
  achievements: [
    {
      id: 'ach-001',
      title: 'First Deposit',
      description: 'Made your first deposit',
      icon: '💰',
      category: 'milestone',
      unlockedAt: '2024-01-15T10:35:00Z',
      rarity: 'common',
      reward: {
        type: 'points',
        amount: 100
      }
    },
    {
      id: 'ach-002',
      title: 'Slot Master',
      description: 'Played 1000+ slot games',
      icon: '🎰',
      category: 'gaming',
      unlockedAt: '2024-03-10T14:20:00Z',
      rarity: 'rare',
      reward: {
        type: 'free_spins',
        amount: 50
      }
    },
    {
      id: 'ach-003',
      title: 'VIP Member',
      description: 'Reached Gold VIP status',
      icon: '👑',
      category: 'loyalty',
      unlockedAt: '2024-02-28T09:15:00Z',
      rarity: 'epic',
      reward: {
        type: 'bonus',
        amount: 500
      }
    }
  ]
};

// VIP Level Configuration
export const vipLevels = {
  bronze: {
    name: 'Bronze',
    minPoints: 0,
    maxPoints: 9999,
    cashback: 5,
    bonusBoost: 10,
    withdrawalTime: '24h',
    color: 'from-orange-700 to-orange-900',
    benefits: [
      'Weekly cashback',
      'Birthday bonus',
      'Priority support',
      'Exclusive tournaments'
    ]
  },
  silver: {
    name: 'Silver',
    minPoints: 10000,
    maxPoints: 24999,
    cashback: 10,
    bonusBoost: 15,
    withdrawalTime: '12h',
    color: 'from-gray-400 to-gray-600',
    benefits: [
      'All Bronze benefits',
      'Personal account manager',
      'Higher table limits',
      'Monthly reload bonus'
    ]
  },
  gold: {
    name: 'Gold',
    minPoints: 25000,
    maxPoints: 49999,
    cashback: 15,
    bonusBoost: 25,
    withdrawalTime: '6h',
    color: 'from-primary-500 to-primary-700',
    benefits: [
      'All Silver benefits',
      'Luxury gifts',
      'Event invitations',
      'Custom bonuses'
    ]
  },
  platinum: {
    name: 'Platinum',
    minPoints: 50000,
    maxPoints: 99999,
    cashback: 20,
    bonusBoost: 35,
    withdrawalTime: '2h',
    color: 'from-secondary-500 to-secondary-700',
    benefits: [
      'All Gold benefits',
      'VIP concierge service',
      'Exclusive events',
      'Higher cashback rates'
    ]
  },
  diamond: {
    name: 'Diamond',
    minPoints: 100000,
    maxPoints: Infinity,
    cashback: 25,
    bonusBoost: 50,
    withdrawalTime: 'Instant',
    color: 'from-cyan-400 to-blue-600',
    benefits: [
      'All Platinum benefits',
      'Unlimited withdrawals',
      'Personal host',
      'Exclusive diamond tournaments'
    ]
  }
};

// User Store Class
class UserStore {
  private user: User | null = null;
  private isAuthenticated = false;
  private listeners: Array<(user: User | null) => void> = [];

  // Initialize with demo data for template
  init() {
    this.user = demoUser;
    this.isAuthenticated = true;
    this.notifyListeners();
  }

  // Subscribe to user changes
  subscribe(listener: (user: User | null) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.user));
  }

  // Getters
  getUser(): User | null {
    return this.user;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated && this.user !== null;
  }

  getVipLevel() {
    if (!this.user) return vipLevels.bronze;
    return vipLevels[this.user.vipLevel];
  }

  getNextVipLevel() {
    if (!this.user) return vipLevels.silver;
    
    const levels = Object.keys(vipLevels) as Array<keyof typeof vipLevels>;
    const currentIndex = levels.indexOf(this.user.vipLevel);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex >= levels.length) return null;
    return vipLevels[levels[nextIndex]];
  }

  getVipProgress() {
    if (!this.user) return 0;
    
    const currentLevel = this.getVipLevel();
    const nextLevel = this.getNextVipLevel();
    
    if (!nextLevel) return 100;
    
    const progress = ((this.user.loyaltyPoints - currentLevel.minPoints) / 
                     (nextLevel.minPoints - currentLevel.minPoints)) * 100;
    
    return Math.min(Math.max(progress, 0), 100);
  }

  // Actions
  updateUser(updates: Partial<User>) {
    if (this.user) {
      this.user = { ...this.user, ...updates };
      this.notifyListeners();
    }
  }

  updatePreferences(preferences: Partial<UserPreferences>) {
    if (this.user) {
      this.user.preferences = { ...this.user.preferences, ...preferences };
      this.notifyListeners();
    }
  }

  addTransaction(transaction: Omit<Transaction, 'id'>) {
    if (this.user) {
      const newTransaction: Transaction = {
        ...transaction,
        id: `txn-${Date.now()}`
      };
      
      this.user.wallet.transactions.unshift(newTransaction);
      
      // Update balance based on transaction type
      if (transaction.type === 'deposit' && transaction.status === 'completed') {
        this.user.wallet.balance += transaction.amount;
      } else if (transaction.type === 'withdrawal' && transaction.status === 'completed') {
        this.user.wallet.balance -= transaction.amount;
      } else if (transaction.type === 'win' && transaction.status === 'completed') {
        this.user.wallet.balance += transaction.amount;
      }
      
      this.notifyListeners();
    }
  }

  addToFavorites(gameId: string) {
    if (this.user && !this.user.favoriteGames.includes(gameId)) {
      this.user.favoriteGames.push(gameId);
      this.notifyListeners();
    }
  }

  removeFromFavorites(gameId: string) {
    if (this.user) {
      this.user.favoriteGames = this.user.favoriteGames.filter(id => id !== gameId);
      this.notifyListeners();
    }
  }

  // Demo actions for template
  simulateDeposit(amount: number) {
    this.addTransaction({
      type: 'deposit',
      amount,
      currency: 'USD',
      status: 'completed',
      description: 'Demo Deposit',
      timestamp: new Date().toISOString(),
      method: 'Demo Payment'
    });
  }

  simulateWin(amount: number, game: string) {
    this.addTransaction({
      type: 'win',
      amount,
      currency: 'USD',
      status: 'completed',
      description: `Win on ${game}`,
      timestamp: new Date().toISOString()
    });
  }

  logout() {
    this.user = null;
    this.isAuthenticated = false;
    this.notifyListeners();
  }
}

// Export singleton instance
export const userStore = new UserStore();

// Initialize with demo data
if (typeof window !== 'undefined') {
  userStore.init();
}