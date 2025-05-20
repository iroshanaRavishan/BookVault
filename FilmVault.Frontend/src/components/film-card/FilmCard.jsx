import React, { useState } from "react";
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
        <div className={`${styles.overlayText} ${isHovered ? styles.show : ""}`}></div>
      </div>
      <div className={styles.cardContent}>
         <div className={styles.infoRow}>
            <span className={styles.badge}>{film.genre.split(",")[0]}</span>
          </div>
        <div className={styles.cardHeader}>
          <h4 className={styles.filmName}>{film.name}</h4>
        </div>
        <p className={styles.filmText}>
          Watched:{' '} <strong style={{ color: film.watched == true ? 'green' : 'red' }}>
            {film.watched==true ? 'Yes' : 'No'}
          </strong>
        </p>
        
        <p className={styles.filmText}>
          Rating: <strong>{film.rating}</strong>
        </p>

        <div className={styles.cardFooter}>
          <button className={styles.button}>View Details</button>
        </div>
      </div>
    </div>
  );
}
