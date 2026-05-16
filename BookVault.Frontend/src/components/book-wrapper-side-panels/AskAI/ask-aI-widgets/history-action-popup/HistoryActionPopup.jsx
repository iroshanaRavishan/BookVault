import React from 'react';
import styles from './historyactionpopup.module.css';
import { BsFillPinAngleFill, BsPinFill } from "react-icons/bs";
import { TiExport } from "react-icons/ti";
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { RiShareForwardFill } from 'react-icons/ri';

export default function HistoryActionPopup({ isPinned, onTogglePin, onDelete, onExport }) {
  return (
    <div
      className={styles.historyActionPopupPanel}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.historyActionPopupBody}>
        
         <div className={styles.actionItem} onClick={onTogglePin}>
            {isPinned ? <BsPinFill className={styles.actionIcon} /> : < BsFillPinAngleFill className={styles.actionIcon}/>}
          <span style={{marginBottom:'2px'}}> {isPinned ? "Unpin" : "Pin"}</span>
        </div>

        <div className={styles.actionItem} onClick={onExport}>
          <RiShareForwardFill className={styles.actionIcon} />
          <span>Export</span>
        </div>

        <div className={styles.actionItem}>
          <MdModeEdit className={styles.actionIcon} />
          <span style={{marginBottom:'2px'}}>Rename</span>
        </div>

        <div
          className={styles.deletionActionItem}
          onClick={onDelete}
        >
          <div className={`${styles.actionItem} ${styles.deleteActionItem}`}>
            <MdDelete className={styles.actionIcon} />
            <span style={{marginBottom:'2px'}}>Delete</span>
          </div>
        </div>
      </div>
    </div>
  )
}
