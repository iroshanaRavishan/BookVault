import React, { useState } from 'react';
import styles from './achievement.module.css';
import { FaChevronUp } from "react-icons/fa";
import { PiRobotLight } from 'react-icons/pi';
import { ImFire } from "react-icons/im";

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

  const [active, setActive] = useState("streaks");

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
          <span className={styles.aiGeneratedIndicator}>
            <PiRobotLight />
            Generated content
          </span>
        </div>
        <div className={styles.milestoneSection}>
          <div className={styles.milestoneToggler}>
            <div
              className={`${styles.slider} ${
                active === "awards" ? styles.right : styles.left
              }`}
            ></div>
            <button
              className={`${styles.toggleBtn} ${
                active === "streaks" ? styles.active : ""
              }`}
              onClick={() => setActive("streaks")}
            >
              Streaks
            </button>
            <button
              className={`${styles.toggleBtn} ${
                active === "awards" ? styles.active : ""
              }`}
              onClick={() => setActive("awards")}
            >
              Awards
            </button>
          </div>
          <div className={styles.tabContainer}>
            <div
              className={`${styles.streakTabContent} ${
                active === "streaks" ? styles.activeTab : styles.hiddenTab
              }`}
            >
              <div className={styles.streakStatus}>
                <div className={styles.fireIcon}>
                  <ImFire color='#fff' size={25}/>
                </div>
                <div className={styles.streakTextSection}>
                  <span className={styles.streakText}>Your current reading streak is... </span>
                  <span className={styles.streakSubText}>3 days!</span>
                </div>
              </div>
              <div className={styles.readingHistorySection}>
                <section className={styles.readingHistoryTitle}>
                  <span>Reading History</span>
                </section>
                <section className={styles.readingHistoryList}>
                  {readingHistory.map((item) => (
                    <div key={item.id} className={styles.readingHistoryItem}>
                      <div className={styles.historyItem}>
                        <div className={styles.historyItemDetails}>
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
                <section>
                  <FaChevronUp />
                </section>
              </div>
            </div>
            <div
              className={`${styles.awardsTabContent} ${
                active === "awards" ? styles.activeTab : styles.hiddenTab
              }`}
            >
              <span>Awards tab section...!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
