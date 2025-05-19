import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getStoredFilms } from '../utils/storage';
import { FilmCard } from './FilmCard';
import styles from './componentstyles.module.css';

export default function AllFilms() {
    const [films, setFilms] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);
    const observer = useRef();

    useEffect(() => {
        setFilms(getStoredFilms());
    }, []);

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
