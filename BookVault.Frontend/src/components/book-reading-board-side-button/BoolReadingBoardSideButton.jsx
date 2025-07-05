import React, { forwardRef } from 'react';
import styles from './BoolReadingBoardSideButton.module.css';
import { IoChevronUp } from 'react-icons/io5';

const BoolReadingBoardSideButton = forwardRef(({ name, top }, ref) => {
  return (
    <div className={styles.container} style={{ top: `${top}px` }} ref={ref}>
      <span className={styles.sideButton}>
        {name}
        <IoChevronUp className={styles.arrowIcon} />
      </span>
    </div>
  );
});

export default BoolReadingBoardSideButton;