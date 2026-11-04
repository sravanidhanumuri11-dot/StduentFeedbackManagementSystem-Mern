import React, { useState } from 'react';
import { Star } from 'lucide-react';

const ratingLabels = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent'
};

export const StarRating = ({
  rating = 0,
  onChange,
  readonly = false,
  size = 22,
  showLabel = false
}) => {
  const [hover, setHover] = useState(0);

  const currentVal = hover || rating;

  return (
    <div className="star-rating-container">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= currentVal;

        if (readonly) {
          return (
            <span
              key={star}
              style={{
                color: isFilled ? '#fbbf24' : '#4b5563',
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              <Star
                size={size}
                fill={isFilled ? '#fbbf24' : 'none'}
                strokeWidth={isFilled ? 0 : 1.5}
              />
            </span>
          );
        }

        return (
          <button
            type="button"
            key={star}
            className={`star-btn ${isFilled ? 'active' : ''}`}
            onClick={() => onChange && onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            aria-label={`Rate ${star} star`}
          >
            <Star
              size={size}
              fill={isFilled ? '#fbbf24' : 'none'}
              color={isFilled ? '#fbbf24' : '#4b5563'}
              strokeWidth={isFilled ? 0 : 1.5}
            />
          </button>
        );
      })}

      {showLabel && currentVal > 0 && (
        <span className="star-label">
          {ratingLabels[currentVal] || `${currentVal} Stars`}
        </span>
      )}
    </div>
  );
};
