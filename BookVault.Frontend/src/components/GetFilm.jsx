import React, { useState, useEffect } from 'react';
import styles from './componentstyles.module.css';
import { getStoredBooks } from '../utils/storage';


export default function GetBook() {
    const [books, setBooks] = useState([]);
    const [query, setQuery] = useState('');
    const [foundBook, setFoundBook] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setBooks(getStoredBooks());
    }, []);

    const searchBook = (e) => {
        e.preventDefault();
        if (!query.trim()) {
        setMessage('Please enter a book name or ID to search.');
        setFoundBook(null);
        return;
        }
        const qLower = query.trim().toLowerCase();
        const result =
        books.find((f) => f.id === qLower) ||
        books.find((f) => f.name.toLowerCase() === qLower);

        if (result) {
        setFoundBook(result);
        setMessage('');
        } else {
        setFoundBook(null);
        setMessage('No book found with that name or ID.');
        }
    };
  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>Search Book by Name or ID</h2>
      <form onSubmit={searchBook} className={styles.form}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter book name or ID"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Search
        </button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
      {foundBook && (
        <div className={styles.bookCardDetail}>
          {foundBook.image ? (
            <img
              src={foundBook.image}
              alt={foundBook.name}
              className={styles.bookImageLarge}
            />
          ) : (
            <div className={styles.placeholderImageLarge}>No Image</div>
          )}
          <h3>{foundBook.name}</h3>
          <p>
            Rating: <strong>{foundBook.rating}</strong>
          </p>
          <p>
            Watched:{' '}
            <strong className={{ color: foundBook.watched ? 'green' : 'red' }}>
              {foundBook.watched ? 'Yes' : 'No'}
            </strong>
          </p>
          <p>ID: {foundBook.id}</p>
        </div>
      )}
    </div>
  );
}
