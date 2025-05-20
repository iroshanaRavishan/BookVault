import React, { useCallback, useEffect, useRef, useState } from "react"
import styles from "./filmgrid.module.css"
import FilmCard from "../film-card/FilmCard"

// const mockFilms = [
//   { id: 1, watched: true, title: "The Shawshank Redemption", year: 1994, genre: "Drama", director: "Frank Darabont", poster: "/placeholder.svg?height=450&width=300", rating: 9.3 },
//   { id: 2, watched: false, title: "The Godfather", year: 1972, genre: "Crime, Drama", director: "Francis Ford Coppola", poster: "/placeholder.svg?height=450&width=300", rating: 9.2 },
//   { id: 3, watched: true, title: "Pulp Fiction", year: 1994, genre: "Crime, Drama", director: "Quentin Tarantino", poster: "/placeholder.svg?height=450&width=300", rating: 8.9 },
// ]

export default function FilmGrid() {


      const [films, setFilms] = useState([]);
      const [visibleCount, setVisibleCount] = useState(10);
      const [loading, setLoading] = useState(true);
      const observer = useRef();

    
      useEffect(() => {
        fetchFilmsFromBackend();
      }, []);
    
      const fetchFilmsFromBackend = async () => {
        try {
          const res = await fetch('https://localhost:7157/api/Films');
          const data = await res.json();
          setFilms(data);
        } catch (error) {
          console.error('Error fetching films:', error);
        } finally {
          setLoading(false);
        }
      };
    
        const lastFilmRef = useCallback(
        (node) => {
          if (observer.current) observer.current.disconnect();
    
          observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && visibleCount < films.length) {
              setVisibleCount((prev) => prev + 10);
            }
          });
    
          if (node) observer.current.observe(node);
        },
        [visibleCount, films.length]
      );

              const [currentPage, setCurrentPage] = useState(1)
        const filmsPerPage = 8
        const totalPages = Math.ceil(films.length / filmsPerPage)

        const indexOfLastFilm = currentPage * filmsPerPage
        const indexOfFirstFilm = indexOfLastFilm - filmsPerPage
        const currentFilms = films.slice(indexOfFirstFilm, indexOfLastFilm)
    


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
         {loading && <p>Loading films...</p>}

      <div className={styles.gridContainer}>
        {currentFilms.map((film) => (
          <FilmCard key={film.id} film={film} />
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
