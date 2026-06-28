import { useState, useEffect } from 'react';
import { userStore } from '../stores/userStore';
import type { User, Transaction } from '../stores/userStore';

interface UserWalletProps {
  className?: string;
}

export default function UserWallet({ className = '' }: UserWalletProps) {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'deposit' | 'withdraw'>('overview');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('credit_card');

  useEffect(() => {
    const unsubscribe = userStore.subscribe(setUser);
    setUser(userStore.getUser());
    return unsubscribe;
  }, []);

  if (!user) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Wallet Data</h3>
        <p className="text-gray-400">Please log in to view your wallet</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: user.wallet.currency
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

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit': return '💳';
      case 'withdrawal': return '🏦';
      case 'win': return '🎉';
      case 'bet': return '🎰';
      case 'bonus': return '🎁';
      case 'refund': return '↩️';
      default: return '💰';
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
      case 'win':
      case 'bonus':
      case 'refund':
        return 'text-accent-green';
      case 'withdrawal':
      case 'bet':
        return 'text-accent-red';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return 'text-accent-green bg-accent-green/10 border-accent-green/30';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'failed': return 'text-accent-red bg-accent-red/10 border-accent-red/30';
      case 'cancelled': return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (amount > 0) {
      userStore.simulateDeposit(amount);
      setDepositAmount('');
      setActiveTab('overview');
    }
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && amount <= user.wallet.balance) {
      userStore.addTransaction({
        type: 'withdrawal',
        amount,
        currency: user.wallet.currency,
        status: 'pending',
        description: 'Withdrawal Request',
        timestamp: new Date().toISOString(),
        method: selectedMethod
      });
      setWithdrawAmount('');
      setActiveTab('overview');
    }
  };

  const paymentMethods = [
    { id: 'credit_card', name: 'Credit Card', icon: '💳', fee: '0%' },
    { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦', fee: '0%' },
    { id: 'crypto', name: 'Cryptocurrency', icon: '₿', fee: '0%' },
    { id: 'e_wallet', name: 'E-Wallet', icon: '📱', fee: '0%' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-glass p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary-500/10 rounded-full blur-xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Main Balance</span>
              <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
              </svg>
            </div>
            <div className="text-2xl font-display font-bold text-white mb-1">
              {formatCurrency(user.wallet.balance)}
            </div>
            <div className="text-xs text-gray-500">Available for play</div>
          </div>
        </div>

        <div className="card-glass p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-secondary-500/10 rounded-full blur-xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Bonus Balance</span>
              <svg className="w-5 h-5 text-secondary-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <div className="text-2xl font-display font-bold text-white mb-1">
              {formatCurrency(user.wallet.bonusBalance)}
            </div>
            <div className="text-xs text-gray-500">Bonus funds</div>
          </div>
        </div>

        <div className="card-glass p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full blur-xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Pending</span>
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
            </div>
            <div className="text-2xl font-display font-bold text-white mb-1">
              {formatCurrency(user.wallet.pendingWithdrawals)}
            </div>
            <div className="text-xs text-gray-500">Withdrawals</div>
          </div>
        </div>
      </div>

      {/* Wallet Actions */}
      <div className="card-glass">
        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'transactions', label: 'Transactions', icon: '📋' },
            { id: 'deposit', label: 'Deposit', icon: '💳' },
            { id: 'withdraw', label: 'Withdraw', icon: '🏦' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-semibold text-sm transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-primary-500 border-b-2 border-primary-500 bg-primary-500/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab('deposit')}
                  className="btn-primary flex items-center justify-center space-x-2 py-4"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Deposit Funds</span>
                </button>

                <button
                  onClick={() => setActiveTab('withdraw')}
                  className="btn-outline flex items-center justify-center space-x-2 py-4"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                  </svg>
                  <span>Withdraw Funds</span>
                </button>
              </div>

              {/* Wallet Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-semibold">Lifetime Statistics</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                      <span className="text-gray-400">Total Deposits</span>
                      <span className="text-accent-green font-bold">{formatCurrency(user.wallet.lifetimeDeposits)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                      <span className="text-gray-400">Total Withdrawals</span>
                      <span className="text-accent-red font-bold">{formatCurrency(user.wallet.lifetimeWithdrawals)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                      <span className="text-gray-400">Net Position</span>
                      <span className={`font-bold ${
                        (user.wallet.lifetimeDeposits - user.wallet.lifetimeWithdrawals) >= 0 
                          ? 'text-accent-green' 
                          : 'text-accent-red'
                      }`}>
                        {formatCurrency(user.wallet.lifetimeDeposits - user.wallet.lifetimeWithdrawals)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-semibold">Recent Activity</h4>
                  
                  <div className="space-y-2">
                    {user.wallet.transactions.slice(0, 3).map(transaction => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{getTransactionIcon(transaction.type)}</span>
                          <div>
                            <p className="text-white text-sm font-medium">{transaction.description}</p>
                            <p className="text-gray-400 text-xs">{formatDate(transaction.timestamp)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${getTransactionColor(transaction.type)}`}>
                            {transaction.type === 'withdrawal' || transaction.type === 'bet' ? '-' : '+'}
                            {formatCurrency(transaction.amount)}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className="w-full text-primary-500 hover:text-primary-400 text-sm font-semibold transition-colors"
                  >
                    View All Transactions →
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-semibold">Transaction History</h4>
                <div className="flex space-x-2">
                  <select className="bg-dark-900/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                    <option>All Types</option>
                    <option>Deposits</option>
                    <option>Withdrawals</option>
                    <option>Wins</option>
                    <option>Bets</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                {user.wallet.transactions.map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-dark-900 rounded-full flex items-center justify-center text-lg">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      
                      <div>
                        <p className="text-white font-medium">{transaction.description}</p>
                        <div className="flex items-center space-x-3 text-sm text-gray-400">
                          <span>{formatDate(transaction.timestamp)}</span>
                          {transaction.method && (
                            <>
                              <span>•</span>
                              <span>{transaction.method}</span>
                            </>
                          )}
                          {transaction.reference && (
                            <>
                              <span>•</span>
                              <span>{transaction.reference}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`font-bold text-lg ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'withdrawal' || transaction.type === 'bet' ? '-' : '+'}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'deposit' && (
            <div className="max-w-md mx-auto space-y-6">
              <div className="text-center">
                <h4 className="text-xl font-bold text-white mb-2">Deposit Funds</h4>
                <p className="text-gray-400">Add money to your casino account</p>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 bg-dark-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-3">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`p-4 rounded-lg border transition-all duration-300 ${
                        selectedMethod === method.id
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-2xl mb-2">{method.icon}</div>
                      <div className="text-white text-sm font-medium">{method.name}</div>
                      <div className="text-gray-400 text-xs">Fee: {method.fee}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleDeposit}
                disabled={!depositAmount || parseFloat(depositAmount) <= 0}
                className="w-full btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Deposit {depositAmount ? formatCurrency(parseFloat(depositAmount)) : 'Funds'}
              </button>

              <div className="text-xs text-gray-500 text-center">
                Deposits are processed instantly. Minimum deposit: $10
              </div>
            </div>
          )}

          {activeTab === 'withdraw' && (
            <div className="max-w-md mx-auto space-y-6">
              <div className="text-center">
                <h4 className="text-xl font-bold text-white mb-2">Withdraw Funds</h4>
                <p className="text-gray-400">Transfer money from your account</p>
              </div>

              <div className="bg-accent-green/10 border border-accent-green/30 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-accent-green text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Available Balance: {formatCurrency(user.wallet.balance)}</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    max={user.wallet.balance}
                    className="w-full pl-8 pr-4 py-3 bg-dark-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-3">Withdrawal Method</label>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`p-4 rounded-lg border transition-all duration-300 ${
                        selectedMethod === method.id
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-2xl mb-2">{method.icon}</div>
                      <div className="text-white text-sm font-medium">{method.name}</div>
                      <div className="text-gray-400 text-xs">Fee: {method.fee}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleWithdraw}
                disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > user.wallet.balance}
                className="w-full btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Withdraw {withdrawAmount ? formatCurrency(parseFloat(withdrawAmount)) : 'Funds'}
              </button>

              <div className="text-xs text-gray-500 text-center">
                Withdrawals are processed within {userStore.getVipLevel().withdrawalTime}. Minimum withdrawal: $20
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}