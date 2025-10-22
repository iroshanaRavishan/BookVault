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

  const readingHistory = [
    {id: 1, mins: 30, date: '2024-06-20'},
    {id: 2, mins: 45, date: '2024-06-19'},
    {id: 3, mins: 20, date: '2024-06-18'},
    {id: 4, mins: 60, date: '2024-06-17'},
    {id: 5, mins: 15, date: '2024-06-16'},
    {id: 6, mins: 50, date: '2024-06-15'},
    {id: 7, mins: 30, date: '2024-06-20'},
    {id: 8, mins: 45, date: '2024-06-19'},
    {id: 9, mins: 20, date: '2024-06-18'},
    {id: 10, mins: 60, date: '2024-06-17'},
    {id: 11, mins: 15, date: '2024-06-16'},
    {id: 12, mins: 50, date: '2024-06-15'},
    {id: 13, mins: 30, date: '2024-06-20'},
    {id: 14, mins: 45, date: '2024-06-19'},
    {id: 15, mins: 20, date: '2024-06-18'},
    {id: 16, mins: 60, date: '2024-06-17'},
    {id: 17, mins: 15, date: '2024-06-16'},
    {id: 18, mins: 50, date: '2024-06-15'},
    {id: 19, mins: 30, date: '2024-06-20'},
    {id: 20, mins: 45, date: '2024-06-19'},
    {id: 21, mins: 20, date: '2024-06-18'},
    {id: 22, mins: 60, date: '2024-06-17'},
    {id: 23, mins: 15, date: '2024-06-16'},
    {id: 24, mins: 50, date: '2024-06-15'},
    {id: 25, mins: 50, date: '2024-06-15'},
    {id: 26, mins: 50, date: '2024-06-15'},
    {id: 27, mins: 50, date: '2024-06-15'},
    {id: 28, mins: 50, date: '2024-06-15'},
    {id: 29, mins: 50, date: '2024-06-15'},
    {id: 10, mins: 50, date: '2024-06-15'},
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
          <div 
            className={styles.tabContainer}   
            style={{
              height: active === "streaks" ? "680px" : "200px"
            }}
          >
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
                          <div className={styles.historyItemChart}>
                            <span>chart</span>
                          </div>
                          <div className={styles.historyItemMins}>
                            <span>{item.mins} mins</span>
                          </div>
                          <div className={styles.historyItemTroophy}>
                            <span>Troophy</span>
                          </div>
                        </div>
                        <div className={styles.historyItemDate}>
                          <span>05/03</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
                <section>
                  <div>
                    <FaChevronUp />
                  </div>
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
