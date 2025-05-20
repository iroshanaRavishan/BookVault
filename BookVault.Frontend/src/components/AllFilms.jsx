import React, { useEffect, useState, useRef, useCallback } from 'react';
import { BookCard } from './BookCard';
import styles from './componentstyles.module.css';

export default function AllBooks() {
  const [books, setBooks] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const observer = useRef();

  useEffect(() => {
    fetchBooksFromBackend();
  }, []);

  const fetchBooksFromBackend = async () => {
    try {
      const res = await fetch('https://localhost:7157/api/Books');
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

    const lastBookRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && visibleCount < books.length) {
          setVisibleCount((prev) => prev + 10);
        }
      });

      if (node) observer.current.observe(node);
    },
    [visibleCount, books.length]
  );

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>All Books</h2>

      {loading && <p>Loading books...</p>}

      <div className={styles.bookGrid}>
        {books.slice(0, visibleCount).map((book, index) => {
          if (index === visibleCount - 1) {
            return <BookCard key={book.id} book={book} ref={lastBookRef} />;
          }
          return <BookCard key={book.id} book={book} />;
        })}
      </div>
    </div>
  );
}
