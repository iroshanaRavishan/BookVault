import React, { forwardRef } from 'react';
import styles from './componentstyles.module.css';

export const FilmCard = forwardRef(({ film }, ref) => {
  return (
    <div className={styles.filmCard} ref={ref}>
      {film.image ? (
        <img src={film.image} alt={film.name} className={styles.filmImage} />
      ) : (
        <div className={styles.placeholderImage}>No Image</div>
      )}
      <h4 className={styles.filmName}>{film.name}</h4>
      <p className={styles.filmText}>
        Rating: <strong>{film.rating}</strong>
      </p>
      <p className={styles.filmText}>
        Watched: <strong style={{ color: film.watched ? 'green' : 'red' }}>
          {film.watched ? 'Yes' : 'No'}
        </strong>
      </p>
      <p className={styles.filmText}>ID: {film.id}</p>
    </div>
  );
});
