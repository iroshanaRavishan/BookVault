import React from 'react';
import styles from './messageWall.module.css';

export default function MessageWall({ messages, isTyping }) {
  return (
    <div className={styles.wall}>
      {messages.map((msg, index) => (
        <div key={index} className={`${styles.message} ${styles[msg.sender]}`}>
        </div>
      ))}
    </div>
  );
}