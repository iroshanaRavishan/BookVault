import React, { forwardRef, useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import styles from './flipbook.module.css';
import BookBindingHoles from '../book-binding-holes/BookBindingHoles';
import { IoAddCircleSharp, IoCloseCircleSharp } from "react-icons/io5";
import { LuChevronFirst, LuChevronLast, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { useUser } from '../../context/UserContext';
import { useParams } from 'react-router-dom';
import BookmarkListener from '../bookmark-listener/BookmarkListener';

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

export default function FlipBook({ isRightPanelOpen, selectedBookmarkedPageNumber }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [bookmarks, setBookmarks] = useState([]);
  const [animatingPages, setAnimatingPages] = useState([]);
  const [removingPages, setRemovingPages] = useState([]);
  const {user} = useUser();
  const { id } = useParams();

  const contentPages = 40;
  const totalPages = 2 + contentPages + (contentPages % 2 === 1 ? 1 : 0) + 2;
  const flipBookRef = useRef();
  const pages = [];
  const BOOKMARKS_PER_PAGE = 14;
  const [leftPageIndex, setLeftPageIndex] = useState(0);
  const [rightPageIndex, setRightPageIndex] = useState(0);

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

  useEffect(() => {
    const sortType = "page-asc";
    const fetchAllBookmarks = async () => {
      const url = `https://localhost:7157/api/Bookmark?userId=${user.id}&bookId=${id}&sortBy=${sortType}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bookmarks");
        }

        const result = await response.json();
        setBookmarks(result.map(b => ({
        ...b,
        page: b.pageNumber + 1
      })));
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
      }
    };

    // if (user?.id && id) {
      fetchAllBookmarks();
    // }
  }, []); 

  // Handle deletion from SignalR (real-time)
  const handleDeletedBookmarkFromSignalR = (bookmarkId) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
  };

  // When navigating to a bookmark:
  useEffect(() => {
    if (selectedBookmarkedPageNumber !== null) {
      const bookmark = bookmarks.find(b => b.pageNumber === selectedBookmarkedPageNumber);
      if (bookmark) {
        goToPage(bookmark.page);
      }
    }
  }, [selectedBookmarkedPageNumber, bookmarks]);

  const handleAddBookmark = async (pageNumber) => {
    const currentBookmark = bookmarks.find(b => b.page === pageNumber);
    if (currentBookmark) {
      // Trigger removal animation

      // Check if this is the last bookmark
      let isLastBookmark = false;
      if (bookmarks && bookmarks.length === 1 && bookmarks[0].id === currentBookmark.id) {
        isLastBookmark = true;
      }
    
      try {
        const response = await fetch("https://localhost:7157/api/Bookmark", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ id: currentBookmark.id, isLastBookmark: isLastBookmark })
        });

        if (response.status === 204) {
          console.log("Bookmark successfully deleted.");
        } else if (response.status === 404) {
          console.log("Bookmark not found. It may have already been deleted.");
        } else {
          throw new Error("Unexpected error occurred.");
        }

        setRemovingPages(prev => [...prev, pageNumber]);
        setTimeout(() => {
          setBookmarks(prev => prev.filter(b => b.page !== pageNumber));
          setRemovingPages(prev => prev.filter(p => p !== pageNumber));
        }, 300);

      } catch (error) {
        console.error("Error deleting bookmark:", error);
        console.log("An error occurred while deleting the bookmark.");
        // TODO: show the error in a proper way in the frontend
      }
    } else {
      const getCustomRandomInt = () => {
        const validNumbers = [
          ...Array.from({ length: 3 }, (_, i) => i + 1),   // 1–3
          ...Array.from({ length: 29 }, (_, i) => i + 7)   // 7–35
        ];
        const index = Math.floor(Math.random() * validNumbers.length);
        return validNumbers[index];
      };

      const hue = getCustomRandomInt() * 10;
      const randomColor = `hsl(${hue}, 70%, 60%, 0.8)`;
      console.log("user id is : " + user.id );
      console.log("book id : " + id );

      const newBookmark = {
        userId: user.id,
        bookId: id, 
        pageNumber: pageNumber - 1,
        color: randomColor,
        bookmarkThumbnailPath: null
      };

      try {
        const response = await fetch("https://localhost:7157/api/Bookmark", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newBookmark)
        });

        if (!response.ok) {
          throw new Error("Failed to add bookmark");
        }

        const result = await response.json(); // Get the response body

        setBookmarks(prev => [...prev, { id: result.id, page: result.pageNumber + 1, color: result.color, pageNumber: result.pageNumber}]);

        // Trigger entry animation
        setAnimatingPages(prev => [...prev, pageNumber]);
        setTimeout(() => {
          setAnimatingPages(prev => prev.filter(p => p !== pageNumber));
        }, 300);

      } catch (error) {
        console.error("Error adding bookmark:", error);
        // TODO: show the error in a proper way in the frontend
      }
    }
  };

  function findBookmarkSliderIndex(bookmarkPage, bookmarkPages) {
    for (let i = 0; i < bookmarkPages.length; i++) {
      if (bookmarkPages[i].some(b => b.page === bookmarkPage)) {
        return i;
      }
    }
    return 0;
  }

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

    // === Front Cover Special Case ===
    else if (current === firstCover) {
      await instance.flipNext(); // turn front cover
      await delay(1000);
      await instance.flip(targetPage); // go to actual page
    }

    // === Back Cover Special Case ===
    else if (current === lastCover) {
      await instance.flipPrev(); // turn back cover
      await delay(1000);
      await instance.flip(targetPage);
    }

    // === Normal Flip ===
    else {
      await delay(100);
      await instance.flip(targetPage);
    }

    // After flipping, update the bookmark slider indices
    // Find the new left/right bookmarks and their pages
    const newLeftPage = targetPage % 2 === 0 ? targetPage : targetPage - 1;
    const newRightPage = newLeftPage + 2;

    // Recalculate left/right bookmarks
    const newLeftBookmarks = [...bookmarks]
      .filter(b => b.page < newLeftPage + 2 || (b.page === newLeftPage && targetPage !== newLeftPage))
      .sort((a, b) => a.page - b.page);

    const newRightBookmarks = [...bookmarks]
      .filter(b => b.page > newRightPage || (b.page === newRightPage && targetPage !== newRightPage))
      .sort((a, b) => a.page - b.page);

    const newLeftBookmarkPages = Array.from({ length: Math.ceil(newLeftBookmarks.length / BOOKMARKS_PER_PAGE) }, (_, i) =>
      newLeftBookmarks.slice(i * BOOKMARKS_PER_PAGE, (i + 1) * BOOKMARKS_PER_PAGE)
    );

    const firstPage = newRightBookmarks.slice(0, BOOKMARKS_PER_PAGE);
    const remaining = newRightBookmarks.slice(BOOKMARKS_PER_PAGE);

    let newRightBookmarkPages = [firstPage];
    for (let i = 0; i < remaining.length; i += BOOKMARKS_PER_PAGE) {
      newRightBookmarkPages.push(remaining.slice(i, i + BOOKMARKS_PER_PAGE));
    }
  };

  const leftBookmarks = [...bookmarks]
    .filter(b => b.page < leftPage + 2 || (b.page === leftPage && currentPage !== leftPage))
    .sort((a, b) => a.page - b.page);

  const rightBookmarks = [...bookmarks]
    .filter(b => b.page > rightPage || (b.page === rightPage && currentPage !== rightPage))
    .sort((a, b) => a.page - b.page);

  const firstPage = rightBookmarks.slice(0, BOOKMARKS_PER_PAGE);
  const remaining = rightBookmarks.slice(BOOKMARKS_PER_PAGE);

  // Split into pages
  const leftBookmarkPages = Array.from({ length: Math.ceil(leftBookmarks.length / BOOKMARKS_PER_PAGE) }, (_, i) =>
    leftBookmarks.slice(i * BOOKMARKS_PER_PAGE, (i + 1) * BOOKMARKS_PER_PAGE)
  );

  let rightBookmarkPages = [firstPage];
  for (let i = 0; i < remaining.length; i += BOOKMARKS_PER_PAGE) {
    rightBookmarkPages.push(remaining.slice(i, i + BOOKMARKS_PER_PAGE));
  }

  useEffect(() => {
    const leftPageCount = Math.ceil(leftBookmarks.length / BOOKMARKS_PER_PAGE);
    const rightPageCount = rightBookmarkPages.length;

    if (leftPageIndex >= leftPageCount) {
      setLeftPageIndex(leftPageCount > 0 ? leftPageCount - 1 : 0);
    }

    if (rightPageIndex >= rightPageCount) {
      setRightPageIndex(rightPageCount > 0 ? rightPageCount - 1 : 0);
    }
  }, [bookmarks, leftBookmarks, rightBookmarkPages, leftPageIndex, rightPageIndex]);


  const navButtonWidth = isFirstPage || isLastPage ? '480px' : '920px';

  return (
    <div className={styles.wrapper} style={{ width: isRightPanelOpen ? 'calc(100% - 350px)' : '100%' }}>
      <BookmarkListener onBookmarkDeleted={handleDeletedBookmarkFromSignalR} />
      <div 
        className={styles.bookmarkContainers}
        style={{ transform: containerTransform }}
      >
        <div className={styles.leftBookmarkContainer}>
          {leftBookmarkPages[leftPageIndex] &&  leftBookmarkPages[leftPageIndex].map((b) => (
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
                  width: currentPage === b.page ? '32px' : '21px',
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
          
          {/* Left Navigation Arrows */}
          {leftBookmarkPages.length > 1 && (
            <>
              {leftPageIndex > 0 && (
                <div
                  className={styles.arrowLeft}
                  onClick={() => setLeftPageIndex(p => p - 1)}
                >
                  <LuChevronLeft size={30}/>
                </div>
              )}
              {leftPageIndex < leftBookmarkPages.length - 1 && (
                <div
                  className={styles.arrowRight}
                  onClick={() => setLeftPageIndex(p => p + 1)}
                >
                  <LuChevronRight size={30}/>
                </div>
              )}

              {/* Page Indicators */}
              <div className={styles.pageIndicators}>
                {leftBookmarkPages.map((_, i) => (
                  <span 
                    key={i}
                    className={`${styles.indicator} ${
                      i === leftPageIndex ? styles.activeIndicator : ''
                    }`}
                  ></span>
                ))}
              </div>
            </>
          )}
        </div>

        <div className={styles.rightBookmarkContainer}>
            {rightBookmarkPages[rightPageIndex]?.map((b) => (
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
                  width: currentPage === b.page - 1 ? '32px' : '21px',
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

          {/* Right Navigation Arrows */}
          {rightBookmarkPages.length > 1 && (
            <>
              {rightPageIndex > 0 && (
                <div
                  className={styles.arrowLeft}
                  onClick={() => setRightPageIndex((p) => p - 1)}
                >
                  <LuChevronLeft size={30}/>
                </div>
              )}
              {rightPageIndex < rightBookmarkPages.length - 1 && (
                <div
                  className={styles.arrowRight}
                  onClick={() => setRightPageIndex((p) => p + 1)}
                >
                  <LuChevronRight size={30}/>
                </div>
              )}

              {/* Page Indicators */}
              <div className={styles.pageIndicators}>
                {rightBookmarkPages.map((_, i) => (
                  <span
                    key={i}
                    className={`${styles.indicator} ${
                      i === rightPageIndex ? styles.activeIndicator : ''
                    }`}
                  ></span>
                ))}
              </div>
            </>
          )}
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
        onFlip={({ data }) => {
          setCurrentPage(data);

          // Calculate left/right bookmarks for the new page
          const newLeftPage = data % 2 === 0 ? data : data - 1;
          const newRightPage = newLeftPage + 1;

          const newLeftBookmarks = [...bookmarks]
            .filter(b => b.page < newLeftPage + 2 || (b.page === newLeftPage && data !== newLeftPage))
            .sort((a, b) => a.page - b.page);

          const newRightBookmarks = [...bookmarks]
            .filter(b => b.page > newRightPage || (b.page === newRightPage && data !== newRightPage))
            .sort((a, b) => a.page - b.page);

          const newLeftBookmarkPages = Array.from({ length: Math.ceil(newLeftBookmarks.length / BOOKMARKS_PER_PAGE) }, (_, i) =>
            newLeftBookmarks.slice(i * BOOKMARKS_PER_PAGE, (i + 1) * BOOKMARKS_PER_PAGE)
          );

          const firstPage = newRightBookmarks.slice(0, BOOKMARKS_PER_PAGE);
          const remaining = newRightBookmarks.slice(BOOKMARKS_PER_PAGE);

          let newRightBookmarkPages = [firstPage];
          for (let i = 0; i < remaining.length; i += BOOKMARKS_PER_PAGE) {
            newRightBookmarkPages.push(remaining.slice(i, i + BOOKMARKS_PER_PAGE));
          }

          // Find the slider index for the new page in both containers
          const leftIndex = findBookmarkSliderIndex(data, newLeftBookmarkPages);
          const rightIndex = findBookmarkSliderIndex(data, newRightBookmarkPages);

          setLeftPageIndex(leftIndex);
          setRightPageIndex(rightIndex);
        }}
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
