import React, { useState, useEffect, useRef } from 'react';
import styles from './messageWall.module.css';

export default function MessageWall({ messages, isTyping }) {
  const bottomRef = useRef(null); 
  const wallRef = useRef(null);

  const [hoveredId, setHoveredId] = useState(null);
  const [editingMsg, setEditingMsg] = useState(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  useEffect(() => {
    // user did NOT scroll and system action
    // setUserScrolledUp(false);
    // setShowScrollDown(false);

    wallRef.current?.scrollTo({
      top: wallRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isTyping]);

  return (
    <div className={styles.wallContainer}>
      <div   
        ref={wallRef}
        className={styles.wall}
        onScroll={handleScroll}
      >
        {messages.map((msg) => {
          const showDateSeparator = msg.date !== lastRenderedDate;
          lastRenderedDate = msg.date;
          return (
            <React.Fragment key={msg.id}>
              {showDateSeparator && (
                <div className={styles.dateSeparator}>
                  {msg.date}
                </div>
              )}

              <div className={`${styles.message} ${styles[msg.sender]}`}>
                <div className={styles.bubble}>
                  {msg.text}
                  <span className={styles.time}>{msg.time}</span>
                  {hoveredId === msg.id && msg.sender === 'user' && (
                    
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}

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