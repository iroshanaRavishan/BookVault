import React, { useEffect, useState } from 'react';
import styles from './bookmarks.module.css';
import { useParams } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';

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
    <div>Bookmark panel</div>
  )
}
