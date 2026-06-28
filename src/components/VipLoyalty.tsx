import { useState, useEffect } from 'react';
import { userStore, vipLevels } from '../stores/userStore';
import type { User } from '../stores/userStore';

interface VipLoyaltyProps {
  className?: string;
}

export default function VipLoyalty({ className = '' }: VipLoyaltyProps) {
  const [user, setUser] = useState<User | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<keyof typeof vipLevels>('bronze');
  const [showRewards, setShowRewards] = useState(false);

  useEffect(() => {
    const unsubscribe = userStore.subscribe(setUser);
    setUser(userStore.getUser());
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      setSelectedLevel(user.vipLevel);
    }
  }, [user]);

  if (!user) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">VIP Program</h3>
        <p className="text-gray-400">Join our exclusive VIP program for premium benefits</p>
      </div>
    );
  }

  const currentLevel = userStore.getVipLevel();
  const nextLevel = userStore.getNextVipLevel();
  const vipProgress = userStore.getVipProgress();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getLevelIcon = (level: keyof typeof vipLevels) => {
    switch (level) {
      case 'bronze': return '🥉';
      case 'silver': return '🥈';
      case 'gold': return '🥇';
      case 'platinum': return '💎';
      case 'diamond': return '👑';
      default: return '⭐';
    }
  };

  const getPointsForLevel = (level: keyof typeof vipLevels) => {
    return vipLevels[level].minPoints;
  };

  const calculateCashbackEarnings = () => {
    const monthlyWager = user.totalDeposits * 0.3; // Estimate monthly wager
    return (monthlyWager * currentLevel.cashback) / 100;
  };

  const vipRewards = [
    {
      id: 'weekly_cashback',
      title: 'Weekly Cashback',
      description: `${currentLevel.cashback}% cashback on all losses`,
      value: formatCurrency(calculateCashbackEarnings()),
      icon: '💰',
      frequency: 'Weekly'
    },
    {
      id: 'birthday_bonus',
      title: 'Birthday Bonus',
      description: 'Special bonus on your birthday',
      value: formatCurrency(user.totalDeposits * 0.1),
      icon: '🎂',
      frequency: 'Annual'
    },
    {
      id: 'reload_bonus',
      title: 'Reload Bonus',
      description: `${currentLevel.bonusBoost}% bonus boost on deposits`,
      value: `+${currentLevel.bonusBoost}%`,
      icon: '🔄',
      frequency: 'Every deposit'
    },
    {
      id: 'withdrawal_speed',
      title: 'Fast Withdrawals',
      description: 'Priority withdrawal processing',
      value: currentLevel.withdrawalTime,
      icon: '⚡',
      frequency: 'Always'
    }
  ];

  return (
    <div className={`space-y-8 ${className}`}>
      {/* VIP Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full border border-primary-500/30">
          <span className="text-2xl">{getLevelIcon(user.vipLevel)}</span>
          <span className="text-primary-500 font-bold text-sm uppercase tracking-widest">
            VIP {currentLevel.name} Member
          </span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
          Exclusive VIP Program
        </h2>
        
        <p className="text-gray-300 max-w-2xl mx-auto">
          Unlock premium benefits, exclusive rewards, and personalized service as you climb through our VIP tiers
        </p>
      </div>

      {/* Current Status */}
      <div className="card-glass p-8">
        <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
          {/* VIP Badge */}
          <div className="relative">
            <div className={`w-32 h-32 bg-gradient-to-br ${currentLevel.color} rounded-full flex items-center justify-center shadow-2xl`}>
              <span className="text-4xl">{getLevelIcon(user.vipLevel)}</span>
            </div>
            
            {/* Level Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
            
            {/* Progress Ring */}
            {nextLevel && (
              <svg className="absolute inset-0 w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="2"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#vip-gradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={`${vipProgress * 2.83} 283`}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="vip-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>
              </svg>
            )}
          </div>

          {/* Status Info */}
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-2xl font-display font-bold text-white mb-2">
              {currentLevel.name} VIP Status
            </h3>
            
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
              <span className="text-primary-500 font-bold">{user.loyaltyPoints.toLocaleString()}</span>
              <span className="text-gray-400">loyalty points</span>
            </div>

            {nextLevel ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress to {nextLevel.name}</span>
                  <span className="text-white font-semibold">{vipProgress.toFixed(1)}%</span>
                </div>
                
                <div className="relative h-3 bg-dark-900 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${currentLevel.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${vipProgress}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Current: {user.loyaltyPoints.toLocaleString()}</span>
                  <span>Next: {nextLevel.minPoints.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">👑</div>
                <p className="text-white font-semibold">Maximum VIP Level!</p>
                <p className="text-gray-400 text-sm">You've reached the highest tier</p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-accent-green font-bold text-xl">{currentLevel.cashback}%</div>
              <div className="text-gray-400 text-xs">Cashback Rate</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-primary-500 font-bold text-xl">+{currentLevel.bonusBoost}%</div>
              <div className="text-gray-400 text-xs">Bonus Boost</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-white font-bold text-sm">{currentLevel.withdrawalTime}</div>
              <div className="text-gray-400 text-xs">Withdrawal</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-secondary-500 font-bold text-xl">{user.achievements.length}</div>
              <div className="text-gray-400 text-xs">Achievements</div>
            </div>
          </div>
        </div>
      </div>

      {/* VIP Levels Overview */}
      <div className="card-glass p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-bold text-white">VIP Levels</h3>
          <button
            onClick={() => setShowRewards(!showRewards)}
            className="btn-outline text-sm"
          >
            {showRewards ? 'Hide' : 'Show'} Rewards
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(vipLevels).map(([levelKey, level]) => {
            const isCurrentLevel = levelKey === user.vipLevel;
            const isUnlocked = user.loyaltyPoints >= level.minPoints;
            
            return (
              <button
                key={levelKey}
                onClick={() => setSelectedLevel(levelKey as keyof typeof vipLevels)}
                className={`relative p-4 rounded-xl border transition-all duration-300 ${
                  selectedLevel === levelKey
                    ? `border-primary-500 bg-gradient-to-br ${level.color}/10`
                    : isUnlocked
                    ? 'border-white/20 bg-white/5 hover:bg-white/10'
                    : 'border-white/10 bg-white/5 opacity-50'
                }`}
              >
                {/* Current Level Indicator */}
                {isCurrentLevel && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent-green rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}

                <div className="text-center space-y-2">
                  <div className="text-3xl">{getLevelIcon(levelKey as keyof typeof vipLevels)}</div>
                  <h4 className="text-white font-bold text-sm">{level.name}</h4>
                  <p className="text-gray-400 text-xs">{level.minPoints.toLocaleString()}+ pts</p>
                  
                  <div className="space-y-1 text-xs">
                    <div className="text-accent-green">{level.cashback}% Cashback</div>
                    <div className="text-primary-500">+{level.bonusBoost}% Bonus</div>
                    <div className="text-gray-400">{level.withdrawalTime}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Level Details */}
        {selectedLevel && (
          <div className="mt-6 p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">{getLevelIcon(selectedLevel)}</span>
              <h4 className="text-xl font-bold text-white">{vipLevels[selectedLevel].name} Benefits</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-white font-semibold mb-3">Exclusive Benefits</h5>
                <div className="space-y-2">
                  {vipLevels[selectedLevel].benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <svg className="w-4 h-4 text-accent-green flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="text-gray-400 text-xs mb-1">Cashback Rate</div>
                  <div className="text-accent-green font-bold text-lg">{vipLevels[selectedLevel].cashback}%</div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="text-gray-400 text-xs mb-1">Bonus Boost</div>
                  <div className="text-primary-500 font-bold text-lg">+{vipLevels[selectedLevel].bonusBoost}%</div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="text-gray-400 text-xs mb-1">Withdrawal Time</div>
                  <div className="text-white font-bold text-sm">{vipLevels[selectedLevel].withdrawalTime}</div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="text-gray-400 text-xs mb-1">Points Required</div>
                  <div className="text-white font-bold text-sm">{vipLevels[selectedLevel].minPoints.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* VIP Rewards */}
      {showRewards && (
        <div className="card-glass p-6">
          <h3 className="text-xl font-display font-bold text-white mb-6">Your VIP Rewards</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vipRewards.map(reward => (
              <div key={reward.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-xl">
                    {reward.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">{reward.title}</h4>
                      <span className="text-primary-500 font-bold">{reward.value}</span>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-2">{reward.description}</p>
                    
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-primary-500/20 text-primary-500 text-xs font-bold rounded-full">
                        {reward.frequency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button className="btn-primary">
              Claim Available Rewards
            </button>
          </div>
        </div>
      )}

      {/* How to Earn Points */}
      <div className="card-glass p-6">
        <h3 className="text-xl font-display font-bold text-white mb-6">How to Earn VIP Points</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto text-2xl">
              🎰
            </div>
            <h4 className="text-white font-semibold">Play Games</h4>
            <p className="text-gray-400 text-sm">Earn 1 point for every $10 wagered on slots and table games</p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center mx-auto text-2xl">
              💳
            </div>
            <h4 className="text-white font-semibold">Make Deposits</h4>
            <p className="text-gray-400 text-sm">Get bonus points with every deposit, higher VIP levels earn more</p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-green to-green-600 rounded-full flex items-center justify-center mx-auto text-2xl">
              🏆
            </div>
            <h4 className="text-white font-semibold">Complete Challenges</h4>
            <p className="text-gray-400 text-sm">Participate in tournaments and complete achievements for extra points</p>
          </div>
        </div>
      </div>
    </div>
  );
}