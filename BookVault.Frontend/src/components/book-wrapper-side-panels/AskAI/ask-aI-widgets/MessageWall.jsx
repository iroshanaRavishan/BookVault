import React, { useState, useEffect, useRef } from 'react';
import styles from './messageWall.module.css';
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import { RiFileCopyFill } from "react-icons/ri";
import ChatInput from './ChatInput';
import { IoChevronDown } from 'react-icons/io5';
import { HiReply } from 'react-icons/hi';
import { PiBookFill } from "react-icons/pi";
import { LuNotebook } from "react-icons/lu";
import { BsJournalBookmarkFill } from 'react-icons/bs';
import { GoBookmarkFill } from 'react-icons/go';
import { IoMdAttach } from "react-icons/io";
import { FiPaperclip } from 'react-icons/fi';

export default function MessageWall({ messages, isTyping, onEdit, onReply }) {
  const bottomRef = useRef(null); 
  const wallRef = useRef(null);
  const messageRefs = useRef({});

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

  const scrollToMessage = (id) => {
    const el = messageRefs.current[id];
    if (!el) return;

    el.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });

    // force reflow so animation can restart
    el.classList.remove(styles.highlight);
    void el.offsetWidth; // trick to restart animation

    el.classList.add(styles.highlight);

    setTimeout(() => {
      el.classList.remove(styles.highlight);
    }, 2500);
  };

  const startEdit = (msg) => {
    setEditingMsg(msg);
    setEditedText(msg.text);
  };

  const cancelEdit = () => {
    setEditingMsg(null);
    setEditedText('');
  };

  const sendEdit = () => {
    onEdit(editingMsg.id, editedText);
    cancelEdit();
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
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
          const originalMsg = msg.editedFrom
            ? messages.find(m => m.id === msg.editedFrom)
            : null;
          const repliedMsg = msg.repliedTo;

          const previewText = originalMsg && originalMsg.text.length > 50
            ? originalMsg.text.slice(0, 50) + "..."
            : originalMsg?.text;

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
                ref={(el) => (messageRefs.current[msg.id] = el)}
                className={`${styles.message} ${styles[msg.sender]}`}
                onMouseEnter={() => setHoveredId(msg.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {msg.sender === 'bot' && (
                   <span className={styles.botIcon}><img src='/src/assets/logo mark.png' className={styles.profilePicture} /> </span>
                )}
                <div className={styles.bubble}>
                  {originalMsg && (
                    <div
                      className={styles.originalPreview}
                      onClick={() => scrollToMessage(originalMsg.id)}
                    >
                      <span className={styles.editIconInEditedMessageSection}><MdModeEditOutline /></span>
                        <span className={styles.originalText}>
                          {'Edited'}:{" "}
                          {previewText}
                      </span>
                    </div>
                  )}
                  {msg.text}
                  <span className={styles.time}>{msg.time}</span>
                  {hoveredId === msg.id && msg.sender === 'user' && (
                    <div className={styles.actions}>
                      <MdModeEditOutline onClick={() => startEdit(msg)} size={15}/>
                      <RiFileCopyFill onClick={() => copyText(msg.text)} size={15}/>
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

      {showScrollDown && (
        <button
          className={styles.scrollDownButton}
          onClick={() => {
            wallRef.current.scrollTo({
              top: wallRef.current.scrollHeight,
              behavior: 'smooth',
            });
          }}
        >
          <IoChevronDown size={16} />
        </button>
      )}

      {/* EDIT POPUP */}
      {editingMsg && (
        <div className={styles.overlay}>
          <div className={styles.popup}>
            <ChatInput
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              onSend={sendEdit}
              onCancel={cancelEdit}
              showCancel
              autoFocus
              placeholder="Edit message..."
              isEditing
              showPageSelector={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}
