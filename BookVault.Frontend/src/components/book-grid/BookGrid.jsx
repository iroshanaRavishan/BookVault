import React, { useCallback, useEffect, useRef, useState } from "react"
import styles from "./bookgrid.module.css";
import BookCard from "../book-card/BookCard";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";

export default function BookGrid() {
  const [books, setBooks] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const observer = useRef();

  const [currentPage, setCurrentPage] = useState(1)
  const booksPerPage = 8
  const totalPages = Math.ceil(books.length / booksPerPage)

  const indexOfLastBook = currentPage * booksPerPage
  const indexOfFirstBook = indexOfLastBook - booksPerPage
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook)

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

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }

  return (
    <div>
      {loading && (
        <div className={styles.loadingWidget}>
          <div className={styles.spinner}></div>
          <span>Loading books...</span>
        </div>
      )}
      
      {books && books.length === 0 && !loading && (
        <div className={styles.noBooks}>
          <img src="../src/assets/disconnected.png" className={styles.disconnectedImage} alt="disconnected-image" />
          <span>No books found</span>
          <p>Please add some books to your collection.</p>
        </div>
      )}

      <div className={styles.gridContainer}>
        {currentBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      <div className={styles.pagination}>
        <button className={styles.button} onClick={handlePrevPage} disabled={currentPage === 1}>
          <GoChevronLeft size={20}/>
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button className={styles.button} onClick={handleNextPage} disabled={currentPage === totalPages}>
          <GoChevronRight size={20}/>
        </button>
      </div>
    </div>
  )
}
