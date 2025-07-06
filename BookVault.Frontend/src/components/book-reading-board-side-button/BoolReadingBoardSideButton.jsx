import React, { forwardRef } from 'react';
import styles from './BoolReadingBoardSideButton.module.css';
import { IoChevronUp } from 'react-icons/io5';

const BoolReadingBoardSideButton = forwardRef(({ name, top, position = 'right' }, ref) => {
  const isLeft = position === 'left';

  return (
    <div
      className={`${styles.container} ${isLeft ? styles.left : styles.right}`}
      style={{ top: `${top}px` }}
      ref={ref}
    >
      <span
        className={`${styles.sideButton} ${isLeft ? styles.leftButton : styles.rightButton}`}
      >
        {name}
        <IoChevronUp className={styles.arrowIcon} />
      </span>
    </div>
  );
});

export default BoolReadingBoardSideButton;
