import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './bookreadingborad.module.css';
import { useParams } from 'react-router-dom';
import FlipBook from '../flip-book-method-one/FlipBook';
import SideButtonsWrapper from '../side-button-wrapper/SideButtonWrapper';

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

  // This replaces useState for isRightPanelOpen
  const isRightPanelOpen = useMemo(() => {
    const rightPanelNames = ["Bookmarks", "Appearance", "Reading Style", "Statistics"];
    const isRight = mainPanel?.position === "right" && rightPanelNames.includes(mainPanel.name);
    const isBottom = mainPanel?.position === "bottom";
    return (isRight || isBottom) && leftPanelOpen && isLeftPanelPinned;
  }, [mainPanel, leftPanelOpen, isLeftPanelPinned]);

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

  useEffect(()=>{
    // Disable scroll when the component is mounted
    document.body.style.overflow = 'hidden';

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
        />
      </div>
      <div className={styles.book} style={{ width: `${bookWidth}%` }}>
        <FlipBook isRightPanelOpen={isRightPanelOpen}/>
      </div>
    </div>
  );
}
