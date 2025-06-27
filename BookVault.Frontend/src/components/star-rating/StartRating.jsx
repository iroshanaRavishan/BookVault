import React from 'react';
import styles from './starrating.module.css';

export default function StarRating({ rating, maxStars = 5 }){
  // Convert rating to an array of star types
  const getStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push('half');
    }
    
    // Add empty stars
    while (stars.length < maxStars) {
      stars.push('empty');
    }
    
    return stars;
  };

  return (
    <div className={styles.starRating} aria-label={`Rating: ${rating} out of ${maxStars} stars`}>
      {getStars().map((type, index) => (
        <span key={index} className={styles.starWrapper}>
          {type === 'full' && (
            <svg className={styles.star} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )}
          {type === 'half' && (
            <svg className={styles.star} viewBox="0 0 24 24">
              <defs>
                <linearGradient id="halfStarGradient">
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="#e0e0e0" />
                </linearGradient>
              </defs>
              <path fill="url(#halfStarGradient)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )}
          {type === 'empty' && (
            <svg className={`${styles.star} ${styles.emptyStar}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )}
        </span>
      ))}
      <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
    </div>
  );
};
