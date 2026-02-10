import React from 'react';
import styles from './chatinput.module.css';

export default function ChatInput() {
  return (
    <div 
      className={styles.actionWrapper}
      style={{paddingRight: isEditing ? '0px' : '4px'}}
    >
      <div 
        className={styles.textareaWrapper} 
        style={{ height: isEditing ? '200px' : '' }}
      >

      </div>
    </div>
  );
}
