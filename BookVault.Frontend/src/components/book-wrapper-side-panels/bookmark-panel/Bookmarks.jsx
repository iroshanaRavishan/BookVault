import React, { useEffect, useState } from 'react';
import styles from './bookmarks.module.css';
import { useParams } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { RiDeleteBin6Fill } from 'react-icons/ri';

export default function Bookmarks({ openedAt }) {
  const { id } =useParams(); 
  const { user } = useUser();
  const [bookmarks, setBookmarks] = useState(null);
  
  useEffect(() => {
    const fetchAllBookmarks = async () => {
      const url = `https://localhost:7157/api/Bookmark?userId=${user.id}&bookId=${id}`;
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
        console.log(result); 
        console.log("the coloe: ", bookmarks?.color)
        console.log(openedAt); 
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
      }
    };

    if (user?.id && id) {
      fetchAllBookmarks();
    }
  }, [openedAt]); 

  return (
    <div className={styles.bookmarkPanel}>
      {bookmarks && bookmarks.length > 0 ? (
        <ul className={styles.bookmarkList}>
          {bookmarks.map((bookmark, i) => (
            <li key={bookmark.id} className={styles.bookmarkItem} style={{borderColor: bookmarks[i].color}}>
              <div className={styles.bookmarkRow}>
                <span className={styles.pageText}>page</span> 
                <span className={styles.pageNumber}> {bookmark.pageNumber} </span>
                <span className={styles.createdDate}>
                  <small>Created at: </small>
                  <small>{new Date(bookmark.createdAt).toLocaleString()}</small>
                </span>
              </div>
              <div >
                <RiDeleteBin6Fill size={16} className={styles.bookmaekDeleteButton}  />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No bookmarks found.</p>
      )}
    </div>
  )
}
