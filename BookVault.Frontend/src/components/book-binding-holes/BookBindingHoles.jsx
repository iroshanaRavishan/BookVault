import React from 'react';
import styles from './bookbindingholes.module.css';

export default function BookBindingHoles({ side }) {
  const holes = new Array(17).fill(0);
  const sideClass = side === 'left' || side === 'right' ? styles[side] : '';

  return (
    <div className={`${styles.holeContainer} ${sideClass}`}>
      {holes.map((_, i) => (
        <div key={i} className={styles.hole}></div>
      ))}
    </div>
  );
}
