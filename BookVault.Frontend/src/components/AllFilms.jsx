import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getStoredBooks } from '../utils/storage';
import { BookCard } from './BookCard';
import styles from './componentstyles.module.css';

export default function AllBooks() {
    const [books, setBooks] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);
    const observer = useRef();

    useEffect(() => {
        setBooks(getStoredBooks());
    }, []);

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
