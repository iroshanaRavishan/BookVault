import React, { useState } from "react";
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
        <div className={`${styles.overlayText} ${isHovered ? styles.show : ""}`}></div>
      </div>
      <div className={styles.cardContent}>
         <div className={styles.infoRow}>
            <span className={styles.badge}>{book.genre.split(",")[0]}</span>
          </div>
        <div className={styles.cardHeader}>
          <h4 className={styles.bookName}>{book.name}</h4>
        </div>
        <p className={styles.bookText}>
          Watched:{' '} <strong style={{ color: book.watched == true ? 'green' : 'red' }}>
            {book.watched==true ? 'Yes' : 'No'}
          </strong>
        </p>
        
        <p className={styles.bookText}>
          Rating: <strong>{book.rating}</strong>
        </p>

        <div className={styles.cardFooter}>
          <button className={styles.button}>View Details</button>
        </div>
      </div>
    </div>
  );
}
