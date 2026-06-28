interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  className = '',
  text = 'Loading...'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} border-4 border-white/10 rounded-full animate-spin`}>
          <div className="absolute inset-0 border-4 border-transparent border-t-primary-500 rounded-full animate-spin"></div>
        </div>
        
        {/* Inner ring */}
        <div className={`absolute inset-2 border-2 border-white/5 rounded-full animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}>
          <div className="absolute inset-0 border-2 border-transparent border-t-secondary-500 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
        </div>
      </div>
      
      {text && (
        <p className="text-gray-400 text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}