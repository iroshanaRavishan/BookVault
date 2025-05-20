import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FilmCard } from './FilmCard';
import styles from './componentstyles.module.css';

export default function AllFilms() {
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

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>All Films</h2>

      {loading && <p>Loading films...</p>}

      <div className={styles.filmGrid}>
        {films.slice(0, visibleCount).map((film, index) => {
          if (index === visibleCount - 1) {
            return <FilmCard key={film.id} film={film} ref={lastFilmRef} />;
          }
          return <FilmCard key={film.id} film={film} />;
        })}
      </div>
    </div>
  );
}
