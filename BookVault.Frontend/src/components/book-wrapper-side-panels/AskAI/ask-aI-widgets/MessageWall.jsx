import React from 'react';
import styles from './messageWall.module.css';

export default function MessageWall({ messages, isTyping }) {
  return (
    <div className={styles.wall}>
      {messages.map((msg, index) => (
        <div key={index} className={`${styles.message} ${styles[msg.sender]}`}>
          <div className={styles.bubble}>
            {msg.text}
            <span className={styles.time}>{msg.time}</span>
          </div>
        </div>
      ))}

      {isTyping && (
        <div className={`${styles.message} ${styles.bot}`}>
          <div className={styles.typing}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
    </div>
  );
}