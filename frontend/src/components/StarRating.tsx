import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  showNumber = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(maxRating)].map((_, index) => {
        const isFilled = index < Math.floor(rating);
        const isHalfFilled = index < rating && index >= Math.floor(rating);
        
        return (
          <div key={index} className="relative">
            <Star
              className={`${sizeClasses[size]} ${
                isFilled ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
            {isHalfFilled && (
              <Star
                className={`${sizeClasses[size]} text-yellow-400 fill-current absolute top-0 left-0`}
                style={{ clipPath: 'inset(0 50% 0 0)' }}
              />
            )}
          </div>
        );
      })}
      {showNumber && (
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      )}
    </div>
  );
};

export default StarRating;