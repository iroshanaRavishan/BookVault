import React from 'react';
import styles from './loadinganimation.module.css';

export function LoadingAnimation() {
  const pages = [7, 6, 4, 5, 7];

  return (
    <div className={styles.popupOverlay}>
        <div className={styles.bookLoaderContainer}>
            <div className={styles.bookLoader}>
                {pages.map((lineCount, index) => (
                <div
                    key={index}
                    className={styles.bookPage}
                    style={{
                    zIndex: pages.length - index,
                    animationDelay: `${index * 0.3}s`,
                    }}
                >
                    <div className={styles.notes}>
                    {Array.from({ length: lineCount }).map((_, i) => (
                        <div key={i} className={styles.noteLine} />
                    ))}
                    </div>
                </div>
                ))}
            </div>
            <div className={styles.loadingText}>
                <span className={styles.loadingWrapper}>Loading<span className={styles.dots}></span></span>
            </div>
        </div>
    </div>
  );
};

