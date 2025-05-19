import React, { useState, useEffect } from 'react';
import styles from './componentstyles.module.css';
import { getStoredFilms } from '../utils/storage';


export default function GetFilm() {
    const [films, setFilms] = useState([]);
    const [query, setQuery] = useState('');
    const [foundFilm, setFoundFilm] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setFilms(getStoredFilms());
    }, []);

    const searchFilm = (e) => {
        e.preventDefault();
        if (!query.trim()) {
        setMessage('Please enter a film name or ID to search.');
        setFoundFilm(null);
        return;
        }
        const qLower = query.trim().toLowerCase();
        const result =
        films.find((f) => f.id === qLower) ||
        films.find((f) => f.name.toLowerCase() === qLower);

        if (result) {
        setFoundFilm(result);
        setMessage('');
        } else {
        setFoundFilm(null);
        setMessage('No film found with that name or ID.');
        }
    };
  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>Search Film by Name or ID</h2>
      <form onSubmit={searchFilm} className={styles.form}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter film name or ID"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Search
        </button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
      {foundFilm && (
        <div className={styles.filmCardDetail}>
          {foundFilm.image ? (
            <img
              src={foundFilm.image}
              alt={foundFilm.name}
              className={styles.filmImageLarge}
            />
          ) : (
            <div className={styles.placeholderImageLarge}>No Image</div>
          )}
          <h3>{foundFilm.name}</h3>
          <p>
            Rating: <strong>{foundFilm.rating}</strong>
          </p>
          <p>
            Watched:{' '}
            <strong className={{ color: foundFilm.watched ? 'green' : 'red' }}>
              {foundFilm.watched ? 'Yes' : 'No'}
            </strong>
          </p>
          <p>ID: {foundFilm.id}</p>
        </div>
      )}
    </div>
  );
}
