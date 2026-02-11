import React from 'react';
import styles from './chatinput.module.css';

export default function ChatInput({ showCancel = false}) {
  return (
    <div 
      className={styles.actionWrapper}
      style={{paddingRight: isEditing ? '0px' : '4px'}}
    >
      {showCancel && (
        <div > 
        </div>
        )}
      <div 
        className={styles.textareaWrapper} 
        style={{ height: isEditing ? '200px' : '' }}
      >

      </div>
    </div>
  );
}
