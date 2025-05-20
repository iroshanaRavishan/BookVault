import React, { useCallback, useEffect, useRef, useState } from "react"
import styles from "./filmgrid.module.css";
import FilmCard from "../film-card/FilmCard";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";

export default function FilmGrid() {
  const [films, setFilms] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const observer = useRef();

  const [currentPage, setCurrentPage] = useState(1)
  const filmsPerPage = 8
  const totalPages = Math.ceil(films.length / filmsPerPage)

  const indexOfLastFilm = currentPage * filmsPerPage
  const indexOfFirstFilm = indexOfLastFilm - filmsPerPage
  const currentFilms = films.slice(indexOfFirstFilm, indexOfLastFilm)

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
          <span>Loading films...</span>
        </div>
      )}
      
      {films && films.length === 0 && !loading && (
        <div className={styles.noFilms}>
          <img src="../src/assets/disconnected.png" className={styles.disconnectedImage} alt="disconnected-image" />
          <span>No films found</span>
          <p>Please add some films to your collection.</p>
        </div>
      )}

      <div className={styles.gridContainer}>
        {currentFilms.map((film) => (
          <FilmCard key={film.id} film={film} />
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
