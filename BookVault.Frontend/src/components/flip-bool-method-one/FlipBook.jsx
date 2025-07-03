import React, { forwardRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import styles from './flipbook.module.css';
import BookBindingHoles from '../book-binding-holes/BookBindingHoles';

const Page = forwardRef(({ children, number, totalPages, currentPage }, ref) => {
  let radiusClass = "";

  if (number === 0) radiusClass = styles.rightRounded;
  else if (number === totalPages - 1) radiusClass = styles.leftRounded;
  else radiusClass = number % 2 === 0 ? styles.rightRounded : styles.leftRounded;

  const showLeftHoles = (
    (number % 2 === 1 && number !== totalPages - 1 && number !== 0) ||
    (number === totalPages - 2 && currentPage === totalPages - 2)
  );
  const showRightHoles = number % 2 === 0 && number !== 0;
  const showLeftCoverHoles = number === 0;
  const showLastCoverHoles = number === totalPages - 1;

  return (
    <div className={`${styles.page} ${radiusClass}`} ref={ref}>
      {/* Front side */}
      {showLeftCoverHoles && <BookBindingHoles side="left" />}
      {showLeftHoles && <BookBindingHoles side="right" />}
      {showRightHoles && <BookBindingHoles side="left" />}
      {showLastCoverHoles && <BookBindingHoles side="right" />}

      {/* the content */}
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
  const [currentPage, setCurrentPage] = useState(0);
  const contentPages = 5;
  const totalPages = 2 + contentPages + (contentPages % 2 === 1 ? 1 : 0) + 2;

  const pages = [];

  pages.push({ type: 'cover', content: <section>Cover Page</section> });
  pages.push({ type: 'blank', content: null });

  for (let i = 1; i <= contentPages; i++) {
    pages.push({
      type: 'content',
      content: (
        <div >
          <section>Content Page {i}</section>
          <span className={styles.pageNumberContainer}>
            <p className={styles.pageNumber}>- {i} -</p>
          </span>
        </div>
      )
    });
  }

  if (contentPages % 2 === 1) {
    pages.push({ type: 'blank', content: null });
  }

  pages.push({ type: 'blank', content: null });
  pages.push({ type: 'backCover', content: <section>Back Cover</section> });

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
        {pages.map((page, i) => (
          <Page key={i} number={i} totalPages={totalPages} currentPage={currentPage}>
            <div className={styles.pageContent}>{page.content}</div>
          </Page>
        ))}
      </HTMLFlipBook>
    </div>
  );
}
