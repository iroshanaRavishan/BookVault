import React, { forwardRef } from 'react';
import styles from './componentstyles.module.css';

export const BookCard = forwardRef(({ book }, ref) => {
  return (
    <div className={styles.bookCard} ref={ref}>
      {book.image ? (
        <img src={book.image} alt={book.name} className={styles.bookImage} />
      ) : (
        <div className={styles.placeholderImage}>No Image</div>
      )}
      <h4 className={styles.bookName}>{book.name}</h4>
      <p className={styles.bookText}>
        Rating: <strong>{book.rating}</strong>
      </p>
      <p className={styles.bookText}>
        Watched: <strong style={{ color: book.watched ? 'green' : 'red' }}>
          {book.watched ? 'Yes' : 'No'}
        </strong>
      </p>
      <p className={styles.bookText}>ID: {book.id}</p>
    </div>
  );
});
