import React, { useCallback, useEffect, useRef, useState } from "react"
import styles from "./bookgrid.module.css"
import BookCard from "../book-card/BookCard"

// const mockBooks = [
//   { id: 1, watched: true, title: "The Shawshank Redemption", year: 1994, genre: "Drama", director: "Frank Darabont", poster: "/placeholder.svg?height=450&width=300", rating: 9.3 },
//   { id: 2, watched: false, title: "The Godfather", year: 1972, genre: "Crime, Drama", director: "Francis Ford Coppola", poster: "/placeholder.svg?height=450&width=300", rating: 9.2 },
//   { id: 3, watched: true, title: "Pulp Fiction", year: 1994, genre: "Crime, Drama", director: "Quentin Tarantino", poster: "/placeholder.svg?height=450&width=300", rating: 8.9 },
// ]

export default function BookGrid() {


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

              const [currentPage, setCurrentPage] = useState(1)
        const booksPerPage = 8
        const totalPages = Math.ceil(books.length / booksPerPage)

        const indexOfLastBook = currentPage * booksPerPage
        const indexOfFirstBook = indexOfLastBook - booksPerPage
        const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook)
    


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
         {loading && <p>Loading books...</p>}

      <div className={styles.gridContainer}>
        {currentBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>


      <div className={styles.pagination}>
        <button className={styles.button} onClick={handlePrevPage} disabled={currentPage === 1}>
          <span className={styles.icon}>⟨</span>
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button className={styles.button} onClick={handleNextPage} disabled={currentPage === totalPages}>
          <span className={styles.icon}>⟩</span>
        </button>
      </div>
    </div>
  )
}
