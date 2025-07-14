import React, { forwardRef, useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import styles from './flipbook.module.css';
import BookBindingHoles from '../book-binding-holes/BookBindingHoles';
import { IoAddCircleSharp, IoCloseCircleSharp } from "react-icons/io5";
import { LuChevronFirst, LuChevronLast } from 'react-icons/lu';

const Page = forwardRef(({ children, number, totalPages, currentPage, pageType, onBookmarkAdd, activeBookmarks }, ref) => {
  const [showRotatedCopy, setShowRotatedCopy] = useState(false);
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
  const coverClass = pageType === "cover" || pageType === "backCover" ? styles.coverPage : "";

  const isContentPage = pageType === "content";
  const cornerClass = number % 2 === 0 ? styles.leftCorner : styles.rightCorner;

  useEffect(() => {
    setShowRotatedCopy(activeBookmarks.some(b => b.page === number));
  }, [activeBookmarks, number]);

  return (
    <div className={`${styles.page} ${radiusClass} ${coverClass}`} ref={ref}>
      {/* Book holes */}
      {showLeftCoverHoles && <BookBindingHoles side="left" />}
      {showLeftHoles && <BookBindingHoles side="right" />}
      {showRightHoles && <BookBindingHoles side="left" />}
      {showLastCoverHoles && <BookBindingHoles side="right" />}

      {/* Bookmark (block page turn via onMouseDown) */}
      {isContentPage && (
        <>
          <div
            className={`${styles.bookmark} ${cornerClass}`}
            onPointerDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onBookmarkAdd(number);
            }}
          >
            {showRotatedCopy ? <IoCloseCircleSharp className={styles.bookmarkActionButton} /> : <IoAddCircleSharp className={styles.bookmarkActionButton} />}
          </div>
          {/* {showRotatedCopy && (
            <div
              className={`${styles.bookmark} ${cornerClass} ${styles.rotatedCopy}`}
              onPointerDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <span className={styles.bookmarkLabel}>{number - 1}</span>
            </div>
          )} */}
        </>
      )}

      {/* Content */}
      {children}

      {/* Back face during flip */}
      <div className={styles.backFace}>
        {showLeftCoverHoles && <BookBindingHoles side="left" />}
        {showLeftHoles && <BookBindingHoles side="right" />}
        {showRightHoles && <BookBindingHoles side="left" />}
        {showLastCoverHoles && <BookBindingHoles side="right" />}
      </div>
    </div>
  );
});

export default function FlipBook({ isRightPanelOpen }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [bookmarks, setBookmarks] = useState([]);
  const [animatingPages, setAnimatingPages] = useState([]);
  const [removingPages, setRemovingPages] = useState([]);

  const contentPages = 20;
  const totalPages = 2 + contentPages + (contentPages % 2 === 1 ? 1 : 0) + 2;
  const flipBookRef = useRef();
  const pages = [];

  pages.push({ type: 'cover', content: <section>Cover Page</section> });
  pages.push({ type: 'blank', content: null });

  for (let i = 1; i <= contentPages; i++) {
    pages.push({
      type: 'content',
      content: (
        <>
          <section>Content Page {i}</section>
          <span className={styles.pageNumberContainer}>
            <p className={styles.pageNumber}>- {i} -</p>
          </span>
        </>
      )
    });
  }

  if (contentPages % 2 === 1) {
    pages.push({ type: 'blank', content: null });
  }

  pages.push({ type: 'blank', content: null });
  pages.push({ type: 'backCover', content: <section>Back Cover</section> });

  const leftPage = currentPage % 2 === 0 ? currentPage : currentPage - 1;
  const rightPage = leftPage + 1;

  const isAnimating = animatingPages.includes(currentPage);
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage >= totalPages - 2;

  // book is flat only if it's not animating AND not on first/last page
  const isBookOpenedFlat = !isAnimating && !isFirstPage && !isLastPage;

  // Final transform decision
  let containerTransform = 'translateX(0%)'; // default to center

  if (!isBookOpenedFlat) {
    if (isFirstPage) {
      containerTransform = 'translateX(-28%)';
    } else if (isLastPage) {
      containerTransform = 'translateX(28%)';
    }
  }

  const handleAddBookmark = (pageNumber) => {
      const exists = bookmarks.find(b => b.page === pageNumber);
      if (exists) {
        // Trigger removal animation
        setRemovingPages(prev => [...prev, pageNumber]);
        setTimeout(() => {
          setBookmarks(prev => prev.filter(b => b.page !== pageNumber));
          setRemovingPages(prev => prev.filter(p => p !== pageNumber));
        }, 300); // Match with animation duration
      } else {
        const getCustomRandomInt = () => {
          const validNumbers = [
            ...Array.from({ length: 3 }, (_, i) => i + 1),   // 1–3
            ...Array.from({ length: 29 }, (_, i) => i + 7)   // 7–35
          ];
          const index = Math.floor(Math.random() * validNumbers.length);
          return validNumbers[index];
        };

        const hue = getCustomRandomInt() * 10; // scale to 10–350 with large gaps
        const randomColor = `hsl(${hue}, 70%, 60%, 0.8)`;

      setBookmarks(prev => [...prev, { page: pageNumber, color: randomColor }]);

    // Trigger entry animation
    setAnimatingPages(prev => [...prev, pageNumber]);
    setTimeout(() => {
      setAnimatingPages(prev => prev.filter(p => p !== pageNumber));
    }, 300);
  }
  };

  const goToPage = async (targetPage) => {
    if (!flipBookRef.current) return;

    const instance = flipBookRef.current.pageFlip();
    const current = instance.getCurrentPageIndex();
    const total = instance.getPageCount();

    if (targetPage < 0 || targetPage >= total || current === targetPage) return;

    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    const firstContentPage = 2;
    const lastContentPage = total - 3;
    const firstCover = 0;
    const lastCover = total - 1;

    // === First Cover Navigation ===
    if (targetPage === firstCover) {
      if (current === lastCover) {
        await instance.flip(lastContentPage);
        await delay(1000);
        await instance.flip(firstContentPage);
        await delay(800);
      } else if (current !== firstContentPage && current !== firstCover) {
        await instance.flip(firstContentPage);
        await delay(1000);
      }
      await delay(100);
      await instance.flip(firstCover);
    }

    // === Last Cover Navigation ===
    else if (targetPage === lastCover) {
      if (current === firstCover) {
        await instance.flip(firstContentPage);
        await delay(1000);
        await instance.flip(lastContentPage);
        await delay(800);
      } else if (current !== lastContentPage && current !== lastCover) {
        await instance.flip(lastContentPage);
        await delay(1000);
      }
      await delay(100);
      await instance.flip(lastCover);
    }
  };

  const navButtonWidth = isFirstPage || isLastPage ? '480px' : '920px';

  return (
    <div className={styles.wrapper} style={{ width: isRightPanelOpen ? 'calc(100% - 350px)' : '100%' }}>
      <div 
        className={styles.bookmarkContainers}
        style={{ transform: containerTransform }}
      >
        <div className={styles.leftBookmarkContainer}>
          {[...bookmarks]
            .filter(b => b.page < leftPage + 2 || (b.page === leftPage && currentPage !== leftPage))
            .sort((a, b) => a.page - b.page)
            .map((b) => (
              <div
                key={b.page}
                className={`
                  ${styles.bookmarkMini}
                  ${animatingPages.includes(b.page) ? styles.bookmarkMiniAnimated : ''}
                  ${removingPages.includes(b.page) ? styles.bookmarkMiniRemoving : ''}
                `}
                onClick={() => goToPage(b.page)}
                style={{
                  backgroundColor: currentPage === b.page
                    ? b.color.replace(/hsl\(([^)]+),\s*([^)]+),\s*([^)]+),\s*[^)]+\)/, 'hsl($1, $2, $3, 1)')
                    : b.color,
                  width: currentPage === b.page ? '32px' : '20px',
                  cursor: 'pointer'
                }}
              >
                <span
                  className={styles.bookmarkContainerLabel}
                  style={{
                    ...(currentPage === b.page && {
                      fontSize: '15px',
                      fontWeight: "bold",
                      paddingBottom: '4px'
                    }),
                  }}
                >
                  {b.page - 1}
                </span>
              </div>
            ))}
        </div>

        <div className={styles.rightBookmarkContainer}>
          {[...bookmarks
            .filter(b => b.page > rightPage || (b.page === rightPage && currentPage !== rightPage))
            .sort((a, b) => a.page - b.page)]
            .reverse()
            .map((b) => (
              <div
                key={b.page}
                className={`
                  ${styles.bookmarkMini}
                  ${animatingPages.includes(b.page) ? styles.bookmarkMiniAnimated : ''}
                  ${removingPages.includes(b.page) ? styles.bookmarkMiniRemoving : ''}
                `}
                onClick={() => goToPage(b.page)}
                style={{
                  backgroundColor: currentPage === b.page - 1
                    ? b.color.replace(/hsl\(([^)]+),\s*([^)]+),\s*([^)]+),\s*[^)]+\)/, 'hsl($1, $2, $3, 1)')
                    : b.color,
                  width: currentPage === b.page - 1 ? '32px' : '20px',
                  cursor: 'pointer'
                }}
              >
                <span
                  className={styles.bookmarkContainerLabel}
                  style={{
                    ...(currentPage === b.page - 1 && {
                      fontSize: '15px',
                      fontWeight: "bold",
                      paddingBottom: '4px'
                    }),
                  }}
                >
                  {b.page - 1}
                </span>
              </div>
            ))}
        </div>
      </div>

      <HTMLFlipBook
        ref={flipBookRef}
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
        className={`${styles.flipbook} ${
          currentPage === 0 ? styles.centeredCoverpage : ''
        } ${
          currentPage === totalPages - 1 ? styles.centeredLastPage : ''
        }`}
      >
        {pages.map((page, i) => (
          <Page
            key={i}
            number={i}
            totalPages={totalPages}
            currentPage={currentPage}
            pageType={page.type}
            onBookmarkAdd={handleAddBookmark}
            activeBookmarks={bookmarks}
          >
            <div className={styles.pageContent}>{page.content}</div>
          </Page>
        ))}
      </HTMLFlipBook>

      {/* Navigation Buttons */}
      <div className={styles.navButtons} style={{ width: navButtonWidth }}>
        <span
          style={currentPage === 0 ? { display: 'none' } : {}}
          onClick={() => goToPage(0)}
        >
          <LuChevronFirst className={styles.toTheFirst} style={{ left: "0px", cursor: "pointer" }} />
        </span>
        <span
          onClick={() => flipBookRef.current.pageFlip().flipPrev()}
          className={styles.navButton}
          style={currentPage === 0 ? { display: 'none' } : {}}
        >
          Prev
        </span>
        <span
          onClick={() => flipBookRef.current.pageFlip().flipNext()}
          className={styles.navButton}
          style={currentPage === totalPages - 1 ? { display: 'none' } : {}}
        >
          Next
        </span>
        <span
          style={currentPage === totalPages - 1 ? { display: 'none' } : {}}
          onClick={() => goToPage(totalPages - 1)}
        >
          <LuChevronLast className={styles.toTheLast} style={{ right: "0px", cursor: "pointer" }} />
        </span>
      </div>
    </div>
  );
}
