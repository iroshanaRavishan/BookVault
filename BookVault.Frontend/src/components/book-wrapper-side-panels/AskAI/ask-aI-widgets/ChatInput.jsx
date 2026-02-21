import React, { useRef } from 'react';
import { IoCloseCircleSharp } from 'react-icons/io5';
import styles from './chatinput.module.css';
import { MdModeEditOutline } from 'react-icons/md';

export default function ChatInput({
  value,
  placeholder = 'Ask something...',
  showCancel = false,
  isEditing = false,
}) {
  const textareaRef = useRef(null);
  const isControlled = value !== undefined;

  const handleInput = (e) => {
    const textarea = textareaRef.current;
    const maxHeight = 150;

    if (!isControlled) {
      textarea.value = e.target.value;
    }

    textarea.style.height = 'auto';

    let newHeight;

    if (textarea.scrollHeight > maxHeight) {
      textarea.style.height = `${maxHeight}px`;
      textarea.style.overflowY = 'auto';
    } else {
      textarea.style.height = `${textarea.scrollHeight}px`;
      textarea.style.overflowY = 'hidden';

    }

    // send height to AskAi
    onHeightChange?.(newHeight);

    onChange?.(e);
  };


  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // prevent new line
        handleSend();
    }
  };

  const handleScroll = () => {
    const textarea = textareaRef.current;
    setShowScrollUp(
      textarea.scrollTop > 5 &&
      textarea.scrollHeight > textarea.clientHeight
    );
  };

  const scrollToTop = () => {
    textareaRef.current.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleSend = () => {
    const text = isControlled
      ? value.trim()
      : textareaRef.current.value.trim();

    if (!text) return;

    onSend(text);

    if (isControlled) {
      onChange?.({ target: { value: "" } });
    }
  };

  return (
    <div 
      className={styles.actionWrapper}
      style={{paddingRight: isEditing ? '0px' : '4px'}}
    >
      {showCancel && (
        <div className={styles.editingHeader}> 
          <span className={styles.editingHeaderSpan}> <MdModeEditOutline size={20}/> Edit the prompt here</span>
          <IoCloseCircleSharp
            className={styles.cancelButton}
            color="#e53e3e"
            onClick={onCancel}
            size={25}
          />
        </div>
        )}
      <div 
        className={styles.textareaWrapper} 
        style={{ height: isEditing ? '200px' : '' }}
      >
        <textarea
            ref={textareaRef}
            className={`${styles.messageInputArea} ${
                isEditing ? styles.editingPopUpBorder : ''
            }`}
            rows={1}
            placeholder={placeholder}
            value={isControlled ? value : undefined}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
        />
        {isScrollable && showScrollUp && (
          <button
            className={styles.scrollUpButton}
            onClick={scrollToTop}
            type="button"
          >
            Up
          </button>
        )}
      </div>
    </div>
  );
}
