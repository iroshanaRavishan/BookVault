import React, { forwardRef } from 'react';
import styles from './bookreadingboardsidebutton.module.css';
import { IoChevronUp } from 'react-icons/io5';

const BookReadingBoardSideButton = forwardRef(({ name, top, position = 'right', onClick, isActive }, ref) => {
  const isLeft = position === 'left';
  const isRight = position === 'right';
  const isBottom = position === 'bottom';

  return (
    <div
      className={`${styles.container} ${
        isLeft ? styles.left : isRight ? styles.right : isBottom ? styles.bottom : ''
      } ${isActive ? styles.active : ''}`}
      style={isBottom ? {} : { top: `${top}px` }}
      ref={ref}
    >
      <span
        className={`${styles.sideButton} ${
          isLeft ? styles.leftButton : isRight ? styles.rightButton : ''
        }`}
        onClick={onClick}
      >
        {name}
        <IoChevronUp size={15}/>
      </span>
    </div>
  );
});

export default BookReadingBoardSideButton;
