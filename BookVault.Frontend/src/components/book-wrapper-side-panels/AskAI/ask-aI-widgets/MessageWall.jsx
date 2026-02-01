import React, { useState, useEffect, useRef } from 'react';
import styles from './messageWall.module.css';
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import { RiFileCopyFill } from "react-icons/ri";
import ChatInput from './ChatInput';
import { IoChevronDown } from 'react-icons/io5';

export default function MessageWall({ messages, isTyping, onEdit, onDelete }) {
  const bottomRef = useRef(null); 
  const wallRef = useRef(null);

  const [hoveredId, setHoveredId] = useState(null);
  const [editingMsg, setEditingMsg] = useState(null);
  const [editedText, setEditedText] = useState('');
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

  const handleScroll = () => {
    const el = wallRef.current;
    if (!el) return;

    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;

    const isAtBottom = distanceFromBottom < 100;

    // only user scroll sets this
    setUserScrolledUp(!isAtBottom);
    setShowScrollDown(!isAtBottom);
  };

  const startEdit = (msg) => {
    setEditingMsg(msg);
    setEditedText(msg.text);
  };

  let lastRenderedDate = null;

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

              <div
                className={`${styles.message} ${styles[msg.sender]}`}
                onMouseEnter={() => setHoveredId(msg.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {msg.sender === 'bot' && (
                   <span className={styles.botIcon}><img src='/src/assets/logo mark.png' className={styles.profilePicture} /> </span>
                )}
                <div className={styles.bubble}>
                  {msg.text}
                  <span className={styles.time}>{msg.time}</span>
                  {hoveredId === msg.id && msg.sender === 'user' && (
                    <div className={styles.actions}>
                      <MdModeEditOutline onClick={() => startEdit(msg)} size={15}/>
                      <RiFileCopyFill onClick={() => copyText(msg.text)} size={15}/>
                      <MdDelete
                        onClick={() => onDelete(msg.id)}
                        size={16}
                        className={styles.deleteIcon}
                      />
                    </div>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}

        {isTyping && (
          <div className={`${styles.message} ${styles.bot}`}>
            <span className={styles.botIcon}>
              <img src='/src/assets/logo mark.png' className={styles.profilePicture} />
            </span>
            <div className={styles.typing}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      {/* EDIT POPUP */}
      {editingMsg && (
        <ChatInput />
      )}
    </div>
  );
}
