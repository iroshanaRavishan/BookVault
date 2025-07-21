import React, { forwardRef } from 'react';
import styles from './bookreadingboardsidebutton.module.css';
import { IoChevronUp } from 'react-icons/io5';

const BookReadingBoardSideButton = forwardRef(({ name, top, position = 'right', onClick, isActive, rightOffset }, ref) => {
  const isLeft = position === 'left';
  const isRight = position === 'right';
  const isBottom = position === 'bottom';

  const dynamicStyle = isBottom
  ? { right: rightOffset || '210px', bottom: 0 } // default to 170px if not passed
  : { top: `${top}px` };

  return (
    <div
      className={`${styles.container} ${
        isLeft ? styles.left : isRight ? styles.right : isBottom ? styles.bottom : ''
      } ${isActive ? styles.active : ''}`}
      style={dynamicStyle}
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
