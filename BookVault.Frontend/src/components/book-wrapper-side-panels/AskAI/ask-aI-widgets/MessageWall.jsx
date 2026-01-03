import React from 'react';
import styles from './messageWall.module.css';

export default function MessageWall({ messages, isTyping }) {
  return (
    <div className={styles.wall}>
      Message Wall
    </div>
  );
}