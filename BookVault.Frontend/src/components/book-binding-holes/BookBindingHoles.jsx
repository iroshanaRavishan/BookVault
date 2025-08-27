import React from 'react';
import styles from './bookbindingholes.module.css';
import { useFullscreenContext } from '../../context/FullscreenContext';

export default function BookBindingHoles({ side }) {
  const { isFullScreen } = useFullscreenContext();
  
  const holes = new Array(24).fill(0);
  const sideClass = side === 'left' || side === 'right' ? styles[side] : '';

  return (
    <div className={`${styles.holeContainer} ${sideClass}`}>
      {holes.map((_, i) => (
        <div key={i} className={styles.hole} style={side=='right'? {background: 'linear-gradient(to left, #d4d4d4, #8f8f8f)'}: {background: 'linear-gradient(to right, #d4d4d4, #8f8f8f)'}} ></div>
      ))}
    </div>
  );
}
