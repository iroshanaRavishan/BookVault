import React, { useCallback, useRef, useState } from "react";
import styles from "./bookgrid.module.css";
import BookCard from "../book-card/BookCard";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import useBooks from "../../hooks/useBook"; // adjust path based on your structure

export default function BookGrid() {
const { books, loading, fetchBooks } = useBooks();
  const [visibleCount, setVisibleCount] = useState(10);
  const observer = useRef();

  const [currentPage, setCurrentPage] = useState(1)
  const booksPerPage = 9
  const totalPages = Math.ceil(books.length / booksPerPage)

  const indexOfLastBook = currentPage * booksPerPage
  const indexOfFirstBook = indexOfLastBook - booksPerPage
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook)

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
      
      {books.length === 0 && !loading && (
        <div className={styles.noBooks}>
          <img src="../src/assets/disconnected.png" className={styles.disconnectedImage} alt="disconnected-image" />
          <span>No books found</span>
          <p>Please add some books to your collection.</p>
        </div>
      )}

      <div className={styles.gridContainer}>
        {currentBooks.map((book) => (
          <BookCard key={book.id} book={book} refreshBooks={fetchBooks} />
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
