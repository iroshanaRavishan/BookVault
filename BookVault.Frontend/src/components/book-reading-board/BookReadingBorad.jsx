import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './bookreadingborad.module.css';
import { useParams } from 'react-router-dom';
import FlipBook from '../flip-book-method-one/FlipBook';
import SideButtonsWrapper from '../side-button-wrapper/SideButtonWrapper';
import { getAppearance } from "../../utils/appearanceService";
import { applyColor, applyMargin, applyBrightness, applyBookmarkDim, applyFocusMode, applyTheme } from "../../utils/applyThemeHelpers";

export default function BookReadingBorad() {
  const { id } = useParams();
  const [bookId, setBookId] = useState('');
  const [bookName, setBookName] = useState('');
  const [bookPdfUrl, setBookPdfUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const [bookWidth, setBookWidth] = useState(100); // in percent
  const [mainPanel, setMainPanel] = useState(null);
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [isLeftPanelPinned, setIsLeftPanelPinned] = useState(false);
  const [selectedBookmarkedPageNumber, setSelectedBookmarkedPageNumber] = useState(null);
  const [thumbnailGeneratedBookmarkDelFromBook, setThumbnailGeneratedBookmarkDelFromBook] = useState(null);
  const [currentPageInfo, setCurrentPageInfo] = useState({
    left: 0,
    right: 1,
    total: null
  });

  // This replaces useState for isRightPanelOpen
  const isRightPanelOpen = useMemo(() => {
    const rightPanelNames = ["Bookmarks", "Appearance", "Reading Style", "Statistics"];
    const isRight = mainPanel?.position === "right" && rightPanelNames.includes(mainPanel.name);
    const isBottom = mainPanel?.position === "bottom";
    return (isRight || isBottom) && leftPanelOpen && isLeftPanelPinned;
  }, [mainPanel, leftPanelOpen, isLeftPanelPinned]);

  // function to force re-trigger bookmark navigation
  const handleBookmarkSelect = (pageNum) => {
    setSelectedBookmarkedPageNumber(null); // Reset to trigger change
    setTimeout(() => setSelectedBookmarkedPageNumber(pageNum), 0); // Set new page
  };

  // Load existing book data
  useEffect(() => {
    const loadBookData = async () => {
      if (!id) {
        setMessage("No book ID provided")
        setLoading(false)
        return
      }
      try {
        const response = await fetch(`https://localhost:7157/api/Books/${id}`)

        if (!response.ok) {
          throw new Error("Failed to load book data")
        }
        const bookData = await response.json();

        console.log(bookData, "bookData");

        // Populate form fields with existing data
        setBookId(bookData.id);
        setBookName(bookData.name || "");

        // Normalize slashes and form the public URL
        const normalizedPath = bookData.pdfFilePath.replace(/\\/g, '/');
        setBookPdfUrl(`https://localhost:7157/uploads/${normalizedPath}`);

        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error("Error loading book:", error)
        setMessage("Failed to load book data")
      }
    }

    loadBookData()
  }, [id]);

  useEffect(() => {
    const fetchAndApplyAppearance = async () => {
      try {
        // Get persisted ID from localStorage
        const appearanceId = localStorage.getItem("appearanceId");
        if (!appearanceId) return; // nothing to fetch yet

        const data = await getAppearance(appearanceId); // pass ID

        // Apply individually
        if (data.color) applyColor(data.color);
        if (data.marginEnabled !== undefined) applyMargin(data.marginEnabled);
        if (data.brightness) applyBrightness(data.brightness);
        if (data.isDimmed !== undefined) applyBookmarkDim(data.isDimmed);
        if (data.isFocusMode !== undefined) applyFocusMode(data.isFocusMode);
        if (data.isDarkTheme !== undefined) applyTheme(data.isDarkTheme);

      } catch (err) {
        console.error("Failed to load appearance settings", err);
      }
    };

    fetchAndApplyAppearance();
  }, []);

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);

    // Disable scroll
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);  // Reset scroll position to top

    // Cleanup function to enable scroll when the component is unmounted
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.wrapper} style={{ width: `${100 - bookWidth}%` }}>
        <SideButtonsWrapper
          bookWidth={bookWidth}
          setBookWidth={setBookWidth}
          containerRef={containerRef}
          mainPanel={mainPanel}
          setMainPanel={setMainPanel}
          leftPanelOpen={leftPanelOpen}
          setLeftPanelOpen={setLeftPanelOpen}
          isLeftPanelPinned={isLeftPanelPinned}
          setIsLeftPanelPinned={setIsLeftPanelPinned}
          onBookmarkSelect={handleBookmarkSelect}
          onThumbnailGeneratedBookmarkDelFromBook={thumbnailGeneratedBookmarkDelFromBook}
          currentPageInfo={currentPageInfo}
        />
      </div>
      <div className={styles.book} style={{ width: `${bookWidth}%` }}>
        <FlipBook
          isRightPanelOpen={isRightPanelOpen}
          selectedBookmarkedPageNumber={selectedBookmarkedPageNumber}
          setThumbnailGeneratedBookmarkDelFromBook={setThumbnailGeneratedBookmarkDelFromBook}
          setCurrentPageInfo={setCurrentPageInfo}
        />
      </div>
    </div>
  );
}
