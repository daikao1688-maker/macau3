import { useState, useEffect } from 'react';
import { userStore, vipLevels } from '../stores/userStore';
import type { User } from '../stores/userStore';

interface UserProfileProps {
  className?: string;
}

export default function UserProfile({ className = '' }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: ''
  });

  useEffect(() => {
    const unsubscribe = userStore.subscribe(setUser);
    setUser(userStore.getUser());
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Profile Data</h3>
        <p className="text-gray-400">Please log in to view your profile</p>
      </div>
    );
  }

  const vipLevel = userStore.getVipLevel();
  const nextVipLevel = userStore.getNextVipLevel();
  const vipProgress = userStore.getVipProgress();

  const handleSaveProfile = () => {
    userStore.updateUser(editForm);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      {/* Profile Header */}
      <div className="card-glass p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 lg:space-x-8">
          {/* Avatar */}
          <div className="relative mx-auto md:mx-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-4 ring-primary-500/50 shadow-2xl">
              <img 
                src={user.avatar} 
                alt={user.username}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* VIP Badge */}
            <div className={`absolute -bottom-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br ${vipLevel.color} rounded-full flex items-center justify-center shadow-lg`}>
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left w-full">
            {!isEditing ? (
              <div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                    {user.firstName} {user.lastName}
                  </h2>
                  <span className={`px-3 py-1 bg-gradient-to-r ${vipLevel.color} text-white text-xs font-bold rounded-full`}>
                    {vipLevel.name} VIP
                  </span>
                </div>
                
                <p className="text-sm sm:text-base text-gray-300 mb-1">@{user.username}</p>
                <p className="text-xs sm:text-sm text-gray-400 mb-4">{user.email}</p>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-400 block">Member Since</span>
                    <p className="text-white font-semibold">{formatDate(user.joinDate)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Games Played</span>
                    <p className="text-white font-semibold">{user.gamesPlayed.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Loyalty Points</span>
                    <p className="text-primary-500 font-semibold">{user.loyaltyPoints.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Last Login</span>
                    <p className="text-white font-semibold">{formatDate(user.lastLogin)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">First Name</label>
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full bg-dark-900/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm sm:text-base focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Last Name</label>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full bg-dark-900/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm sm:text-base focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Username</label>
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full bg-dark-900/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm sm:text-base focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-dark-900/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm sm:text-base focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-outline flex items-center justify-center space-x-2 text-sm sm:text-base px-4 py-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full">
                <button
                  onClick={handleSaveProfile}
                  className="btn-primary flex items-center justify-center space-x-2 text-sm px-4 py-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save</span>
                </button>
                
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn-outline text-sm px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* VIP Progress */}
      <div className="card-glass p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
          <h3 className="text-lg sm:text-xl font-display font-bold text-white">VIP Status</h3>
          <span className={`px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r ${vipLevel.color} text-white text-xs sm:text-sm font-bold rounded-lg`}>
            {vipLevel.name} Level
          </span>
        </div>

        {nextVipLevel ? (
          <div className="space-y-4">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-400">Progress to {nextVipLevel.name}</span>
              <span className="text-white font-semibold">{vipProgress.toFixed(1)}%</span>
            </div>
            
            <div className="relative h-3 bg-dark-900 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${vipLevel.color} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${vipProgress}%` }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-gray-400">
              <span>{user.loyaltyPoints.toLocaleString()} points</span>
              <span>{nextVipLevel.minPoints.toLocaleString()} points needed</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-3xl sm:text-4xl mb-2">👑</div>
            <p className="text-white font-semibold text-sm sm:text-base">Maximum VIP Level Reached!</p>
            <p className="text-gray-400 text-xs sm:text-sm">You're at the highest tier with exclusive benefits</p>
          </div>
        )}

        {/* VIP Benefits */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs sm:text-sm">Current Benefits</h4>
            {vipLevel.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2 text-xs sm:text-sm">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-accent-green flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/10">
              <div className="text-gray-400 mb-1 text-xs">Cashback Rate</div>
              <div className="text-accent-green font-bold text-base sm:text-lg">{vipLevel.cashback}%</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/10">
              <div className="text-gray-400 mb-1 text-xs">Bonus Boost</div>
              <div className="text-primary-500 font-bold text-base sm:text-lg">+{vipLevel.bonusBoost}%</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/10">
              <div className="text-gray-400 mb-1 text-xs">Withdrawal Time</div>
              <div className="text-white font-bold text-xs sm:text-sm">{vipLevel.withdrawalTime}</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/10">
              <div className="text-gray-400 mb-1 text-xs">Points Earned</div>
              <div className="text-white font-bold text-xs sm:text-sm">{user.loyaltyPoints.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="card-glass p-4 sm:p-6 text-center">
          <div className="text-2xl sm:text-3xl mb-2">💰</div>
          <h4 className="text-white font-bold text-sm sm:text-lg mb-1">Total Deposits</h4>
          <p className="text-primary-500 font-bold text-lg sm:text-xl">{formatCurrency(user.totalDeposits)}</p>
        </div>

        <div className="card-glass p-4 sm:p-6 text-center">
          <div className="text-2xl sm:text-3xl mb-2">🎮</div>
          <h4 className="text-white font-bold text-sm sm:text-lg mb-1">Games Played</h4>
          <p className="text-secondary-500 font-bold text-lg sm:text-xl">{user.gamesPlayed.toLocaleString()}</p>
        </div>

        <div className="card-glass p-4 sm:p-6 text-center">
          <div className="text-2xl sm:text-3xl mb-2">⭐</div>
          <h4 className="text-white font-bold text-sm sm:text-lg mb-1">Achievements</h4>
          <p className="text-accent-green font-bold text-lg sm:text-xl">{user.achievements.length}</p>
        </div>
      </div>
    </div>
  );
}