import React, { useEffect, useState } from 'react';
import styles from './bookmarks.module.css';
import { useParams } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { RiDeleteBin6Fill } from 'react-icons/ri';

export default function Bookmarks({ openedAt }) {
  const { id } =useParams(); 
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

  async function handleDeleteBookmark (id) {
      try {
        const response = await fetch("https://localhost:7157/api/Bookmark", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ id: id })
        });

        if (response.status === 204) {
          // setBookmarks(prev => prev.filter(b => b.id !== id));
          console.log("Bookmark successfully deleted.");
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

  return (
    <div className={styles.bookmarkPanel}>
      <div style={{ position: "relative", display: "inline-block" }}>
        <button onClick={() => setSortMenuOpen(!sortMenuOpen)} className={styles.sortButton}>
          Sort
        </button>
        {sortMenuOpen && (
          <ul className={styles.sortDropdown}>
            <li onClick={() => handleSortChange("newest")} className={sortType === 'newest' ? styles.active : ''}>Newest First</li>
            <li onClick={() => handleSortChange("oldest")} className={sortType === 'oldest' ? styles.active : ''}>Oldest First</li>
            <li onClick={() => handleSortChange("page-asc")} className={sortType === 'page-asc' ? styles.active : ''}>Page Number ↑</li>
            <li onClick={() => handleSortChange("page-desc")} className={sortType === 'page-desc' ? styles.active : ''}>Page Number ↓</li>
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
              >
                <div className={styles.bookmarkRow}>
                  <span className={styles.pageText}>page</span> 
                  <span className={styles.pageNumber}> {bookmark.pageNumber} </span>
                  <span className={styles.createdDate}>
                    <small>Created at: </small>
                    <small>{new Date(bookmark.createdAt).toLocaleString()}</small>
                  </span>
                </div>
                <div >
                  <RiDeleteBin6Fill size={18} className={styles.bookmarkDeleteButton} onClick={()=>handleDeleteBookmark(bookmarks[i].id)} />
                </div>
              </li>
            ))}
          </ul>
          <div className={styles.pagePreviewContaienr}>
            <span className={styles.pagePreviewText}>Page preview</span>
            <div className={styles.pagePreview}>
              <img src="../../../src/assets/profile-image.jpg" className={styles.pageThumbnail} alt="page-thumbnail" />
            </div>
            <button className={styles.jumpToPageButton}>Jump to page</button>
          </div>
        </div>
      ) : (
        <p>No bookmarks found.</p>
      )}
    </div>
  )
}
