import React from 'react'
import styles from './appearance.module.css';

export default function Appearance() {
  const [color, setColor] = useState("#f1c40f"); // default yellow

  return (
    <div className={styles.AppearancePanel}>
        <div className={styles.appearanceActions}>
            <button>Cancel</button>
            <button>Save</button>
        </div>
    </div>
  );
}