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

  const showLeftCoverHoles = number === 0;
  const showLastCoverHoles = number === totalPages - 1;

  return (
    <div className={`${styles.page} ${radiusClass}`} ref={ref}>
      {/* Front side */}
      {showLeftCoverHoles && <BookBindingHoles side="left" />}
      {showLeftHoles && <BookBindingHoles side="right" />}
      {showRightHoles && <BookBindingHoles side="left" />}
      {showLastCoverHoles && <BookBindingHoles side="right" />}

      {/* Your content */}
      {children}

      {/* Back side holes too (same logic to show during turn) */}
      <div className={styles.backFace}>
        {showLeftCoverHoles && <BookBindingHoles side="left" />}
        {showLeftHoles && <BookBindingHoles side="right" />}
        {showRightHoles && <BookBindingHoles side="left" />}
        {showLastCoverHoles && <BookBindingHoles side="right" />}
      </div>
    </div>
  );
});

export default function FlipBook() {
  const totalPages = 8;
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [];
  for (let i = 0; i < totalPages; i++) {
    pages.push(
      <Page key={i} number={i} totalPages={totalPages} currentPage={currentPage}>
        <div className={styles.pageContent}>
          <section>Page {i + 1}</section>

          <span className={styles.pageNumberContainer}>
            <p className={styles.pageNumber}>- {i} -</p>
          </span>
        </div>
      </Page>
    );
  }

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
        onFlip={({ data }) => setCurrentPage(data)}
        className={styles.flipbook}
      >
        {pages}
      </HTMLFlipBook>
    </div>
  );
}
