import React, { useState, useEffect } from 'react';
import styles from './componentstyles.module.css';
import { getStoredFilms } from '../utils/storage';
import { saveFilms } from '../utils/saveFilms';

export default function DeleteFilms() {
    const [films, setFilms] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setFilms(getStoredFilms());
    }, []);

    const deleteFilm = (id) => {
        if (window.confirm('Are you sure you want to delete this film?')) {
        const updatedFilms = films.filter((film) => film.id !== id);
        setFilms(updatedFilms);
        saveFilms(updatedFilms);
        setMessage('Film deleted successfully!');
        setTimeout(() => setMessage(''), 1500);
        }
    };

      return (
        <div className={styles.pageContainer}>
        <h2 className={styles.pageTitle}>Delete Films</h2>
        {films.length === 0 ? (
            <p className={{ fontStyle: 'italic' }}>No films available to delete.</p>
        ) : (
            <div className={styles.filmList}>
            {films.map((film) => (
                <div key={film.id} className={styles.filmCard}>
                {film.image ? (
                    <img src={film.image} alt={film.name} className={styles.filmImage} />
                ) : (
                    <div className={styles.placeholderImage}>No Image</div>
                )}
                <h3>{film.name}</h3>
                <p>
                    Rating: <strong>{film.rating}</strong>
                </p>
                <p>
                    Watched:{' '}
                    <strong className={{ color: film.watched ? 'green' : 'red' }}>
                    {film.watched ? 'Yes' : 'No'}
                    </strong>
                </p>
                <button
                    onClick={() => deleteFilm(film.id)}
                    className={ styles.button}
                    style={{ backgroundColor: '#d9534f' }}
                >
                    Delete
                </button>
                </div>
            ))}
            </div>
        )}
        {message && <p className={styles.message}>{message}</p>}
        </div>
    );
}


