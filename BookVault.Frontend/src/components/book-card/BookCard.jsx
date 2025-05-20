import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import styles from "./Bookcard.module.css"; // Import your CSS module


export default function BookCard({ book }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.imageWrapper}>
        {book.imageUrl ? (
          <img src={book.imageUrl} alt={book.name} className={styles.bookImage} />
        ) : (
          <div className={styles.placeholderImage}>No Image</div>
        )}

        <div className={styles.gradientOverlay}></div>
        <div className={`${styles.overlayText} ${isHovered ? styles.show : ""}`}>
          <p className={styles.director}>{book.director}</p>
          <div className={styles.rating}>
            <FaStar className={styles.starIcon} />
            <span>{book.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.title}>{book.title}</h3>
        <div className={styles.infoRow}>
          <span className={styles.year}>{book.year}</span>
          <span className={styles.badge}>{book.genre.split(",")[0]}</span>
        </div>
      </div>
      <p className={styles.bookText}>
        Read:{' '} <strong style={{ color: book.read == true ? 'green' : 'red' }}>
          {book.read==true ? 'Yes' : 'No'}
        </strong>
      </p>
      <h4 className={styles.bookName}>{book.name}</h4>
      <p className={styles.bookText}>
        Rating: <strong>{book.rating}</strong>
      </p>

      <div className={styles.cardFooter}>
        <button className={styles.button}>View Details</button>
      </div>
    </div>
  );
}
