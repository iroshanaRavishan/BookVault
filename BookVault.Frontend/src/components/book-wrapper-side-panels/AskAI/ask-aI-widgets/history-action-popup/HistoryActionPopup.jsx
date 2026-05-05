import React from 'react';
import styles from './historyactionpopup.module.css';
import { BsFillPinAngleFill, BsPinFill } from "react-icons/bs";
import { TiExport } from "react-icons/ti";
import { MdDelete, MdModeEdit } from 'react-icons/md';

export default function HistoryActionPopup({ isPinned }) {
  return (
    <div
      className={styles.historyActionPopupPanel}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.historyActionPopupBody}>
        
         <div className={styles.actionItem}>
          <BsPinFill className={styles.actionIcon} />
          <span style={{marginBottom:'2px'}}> Pin</span>
        </div>

        <div className={styles.actionItem}>
          <TiExport className={styles.actionIcon} />
          <span>Export</span>
        </div>

        <div className={styles.actionItem}>
          <MdModeEdit className={styles.actionIcon} />
          <span style={{marginBottom:'2px'}}>Rename</span>
        </div>

        <div className={styles.deletionActionItem}>
          <div className={styles.actionItem}>
            <MdDelete className={styles.actionIcon} />
            <span style={{marginBottom:'2px'}}>Delete</span>
          </div>
        </div>
      </div>
    </div>
  )
}
