import React, { useState, useEffect } from 'react';
import styles from './componentstyles.module.css';
import { getStoredBooks } from '../utils/storage';
import { saveBooks } from '../utils/saveBooks';

export default function EditBooks() {

    const [books, setBooks] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editRating, setEditRating] = useState('');
    const [editImage, setEditImage] = useState('');
    const [editRead, setEditRead] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setBooks(getStoredBooks());
    }, []);

    const startEditing = (book) => {
        setEditingId(book.id);
        setEditName(book.name);
        setEditRating(book.rating);
        setEditImage(book.image);
        setEditRead(book.read);
        setMessage('');
    };

    const cancelEditing = () => {
        setEditingId(null);
        setMessage('');
    };

    const saveEdit = (id) => {
        if (!editName.trim()) {
        setMessage('Please enter a book name.');
        return;
        }
        if (!editRating || isNaN(editRating) || editRating < 0 || editRating > 10) {
        setMessage('Please enter a valid rating between 0 and 10.');
        return;
        }
        const updatedBooks = books.map((f) =>
        f.id === id
            ? {
                ...f,
                name: editName.trim(),
                rating: parseFloat(editRating),
                image: editImage.trim(),
                read: editRead,
            }
            : f
        );
        setBooks(updatedBooks);
        saveBooks(updatedBooks);
        setEditingId(null);
        setMessage('Book updated successfully!');
        setTimeout(() => setMessage(''), 1500);
    };

return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>Edit Books</h2>
      {books.length === 0 ? (
        <p style={{ fontStyle: 'italic' }}>No books available to edit.</p>
      ) : (
        <div className={styles.bookList}>
          {books.map((book) =>
            editingId === book.id ? (
              <div key={book.id} className={styles.bookCardEditing}>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={ styles.input }
                  style={{ marginBottom: '8px' }}
                />
                <input
                  type="number"
                  value={editRating}
                  onChange={(e) => setEditRating(e.target.value)}
                  min="0"
                  max="10"
                  step="0.1"
                  className={ styles.input }
                  style={{ marginBottom: '8px' }}
                />
                <input
                  type="url"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className={ styles.input }
                  style={{ marginBottom: '8px' }}
                />
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={editRead}
                    onChange={() => setEditRead(!editRead)}
                    style={{ marginRight: '8px' }}
                  />
                  Read
                </label>
                <div>
                  <button
                    onClick={() => saveEdit(book.id)}
                    className={ styles.button }
                    style={{ marginBottom: '8px' }}
                  >
                    Save
                  </button>
                  <button onClick={cancelEditing} className={styles.buttonCancel}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
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
                  <strong style={{ color: book.read ? 'green' : 'red' }}>
                    {book.read ? 'Yes' : 'No'}
                  </strong>
                </p>
                <button
                  onClick={() => startEditing(book)}
                  className={styles.button}
                >
                  Edit
                </button>
              </div>
            )
          )}
        </div>
      )}
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
