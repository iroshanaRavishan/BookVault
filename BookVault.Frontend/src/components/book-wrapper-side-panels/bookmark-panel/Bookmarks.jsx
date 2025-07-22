import React, { useEffect, useRef, useState } from 'react';
import styles from './bookmarks.module.css';
import { useParams } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { BsSortUp } from "react-icons/bs";
import { HiMiniArrowLongUp, HiMiniArrowLongDown } from "react-icons/hi2";
import BookmarkListener from '../../bookmark-listener/BookmarkListener';
import { GoBookmarkSlashFill } from "react-icons/go";

export default function Bookmarks({ openedAt, onBookmarkItemDoubleClick }) {
  const dropdownRef = useRef(null);
  const { id } = useParams(); 
  const { user } = useUser();
  const [bookmarks, setBookmarks] = useState(null);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortType, setSortType] = useState(localStorage.getItem('bookmarkSort') || 'page-asc');

  function handleSortChange(type) {
    setSortType(type);
    localStorage.setItem('bookmarkSort', type);
    setSortMenuOpen(false);
  }
    
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

  async function handleDeleteBookmark(id) {
    try {
      const response = await fetch("https://localhost:7157/api/Bookmark", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: id })
      });

      if (response.status === 204) {
        console.log("Bookmark successfully deleted.");
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
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

  // Handle new bookmark from SignalR
  const handleNewBookmark = (newBookmark) => {
    setBookmarks((prev) => (prev ? [newBookmark, ...prev] : [newBookmark]));
  };

  // Handle deletion from SignalR (real-time)
  const handleDeletedBookmarkFromSignalR = (bookmarkId) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
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
          <ul className={styles.bookmarkList}>
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
                <div>
                  <RiDeleteBin6Fill size={18} className={styles.bookmarkDeleteButton} onClick={() => handleDeleteBookmark(bookmarks[i].id)} />
                </div>
              </li>
            ))}
          </ul>
          <div className={styles.pagePreviewContaienr}>
            <span className={styles.pagePreviewText}>Page preview of page {thumbnailGeneratedFor}</span>
            <div className={styles.pagePreview}>
              <img src="../../../src/assets/profile-image.jpg" className={styles.pageThumbnail} alt="page-thumbnail" />
            </div>
            <button className={styles.jumpToPageButton}>Jump to page</button>
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
