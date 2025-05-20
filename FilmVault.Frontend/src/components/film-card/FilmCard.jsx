import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import styles from "./Filmcard.module.css"; // Import your CSS module


export default function FilmCard({ film }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.imageWrapper}>
        {film.imageUrl ? (
          <img src={film.imageUrl} alt={film.name} className={styles.filmImage} />
        ) : (
          <div className={styles.placeholderImage}>No Image</div>
        )}

        <div className={styles.gradientOverlay}></div>
        <div className={`${styles.overlayText} ${isHovered ? styles.show : ""}`}>
          <p className={styles.director}>{film.director}</p>
          <div className={styles.rating}>
            <FaStar className={styles.starIcon} />
            <span>{film.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.title}>{film.title}</h3>
        <div className={styles.infoRow}>
          <span className={styles.year}>{film.year}</span>
          <span className={styles.badge}>{film.genre.split(",")[0]}</span>
        </div>
      </div>
      <p className={styles.filmText}>
        Watched:{' '} <strong style={{ color: film.watched == true ? 'green' : 'red' }}>
          {film.watched==true ? 'Yes' : 'No'}
        </strong>
      </p>
      <h4 className={styles.filmName}>{film.name}</h4>
      <p className={styles.filmText}>
        Rating: <strong>{film.rating}</strong>
      </p>

      <div className={styles.cardFooter}>
        <button className={styles.button}>View Details</button>
      </div>
    </div>
  );
}
