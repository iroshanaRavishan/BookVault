import React, { useState, useEffect } from 'react';
import styles from './componentstyles.module.css';
import { getStoredBooks } from '../utils/storage';
import { saveBooks } from '../utils/saveBooks';

export default function DeleteBooks() {
    const [books, setBooks] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setBooks(getStoredBooks());
    }, []);

    const deleteBook = (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
        const updatedBooks = books.filter((book) => book.id !== id);
        setBooks(updatedBooks);
        saveBooks(updatedBooks);
        setMessage('Book deleted successfully!');
        setTimeout(() => setMessage(''), 1500);
        }
    };

      return (
        <div className={styles.pageContainer}>
        <h2 className={styles.pageTitle}>Delete Books</h2>
        {books.length === 0 ? (
            <p className={{ fontStyle: 'italic' }}>No books available to delete.</p>
        ) : (
            <div className={styles.bookList}>
            {books.map((book) => (
                <div key={book.id} className={styles.bookCard}>
                {book.image ? (
                    <img src={book.image} alt={book.name} className={styles.bookImage} />
                ) : (
                    <div className={styles.placeholderImage}>No Image</div>
                )}
                <h3>{book.name}</h3>
                <p>
                    Rating: <strong>{book.rating}</strong>
                </p>
                <p>
                    Read:{' '}
                    <strong className={{ color: book.read ? 'green' : 'red' }}>
                    {book.read ? 'Yes' : 'No'}
                    </strong>
                </p>
                <button
                    onClick={() => deleteBook(book.id)}
                    className={{ ...styles.button}}
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


