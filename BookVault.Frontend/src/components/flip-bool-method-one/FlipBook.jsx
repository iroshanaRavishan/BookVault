import React, { forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import styles from './flipbook.module.css';

const Page = forwardRef(({ children }, ref) => (
  <div className={styles.page} ref={ref}>
    {children}
  </div>
));

export default function FlipBook() {
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
        <Page>
          <h2>FIRST COVER PAGE</h2>
        </Page>
        <Page>
         {/* empty page in the other side of the coverpage */}
        </Page>


        <Page>
          <h3>1 st page </h3>
          <h4>right</h4>
        </Page>
        <Page>
           <h3>2 nd page </h3>
          <h4>left</h4>
        </Page>


        <Page>
         {/* empty page in the other side of the coverpage */}
        </Page>
        <Page>
          <h2>LAST COVER PAGE</h2>
        </Page>
      </HTMLFlipBook>
    </div>
  );
}
