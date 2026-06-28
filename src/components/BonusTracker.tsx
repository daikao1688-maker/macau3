import { withBase } from '../utils/paths';
import { useState, useEffect } from 'react';
import { userStore } from '../stores/userStore';
import type { User, Bonus } from '../stores/userStore';

interface BonusTrackerProps {
  className?: string;
  compact?: boolean;
}

export default function BonusTracker({ className = '', compact = false }: BonusTrackerProps) {
  const [user, setUser] = useState<User | null>(null);
  const [selectedBonus, setSelectedBonus] = useState<Bonus | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorAmount, setCalculatorAmount] = useState('');

  useEffect(() => {
    const unsubscribe = userStore.subscribe(setUser);
    setUser(userStore.getUser());
    return unsubscribe;
  }, []);

  if (!user) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">No Active Bonuses</h3>
        <p className="text-gray-400 text-sm">Check out our promotions to claim bonuses</p>
      </div>
    );
  }

  const activeBonuses = user.bonuses.filter(bonus => bonus.status === 'active');
  const completedBonuses = user.bonuses.filter(bonus => bonus.status === 'completed');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBonusIcon = (type: Bonus['type']) => {
    switch (type) {
      case 'welcome': return '🎉';
      case 'reload': return '🔄';
      case 'cashback': return '💰';
      case 'free_spins': return '🎰';
      case 'tournament': return '🏆';
      case 'vip': return '👑';
      default: return '🎁';
    }
  };

  const getBonusColor = (type: Bonus['type']) => {
    switch (type) {
      case 'welcome': return 'from-primary-500 to-primary-600';
      case 'reload': return 'from-secondary-500 to-secondary-600';
      case 'cashback': return 'from-accent-green to-green-600';
      case 'free_spins': return 'from-purple-500 to-purple-600';
      case 'tournament': return 'from-yellow-500 to-yellow-600';
      case 'vip': return 'from-pink-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const calculateWageringRemaining = (bonus: Bonus) => {
    const totalRequired = bonus.amount * bonus.wageringRequirement;
    const completed = totalRequired * (bonus.wageringProgress / 100);
    return totalRequired - completed;
  };

  const calculateBonusValue = (depositAmount: number) => {
    if (!depositAmount) return 0;
    
    const vipLevel = userStore.getVipLevel();
    const baseBonus = depositAmount * 0.5; // 50% base bonus
    const vipBoost = (baseBonus * vipLevel.bonusBoost) / 100;
    
    return baseBonus + vipBoost;
  };

  const getTimeRemaining = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  if (compact) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Active Bonuses</h3>
          <span className="text-primary-500 font-bold text-sm">
            {activeBonuses.length} Active
          </span>
        </div>

        {activeBonuses.length === 0 ? (
          <div className="text-center py-6 bg-white/5 rounded-lg border border-white/10">
            <div className="text-3xl mb-2">🎁</div>
            <p className="text-gray-400 text-sm">No active bonuses</p>
            <button className="btn-primary mt-3 text-sm">
              Browse Promotions
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeBonuses.slice(0, 2).map(bonus => (
              <div key={bonus.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getBonusIcon(bonus.type)}</span>
                    <span className="text-white font-semibold text-sm">{bonus.title}</span>
                  </div>
                  <span className="text-primary-500 font-bold text-sm">
                    {formatCurrency(bonus.amount)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Wagering Progress</span>
                    <span className="text-white">{bonus.wageringProgress.toFixed(1)}%</span>
                  </div>
                  
                  <div className="relative h-2 bg-dark-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${getBonusColor(bonus.type)} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${bonus.wageringProgress}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Expires: {getTimeRemaining(bonus.expiryDate)}</span>
                    <span>{bonus.wageringRequirement}x wagering</span>
                  </div>
                </div>
              </div>
            ))}

            {activeBonuses.length > 2 && (
              <button className="w-full text-primary-500 hover:text-primary-400 text-sm font-semibold transition-colors">
                View All Bonuses ({activeBonuses.length - 2} more)
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">Bonus Tracker</h2>
          <p className="text-gray-400">Monitor your active bonuses and wagering progress</p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="btn-outline flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>Bonus Calculator</span>
          </button>
          
          <a href={withBase('/promotions')} className="btn-primary">
            Browse Bonuses
          </a>
        </div>
      </div>

      {/* Bonus Calculator */}
      {showCalculator && (
        <div className="card-glass p-6">
          <h3 className="text-xl font-bold text-white mb-4">Bonus Calculator</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Deposit Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={calculatorAmount}
                  onChange={(e) => setCalculatorAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 bg-dark-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">Base Bonus (50%)</span>
                  <span className="text-white font-bold">
                    {formatCurrency(parseFloat(calculatorAmount || '0') * 0.5)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">VIP Boost (+{userStore.getVipLevel().bonusBoost}%)</span>
                  <span className="text-primary-500 font-bold">
                    +{formatCurrency(calculateBonusValue(parseFloat(calculatorAmount || '0')) - (parseFloat(calculatorAmount || '0') * 0.5))}
                  </span>
                </div>
                
                <div className="border-t border-white/10 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Total Bonus</span>
                    <span className="text-accent-green font-bold text-lg">
                      {formatCurrency(calculateBonusValue(parseFloat(calculatorAmount || '0')))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Bonuses */}
      <div className="card-glass p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Active Bonuses</h3>
          <span className="px-3 py-1 bg-primary-500/20 text-primary-500 text-sm font-bold rounded-full">
            {activeBonuses.length} Active
          </span>
        </div>

        {activeBonuses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎁</div>
            <h4 className="text-xl font-bold text-white mb-2">No Active Bonuses</h4>
            <p className="text-gray-400 mb-6">Claim a bonus to start earning rewards</p>
            <a href={withBase('/promotions')} className="btn-primary">
              Browse Available Bonuses
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {activeBonuses.map(bonus => (
              <div 
                key={bonus.id} 
                className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => setSelectedBonus(selectedBonus?.id === bonus.id ? null : bonus)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getBonusColor(bonus.type)} rounded-full flex items-center justify-center text-xl`}>
                      {getBonusIcon(bonus.type)}
                    </div>
                    
                    <div>
                      <h4 className="text-white font-bold text-lg mb-1">{bonus.title}</h4>
                      <p className="text-gray-400 text-sm mb-2">{bonus.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-primary-500 font-bold">
                          {formatCurrency(bonus.amount)}
                        </span>
                        <span className="text-gray-400">
                          {bonus.wageringRequirement}x wagering
                        </span>
                        <span className="text-yellow-400">
                          Expires: {getTimeRemaining(bonus.expiryDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-white font-bold text-lg mb-1">
                      {bonus.wageringProgress.toFixed(1)}%
                    </div>
                    <div className="text-gray-400 text-sm">Complete</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="relative h-3 bg-dark-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${getBonusColor(bonus.type)} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${bonus.wageringProgress}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>
                      {formatCurrency((bonus.amount * bonus.wageringRequirement * bonus.wageringProgress) / 100)} wagered
                    </span>
                    <span>
                      {formatCurrency(calculateWageringRemaining(bonus))} remaining
                    </span>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedBonus?.id === bonus.id && (
                  <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="text-gray-400 text-xs mb-1">Bonus Amount</div>
                        <div className="text-white font-bold">{formatCurrency(bonus.amount)}</div>
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="text-gray-400 text-xs mb-1">Wagering Required</div>
                        <div className="text-white font-bold">{formatCurrency(bonus.amount * bonus.wageringRequirement)}</div>
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="text-gray-400 text-xs mb-1">Remaining</div>
                        <div className="text-accent-red font-bold">{formatCurrency(calculateWageringRemaining(bonus))}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        Expires on {formatDate(bonus.expiryDate)}
                      </div>
                      
                      <div className="flex space-x-2">
                        {bonus.termsUrl && (
                          <a 
                            href={bonus.termsUrl}
                            className="text-primary-500 hover:text-primary-400 text-sm font-semibold transition-colors"
                          >
                            View Terms
                          </a>
                        )}
                        
                        <button className="btn-outline text-sm">
                          Play Now
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Bonuses */}
      {completedBonuses.length > 0 && (
        <div className="card-glass p-6">
          <h3 className="text-xl font-bold text-white mb-6">Recently Completed</h3>
          
          <div className="space-y-3">
            {completedBonuses.slice(0, 3).map(bonus => (
              <div key={bonus.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  <span className="text-lg opacity-50">{getBonusIcon(bonus.type)}</span>
                  <div>
                    <p className="text-white font-medium">{bonus.title}</p>
                    <p className="text-gray-400 text-sm">Completed • {formatCurrency(bonus.amount)}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-accent-green font-bold">✓ Complete</div>
                  <div className="text-gray-400 text-xs">100% wagered</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bonus Tips */}
      <div className="card-glass p-6">
        <h3 className="text-xl font-bold text-white mb-6">Bonus Tips</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Check Wagering Requirements</h4>
                <p className="text-gray-400 text-sm">Different games contribute differently to wagering requirements</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-secondary-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-secondary-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Watch Expiry Dates</h4>
                <p className="text-gray-400 text-sm">Complete wagering requirements before bonuses expire</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-accent-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">VIP Benefits</h4>
                <p className="text-gray-400 text-sm">Higher VIP levels get better bonus terms and faster clearing</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Read Terms & Conditions</h4>
                <p className="text-gray-400 text-sm">Always review bonus terms before claiming</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}