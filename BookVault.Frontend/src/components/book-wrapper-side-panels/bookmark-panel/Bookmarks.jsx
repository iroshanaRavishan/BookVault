import React, { useEffect, useRef, useState } from 'react';
import styles from './bookmarks.module.css';
import { useParams } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { BsSortUp } from "react-icons/bs";
import { HiMiniArrowLongUp, HiMiniArrowLongDown } from "react-icons/hi2";
import BookmarkListener from '../../bookmark-listener/BookmarkListener';
import { GoBookmarkSlashFill } from "react-icons/go";
import { BiSolidDuplicate } from "react-icons/bi";
import { FaChevronUp } from "react-icons/fa6";
import { MdImageNotSupported } from "react-icons/md";

export default function Bookmarks({ openedAt, onBookmarkItemDoubleClick, thumbnailGeneratedBookmarkDelFromBook }) {
  const dropdownRef = useRef(null);
  const { id } = useParams(); 
  const { user } = useUser();
  const [bookmarks, setBookmarks] = useState(null);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortType, setSortType] = useState(localStorage.getItem('bookmarkSort') || 'page-asc');
  const [thumbnailGeneratedFor, setThumbnailGeneratedFor] = useState(() => {
    const saved = localStorage.getItem('thumbnailGeneratedFor');
    return saved ? JSON.parse(saved) : { path: null, page: null };
  });
  const [toggleDown, setToggleDown] = useState(true);
  const [lastClickTime, setLastClickTime] = useState(0);

  function handleSortChange(type) {
    setSortType(type);
    localStorage.setItem('bookmarkSort', type);
    setSortMenuOpen(false);
  }
  
  function ImagePathReviser(path){
    return `https://localhost:7157/uploads/${path.replace(/\\/g, '/')}`;
  }

  useEffect(() => {
    if (thumbnailGeneratedBookmarkDelFromBook?.page === thumbnailGeneratedFor.page) {
      setThumbnailGeneratedFor({ path: null, page: null });
    }
  }, [thumbnailGeneratedBookmarkDelFromBook]);

  useEffect(() => {
    if (thumbnailGeneratedFor.path || thumbnailGeneratedFor.page) {
      localStorage.setItem('thumbnailGeneratedFor', JSON.stringify(thumbnailGeneratedFor));
    }
  }, [thumbnailGeneratedFor]);
  
  useEffect(() => {
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
        setBookmarks(result);
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
      }
    };

    if (user?.id && id) {
      fetchAllBookmarks();
    }
  }, [openedAt, user?.id, id, sortType]); 

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSortMenuOpen(false);
      }
    }

    if (sortMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sortMenuOpen]);

  async function handleDeleteBookmark(bookmark) {
    // Check if this is the last bookmark
    let isLastBookmark = false;
    if (bookmarks && bookmarks.length === 1 && bookmarks[0].id === bookmark.id) {
      isLastBookmark = true;
      localStorage.removeItem('thumbnailGeneratedFor');
      setThumbnailGeneratedFor({ path: null, page: null });
    }

    if (bookmark.pageNumber === thumbnailGeneratedFor.page) {
      setThumbnailGeneratedFor({ path: null, page: null });
    }

    try {
      const response = await fetch("https://localhost:7157/api/Bookmark", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: bookmark.id, isLastBookmark: isLastBookmark })
      });

      if (response.status === 204) {
        console.log("Bookmark successfully deleted.");
        setBookmarks((prev) => prev.filter((b) => b.id !== bookmark.id));
      } else if (response.status === 404) {
        console.log("Bookmark not found. It may have already been deleted.");
      } else {
        throw new Error("Unexpected error occurred.");
      }

    } catch (error) {
      console.error("Error deleting bookmark:", error);
      console.log("An error occurred while deleting the bookmark.");
      // TODO: show the error in a proper way in the frontend
    }
  }

  function getSortTypeName(type) {
    if (type === 'newest') {
      return 'Newest First';
    } 
    if (type === 'oldest') {
      return 'Oldest First';
    } 
    if (type === 'page-asc') {
      return (
        <>
          Page Number <HiMiniArrowLongUp size={14}/>
        </>
      );
    } 
    if (type === 'page-desc') {
      return (
        <>
          Page Number <HiMiniArrowLongDown size={14}/>
        </>
      );
    }
    return 'Sort'; // default fallback
  }

useEffect(() => {
  if (thumbnailGeneratedFor.path || thumbnailGeneratedFor.page) {
    localStorage.setItem('thumbnailGeneratedFor', JSON.stringify(thumbnailGeneratedFor));
  }
}, [thumbnailGeneratedFor]);

  // Handle new bookmark from SignalR
  const handleNewBookmark = (newBookmark) => {
    setBookmarks((prev) => (prev ? [newBookmark, ...prev] : [newBookmark]));
  };

  // Handle deletion from SignalR (real-time)
  const handleDeletedBookmarkFromSignalR = (bookmarkId) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
  };

  async function handleGenerateBookmarkThumbnail(bookmark) {
    const filePathToBeCleaned = bookmark.bookmarkThumbnailSourcePath;
    // Split by backslash and get last part
    const cleanedFilePath = filePathToBeCleaned.split('\\').pop();

    let generatedThumbnailPath = null;

    if (thumbnailGeneratedFor.page !== bookmark.pageNumber) {
      try {
        const type = "bookmark";
        const thumbnailResponse = await fetch(`https://localhost:7157/api/PdfThumbnail/${cleanedFilePath}?type=${type}&page=${bookmark.pageNumber}`, {
          method: "GET"
        });

        const thumbnailResult = await thumbnailResponse.json();
        const path = ImagePathReviser(thumbnailResult.thumbnailPath);

        if (thumbnailResponse.ok) {
         const res = await fetch(`https://localhost:7157/api/Bookmark/${bookmark.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ userId: bookmark.userId, bookId: bookmark.bookId, bookmarkThumbnailImagePath: thumbnailResult.thumbnailPath })
         })

        // Update local bookmarks state
        setBookmarks(prev => prev.map(b =>
          b.id === bookmark.id
            ? { ...b, bookmarkThumbnailImagePath: thumbnailResult.thumbnailPath }
            : b
        ));

        } else {
          throw new Error("Failed to generate thumbnail");
        }

      console.log("Thumbnail generated:", thumbnailResult);
      const updatedPath = `${path}?t=${new Date().getTime()}`;
      setThumbnailGeneratedFor({ path: updatedPath, page: bookmark.pageNumber });

      generatedThumbnailPath = thumbnailResult.thumbnailPath;
      console.log("generatedThumbnailPath", generatedThumbnailPath);
      // setExistingThumbnailPath(generatedThumbnailPath); 
      } catch (thumbnailError) {
        console.error("Error generating thumbnail:", thumbnailError);
        throw new Error("Failed to generate thumbnail for bookmark");
      }
    }
  }

  const handleClick = () => {
    const now = Date.now();
    if (now - lastClickTime < 1100) return; // Ignore clicks within 1000ms
    setLastClickTime(now);

    if (onBookmarkItemDoubleClick) {
      onBookmarkItemDoubleClick(thumbnailGeneratedFor.page);
    }
  };

  return (
    <div className={styles.bookmarkPanel}>
      {/* Listen for new bookmarks in real-time */}
      <BookmarkListener 
        onBookmarkCreated={handleNewBookmark} 
        onBookmarkDeleted={handleDeletedBookmarkFromSignalR} 
      />
      <div style={{ position: "relative", display: "flex" }} ref={dropdownRef}>
        <div className={styles.bookmarkPanelDetailBar}>
          <button onClick={() => setSortMenuOpen((prev) => !prev)} className={styles.sortButton}>
            <span className={styles.sortIconWithText}><BsSortUp size={18} /> Sort : </span>  
            <span className={styles.sortTypeText}>{getSortTypeName(sortType)}</span>
          </button>
          <span className={styles.totalBookmarkText}>Total Bookmarks: {bookmarks?.length}</span>
        </div>
        {sortMenuOpen && (
          <ul className={styles.sortDropdown}>
            <li onClick={() => handleSortChange("newest")} className={sortType === 'newest' ? styles.active : ''}>Newest First</li>
            <li onClick={() => handleSortChange("oldest")} className={sortType === 'oldest' ? styles.active : ''}>Oldest First</li>
            <li onClick={() => handleSortChange("page-asc")} className={sortType === 'page-asc' ? styles.active : ''}> 
              <span style={{display: 'flex', flexDirection: 'row' ,alignItems: "center"}}> 
                Page Number 
                <HiMiniArrowLongUp style={{marginTop: '4px'}} size={14}/>
              </span>
            </li>
            <li onClick={() => handleSortChange("page-desc")} className={sortType === 'page-desc' ? styles.active : ''}> 
              <span style={{display: 'flex', flexDirection: 'row' ,alignItems: "center"}}> 
                Page Number 
                <HiMiniArrowLongDown style={{marginTop: '4px'}} size={14}/>
              </span>
            </li>
          </ul>
        )}
      </div>
      {bookmarks && bookmarks.length > 0 ? (
        <div className={styles.bookmarkPanelContainer}>
          <ul className={`${styles.bookmarkList} ${toggleDown ? '' : styles.expanded}`}>
            {bookmarks.map((bookmark, i) => (
              <li
                key={bookmark.id}
                className={styles.bookmarkItem}
                style={{
                  '--border-color': bookmarks[i].color,
                  '--border-color-hover': bookmarks[i].color.replace(/,?\s*[\d.]+\)$/, ', 1)'),
                }}
                onDoubleClick={() => onBookmarkItemDoubleClick && onBookmarkItemDoubleClick(bookmark.pageNumber)}
              >
                <div className={styles.bookmarkRow}>
                  <span className={styles.pageText}>page</span> 
                  <span className={styles.pageNumber}> {bookmark.pageNumber} </span>
                  <span className={styles.createdDate}>
                    <small>Created at: </small>
                    <small>
                      {new Date(bookmark.createdAt).toLocaleString([], {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </small>
                  </span>
                </div>
                <div className={styles.bookmarkListActionButtons}>
                  <div 
                    onDoubleClick={(e) => e.stopPropagation()} // Disable double-click
                  >
                    <BiSolidDuplicate 
                      size={18} 
                      className={styles.bookmarkActionButton}
                      onClick={(e) =>{
                        e.stopPropagation(),  // <-- Prevents triggering the <li> onClick
                        handleGenerateBookmarkThumbnail(bookmark)
                      }}
                    />
                  </div>
                  <div
                    onDoubleClick={(e) => e.stopPropagation()} // Disable double-click
                  >
                    <RiDeleteBin6Fill 
                      size={18} 
                      className={styles.bookmarkActionButton} 
                      onClick={(e) => {
                        e.stopPropagation(),  // <-- Prevents triggering the <li> onClick
                        handleDeleteBookmark(bookmarks[i])
                      }} 
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className={`${styles.pagePreviewContaienr} ${toggleDown ? styles.open : styles.closed}`}>
            <div className={styles.pagePreviewContaienrHeader}>
              <span className={styles.pagePreviewText}>Page preview of selected bookmark <i> {thumbnailGeneratedFor.page}</i></span>
              <span 
                className={styles.pagePreviewToggler} 
                onClick={() => setToggleDown(prev => !prev)}
              >
                <FaChevronUp style={{marginTop: '4px'}} size={18}/></span>
            </div>
            <div className={styles.pagePreview}>
              { thumbnailGeneratedFor.path ?
                 <img src={thumbnailGeneratedFor.path} className={styles.pageThumbnail} alt="page-thumbnail" /> 
                 : <span className={styles.pageThumbnailWithNoImage}>
                    <MdImageNotSupported size={30} />
                    <p>No Bookmark is seleted!</p>
                  </span>
              }
            </div>
            <button 
              className={styles.jumpToPageButton}
              onClick={handleClick}
              onDoubleClick={(e) => e.stopPropagation()}
            >
              Jump to page
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.noBookmarksText}>
          <GoBookmarkSlashFill size={30}/>
          <p>No bookmarks found.</p>
        </div>
      )}
    </div>
  );
}
