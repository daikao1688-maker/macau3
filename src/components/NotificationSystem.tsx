import { useState, useEffect } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationSystemProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
}

export default function NotificationSystem({ 
  notifications, 
  onRemove, 
  position = 'top-right' 
}: NotificationSystemProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setVisibleNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.duration !== 0) {
        const timer = setTimeout(() => {
          onRemove(notification.id);
        }, notification.duration || 5000);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, onRemove]);

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  const getTypeStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-accent-green/90',
          border: 'border-accent-green/50',
          icon: '✅'
        };
      case 'error':
        return {
          bg: 'bg-accent-red/90',
          border: 'border-accent-red/50',
          icon: '❌'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500/90',
          border: 'border-yellow-500/50',
          icon: '⚠️'
        };
      case 'info':
        return {
          bg: 'bg-accent-blue/90',
          border: 'border-accent-blue/50',
          icon: 'ℹ️'
        };
      default:
        return {
          bg: 'bg-gray-600/90',
          border: 'border-gray-500/50',
          icon: '📢'
        };
    }
  };

  if (visibleNotifications.length === 0) return null;

  return (
    <div className={`fixed z-50 space-y-3 ${getPositionClasses()}`}>
      {visibleNotifications.map((notification, index) => {
        const styles = getTypeStyles(notification.type);
        
        return (
          <div
            key={notification.id}
            className={`
              max-w-sm w-full ${styles.bg} backdrop-blur-lg border ${styles.border} 
              rounded-xl shadow-2xl p-4 transform transition-all duration-300 ease-out
              animate-slideInRight
            `}
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div className="flex-shrink-0 text-lg">
                {styles.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-sm mb-1">
                  {notification.title}
                </h4>
                <p className="text-white/90 text-sm leading-relaxed">
                  {notification.message}
                </p>

                {/* Action Button */}
                {notification.action && (
                  <button
                    onClick={notification.action.onClick}
                    className="mt-3 text-white/80 hover:text-white text-sm font-semibold underline transition-colors"
                  >
                    {notification.action.label}
                  </button>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => onRemove(notification.id)}
                className="flex-shrink-0 text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            {notification.duration && notification.duration > 0 && (
              <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white/60 rounded-full animate-shrink"
                  style={{
                    animationDuration: `${notification.duration}ms`
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000
    };

    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Convenience methods
  const success = (title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'success', title, message, ...options });
  };

  const error = (title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'error', title, message, ...options });
  };

  const warning = (title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'warning', title, message, ...options });
  };

  const info = (title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'info', title, message, ...options });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  };
}