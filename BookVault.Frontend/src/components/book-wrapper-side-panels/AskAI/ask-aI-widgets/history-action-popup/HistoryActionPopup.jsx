import React from 'react';
import styles from './historyactionpopup.module.css';
import { BsFillPinAngleFill, BsPinFill } from "react-icons/bs";
import { TiExport } from "react-icons/ti";
import { MdDelete, MdModeEdit } from 'react-icons/md';

export default function HistoryActionPopup() {
  return (
    <div
      className={styles.historyActionPopupPanel}
      onClick={(e) => e.stopPropagation()}
    >
        <div className={styles.historyActionPopupBody}>
            <div className={styles.actionItem}>
                <span>Advance Settigns</span>
            </div>

        <div className={styles.actionItem}>
          <TiExport className={styles.actionIcon} />
          <span>Export</span>
        </div>

            <div className={styles.actionItem}>
                <span>Advance Settigns</span>
            </div>
            <div className={styles.deletionActionItem}>
                <div className={styles.actionItem}>
                    <span>Advance Settigns</span>
                </div>
            </div>
        </div>
    </div>
  )
}
