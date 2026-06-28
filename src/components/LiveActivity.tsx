import { useState, useEffect } from 'react';

interface Activity {
  id: string;
  type: 'win' | 'jackpot' | 'bonus' | 'tournament';
  player: string;
  game: string;
  amount?: number;
  timestamp: Date;
}

interface LiveActivityProps {
  className?: string;
  maxActivities?: number;
  intervalMs?: number;
}

const samplePlayers = [
  'Alex M.', 'Sarah K.', 'Mike R.', 'Emma L.', 'David P.', 'Lisa W.',
  'John D.', 'Maria S.', 'Chris B.', 'Anna T.', 'Tom H.', 'Kate F.',
  'Ryan G.', 'Sophie C.', 'Mark J.', 'Nina V.', 'Paul E.', 'Zoe M.'
];

const sampleGames = [
  'Starburst', 'Mega Moolah', 'Lightning Roulette', 'Crazy Time',
  'Book of Ra', 'Gonzo\'s Quest', 'Sweet Bonanza', 'Gates of Olympus',
  'VIP Blackjack', 'European Roulette', 'Mega Fortune', 'Hall of Gods'
];

const activityTemplates = [
  { type: 'win' as const, template: '{player} just won {amount} on {game}!' },
  { type: 'jackpot' as const, template: '🎰 JACKPOT! {player} hit {amount} on {game}!' },
  { type: 'bonus' as const, template: '🎁 {player} triggered bonus round on {game}!' },
  { type: 'tournament' as const, template: '🏆 {player} joined the tournament!' }
];

export default function LiveActivity({ 
  className = '', 
  maxActivities = 5,
  intervalMs = 8000 
}: LiveActivityProps) {
  const [activities, setActivities] = useState<Activity[]>([]);

  const generateActivity = (): Activity => {
    const template = activityTemplates[Math.floor(Math.random() * activityTemplates.length)];
    const player = samplePlayers[Math.floor(Math.random() * samplePlayers.length)];
    const game = sampleGames[Math.floor(Math.random() * sampleGames.length)];
    
    let amount: number | undefined;
    if (template.type === 'win') {
      amount = Math.floor(Math.random() * 5000) + 100; // $100-$5000
    } else if (template.type === 'jackpot') {
      amount = Math.floor(Math.random() * 50000) + 10000; // $10k-$60k
    }

    return {
      id: `activity-${Date.now()}-${Math.random()}`,
      type: template.type,
      player,
      game,
      amount,
      timestamp: new Date()
    };
  };

  useEffect(() => {
    // Add initial activity
    setActivities([generateActivity()]);

    const interval = setInterval(() => {
      const newActivity = generateActivity();
      
      setActivities(prev => {
        const updated = [newActivity, ...prev];
        return updated.slice(0, maxActivities);
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [maxActivities, intervalMs]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatMessage = (activity: Activity) => {
    const template = activityTemplates.find(t => t.type === activity.type);
    if (!template) return '';

    let message = template.template
      .replace('{player}', activity.player)
      .replace('{game}', activity.game);
    
    if (activity.amount) {
      message = message.replace('{amount}', formatAmount(activity.amount));
    }

    return message;
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'win': return '💰';
      case 'jackpot': return '🎰';
      case 'bonus': return '🎁';
      case 'tournament': return '🏆';
      default: return '🎮';
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'win': return 'text-accent-green';
      case 'jackpot': return 'text-primary-500';
      case 'bonus': return 'text-secondary-500';
      case 'tournament': return 'text-accent-blue';
      default: return 'text-gray-300';
    }
  };

  if (activities.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {activities.map((activity, index) => (
        <div
          key={activity.id}
          className={`
            relative overflow-hidden rounded-xl bg-gradient-to-r from-white/5 to-white/10 
            border border-white/10 backdrop-blur-sm
            hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/10
            transform transition-all duration-500 ease-out
            ${index === 0 ? 'animate-slideInDown' : ''}
          `}
          style={{
            animationDelay: `${index * 100}ms`,
            opacity: 1 - (index * 0.12)
          }}
        >
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative p-4">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg border border-white/10">
                <span className="text-2xl">{getActivityIcon(activity.type)}</span>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Message */}
                <p className={`text-sm md:text-base font-medium leading-relaxed ${getActivityColor(activity.type)} mb-1.5`}>
                  {formatMessage(activity)}
                </p>
                
                {/* Timestamp */}
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                  <p className="text-xs text-gray-500 font-medium">
                    {activity.timestamp.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* Status Indicator for Jackpot */}
              {activity.type === 'jackpot' && (
                <div className="flex-shrink-0 flex items-center gap-2">
                  <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">Live</span>
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}