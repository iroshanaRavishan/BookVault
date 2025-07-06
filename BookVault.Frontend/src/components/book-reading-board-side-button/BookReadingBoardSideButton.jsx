import React, { forwardRef } from 'react';
import styles from './bookreadingboardsidebutton.module.css';
import { IoChevronUp } from 'react-icons/io5';

const BookReadingBoardSideButton = forwardRef(({ name, top, position = 'right' }, ref) => {
  const isLeft = position === 'left';
  const isRight = position === 'right';
  const isBottom = position === 'bottom';

  return (
    <div
      className={`${styles.container} ${
        isLeft ? styles.left : isRight ? styles.right : isBottom ? styles.bottom : ''
      }`}
      style={isBottom ? {} : { top: `${top}px` }}
      ref={ref}
    >
      <span
        className={`${styles.sideButton} ${
          isLeft ? styles.leftButton : isRight ? styles.rightButton : ''
        }`}
      >
        {name}
        <IoChevronUp className={styles.arrowIcon} />
      </span>
    </div>
  );
});

export default BookReadingBoardSideButton;
