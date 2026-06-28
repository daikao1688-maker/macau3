import { useState, useEffect } from 'react';

interface JackpotCounterProps {
  initialAmount: number;
  className?: string;
  currency?: string;
  increment?: number;
  intervalMs?: number;
}

export default function JackpotCounter({ 
  initialAmount, 
  className = '', 
  currency = '$',
  increment = 1,
  intervalMs = 3000 
}: JackpotCounterProps) {
  const [amount, setAmount] = useState(initialAmount);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Random increment between 1-50 for realism
      const randomIncrement = Math.floor(Math.random() * 50) + increment;
      
      setIsAnimating(true);
      setAmount(prev => prev + randomIncrement);
      
      // Reset animation after a short delay
      setTimeout(() => setIsAnimating(false), 500);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [increment, intervalMs]);

  const formatAmount = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      <span className="mr-1">{currency}</span>
      <span 
        className={`font-bold transition-all duration-500 ${
          isAnimating 
            ? 'scale-110 text-yellow-400 drop-shadow-lg' 
            : 'scale-100'
        }`}
      >
        {formatAmount(amount)}
      </span>
      {isAnimating && (
        <span className="ml-1 text-yellow-400 animate-pulse">
          ↗️
        </span>
      )}
    </div>
  );
}