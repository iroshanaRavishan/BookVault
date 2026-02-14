import React from 'react';
import { IoCloseCircleSharp } from 'react-icons/io5';
import styles from './chatinput.module.css';
import { MdModeEditOutline } from 'react-icons/md';

export default function ChatInput({ showCancel = false}) {
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
            size={25}
          />
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
