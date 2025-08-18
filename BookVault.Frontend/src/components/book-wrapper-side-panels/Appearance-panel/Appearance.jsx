import React from 'react'
import styles from './appearance.module.css';

export default function Appearance() {
  return (
    <div className={styles.AppearancePanel}>
        <div className={styles.appearanceActions}>
            <button>Cancel</button>
            <button>Save</button>
        </div>
    </div>
  );
}