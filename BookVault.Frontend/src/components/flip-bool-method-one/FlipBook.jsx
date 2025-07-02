import React, { forwardRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import styles from './flipbook.module.css';
import BookBindingHoles from '../book-binding-holes/BookBindingHoles';

const Page = forwardRef(({ children, number, totalPages, currentPage }, ref) => {
  let radiusClass = "";

  if (number === 0) {
    radiusClass = styles.rightRounded;
  } else if (number === totalPages - 1) {
    radiusClass = styles.leftRounded;
  } else if (number % 2 === 0) {
    // Left page (visible when open)
    radiusClass = styles.rightRounded;
  } else {
    // Right page (visible when open)
    radiusClass = styles.leftRounded;
  }

  // Determine where to show holes
  const showLeftHoles = (
    (number % 2 === 1 && number !== totalPages - 1 && number !== 0) || // right page of opened book
    (number === totalPages - 2 && currentPage === totalPages - 2)      // back cover left page
  );
  const showRightHoles = (
    (number % 2 === 0 && number !== 0)                                  // left page of opened book
  );

  const showLeftCoverHoles = number === 0 && currentPage === 0;
  const showLastCoverHoles = number === totalPages - 1 && currentPage >= totalPages - 2;

  return (
    <div className={`${styles.page} ${radiusClass}`} ref={ref}>
      {showLeftCoverHoles && <BookBindingHoles side="left" />}
      {showLeftHoles && <BookBindingHoles side="right" />}
      {showRightHoles && <BookBindingHoles side="left" />}
      {showLastCoverHoles && <BookBindingHoles side="right" />}
      {children}
    </div>
  );
});

export default function FlipBook() {
  const pages = [
    <Page key={0} number={0} totalPages={8}><h2>FIRST COVER PAGE</h2></Page>,
    <Page key={1} number={1} totalPages={8}></Page>,
    <Page key={2} number={2} totalPages={8}><h3>1 st page </h3><h4>right</h4></Page>,
    <Page key={3} number={3} totalPages={8}><h3>2 nd page </h3><h4>left</h4></Page>,
    <Page key={3} number={4} totalPages={8}><h3>3 rd page </h3><h4>left</h4></Page>,
    <Page key={3} number={5} totalPages={8}><h3>4 th page </h3><h4>right</h4></Page>,
    <Page key={4} number={6} totalPages={8}></Page>,
    <Page key={5} number={7} totalPages={8}><h2>LAST COVER PAGE</h2></Page>,
  ];

  return (
    <div className={styles.wrapper}>
      <HTMLFlipBook
        width={230}
        height={345}
        minWidth={180}
        maxWidth={460}
        minHeight={270}
        maxHeight={690}
        size="stretch"
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        drawShadow={true}
        useMouseEvents={true}
        className={styles.flipbook}
      >
        {pages}
      </HTMLFlipBook>
    </div>
  );
}
