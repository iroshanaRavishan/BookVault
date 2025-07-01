import React, { useEffect } from 'react';
import styles from './bookreadingborad.module.css';
import { useParams } from 'react-router-dom';

export default function BookReadingBorad() {
  const { id } = useParams();

      useEffect(() => {
        const loadBookData = async () => {
          if (!id) {
            setMessage("No book ID provided")
            return
          }
          try {
            const response = await fetch(`https://localhost:7157/api/Books/${id}`)
    
            if (!response.ok) {
              throw new Error("Failed to load book data")
            }
            const bookData = await response.json();
          } catch (error) {
            console.error("Error loading book:", error)
            setMessage("Failed to load book data")
          }
        }
    
        loadBookData()
      }, [id])

  return (
    <div className={styles.container}>BookReadingBorad - { id } </div>
  )
}
