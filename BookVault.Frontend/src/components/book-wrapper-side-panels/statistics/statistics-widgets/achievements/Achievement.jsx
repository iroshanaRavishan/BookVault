import React from 'react';
import styles from './achievement.module.css';
import { FaChevronUp } from "react-icons/fa";
import { PiRobotLight } from 'react-icons/pi';

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
              <div key={badge.id} className={styles.badge}>
                <span className={styles.badgeIcon}>{badge.icon}</span>
                <span className={styles.badgeName}>{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.aiSummaryContent}>
          <span className={styles.aiGeneratedContentText}>You Just earned the 3 day badge!</span>
        </div>
        <div className={styles.milestoneSection}>
            <div className={styles.milestoneToggler}></div>
            <div className={styles.streakStatus}></div>
            <div className={styles.readingHistorySection}>
              <section className={styles.readingHistoryTitle}>
                <span>Reading History</span>
              </section>
              <section className={styles.readingHistoryList}>
                <span>Reading history list goes here</span>
              </section>
              <section>
                <FaChevronUp />
              </section>
            </div>
        </div>
      </div>
    </div>
  )
}
