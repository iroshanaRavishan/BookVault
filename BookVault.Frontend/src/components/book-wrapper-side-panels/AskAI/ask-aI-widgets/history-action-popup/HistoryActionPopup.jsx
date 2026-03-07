import React from 'react';
import styles from './historyactionpopup.module.css';

export default function HistoryActionPopup() {
  return (
    <div className={styles.historyActionPopupPanel}>
        <div className={styles.historyActionPopupBody}>
            <div className={styles.actionItem}>
                <span>Advance Settigns</span>
            </div>
            <div className={styles.actionItem}>
                <span>Advance Settigns</span>
            </div>
            <div className={styles.actionItem}>
                <span>Advance Settigns</span>
            </div>
            <div className={styles.deletionActionItem}>
            
            </div>
        </div>
    </div>
  )
}
