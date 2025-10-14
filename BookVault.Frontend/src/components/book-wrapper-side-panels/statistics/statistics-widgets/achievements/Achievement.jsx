import React from 'react';
import styles from './achievement.module.css';

export default function Achievement() {
  const badges = [
    { id: 1, name: 'First Book Read', icon: '📘' },
    { id: 2, name: 'Five Books Read', icon: '📗' },
    { id: 3, name: 'Ten Books Read', icon: '📕' },
    { id: 4, name: 'Bookworm', icon: '🐛' },
    { id: 5, name: 'Night Owl', icon: '🦉' },
    { id: 6, name: 'Early Bird', icon: '🐦' },
    { id: 7, name: 'Marathon Reader', icon: '🏃‍♂️' },
    { id: 8, name: 'Genre Explorer', icon: '🌍' },
    { id: 9, name: 'Series Finisher', icon: '🔚' },
    { id: 10, name: 'Bibliophile', icon: '📚' },
  ];

  return (
    <div className={styles.achievementsContainer}>
      <div className={styles.headerSection}>
        <span>Achievement</span>
      </div>
      <div className={styles.contentSection}>
        <div className={styles.scrollableBadges}>
          <div className={styles.badgeItem}>
            {badges.map((badge) => (
              <div>
                <span>{badge.icon}</span>
                <span>{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
