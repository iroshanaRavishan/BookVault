import React, { useState, useEffect } from 'react';
import styles from './componentstyles.module.css';
import { getStoredFilms } from '../utils/storage';
import { saveFilms } from '../utils/saveFilms';

export default function EditFilms() {

    const [films, setFilms] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editRating, setEditRating] = useState('');
    const [editImage, setEditImage] = useState('');
    const [editWatched, setEditWatched] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setFilms(getStoredFilms());
    }, []);

    const startEditing = (film) => {
        setEditingId(film.id);
        setEditName(film.name);
        setEditRating(film.rating);
        setEditImage(film.image);
        setEditWatched(film.watched);
        setMessage('');
    };

    const cancelEditing = () => {
        setEditingId(null);
        setMessage('');
    };

    const saveEdit = (id) => {
        if (!editName.trim()) {
        setMessage('Please enter a film name.');
        return;
        }
        if (!editRating || isNaN(editRating) || editRating < 0 || editRating > 10) {
        setMessage('Please enter a valid rating between 0 and 10.');
        return;
        }
        const updatedFilms = films.map((f) =>
        f.id === id
            ? {
                ...f,
                name: editName.trim(),
                rating: parseFloat(editRating),
                image: editImage.trim(),
                watched: editWatched,
            }
            : f
        );
        setFilms(updatedFilms);
        saveFilms(updatedFilms);
        setEditingId(null);
        setMessage('Film updated successfully!');
        setTimeout(() => setMessage(''), 1500);
    };

return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>Edit Films</h2>
      {films.length === 0 ? (
        <p className={{ fontStyle: 'italic' }}>No films available to edit.</p>
      ) : (
        <div className={styles.filmList}>
          {films.map((film) =>
            editingId === film.id ? (
              <div key={film.id} className={styles.filmCardEditing}>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={{ ...styles.input }}
                  style={{ marginBottom: '8px' }}
                />
                <input
                  type="number"
                  value={editRating}
                  onChange={(e) => setEditRating(e.target.value)}
                  min="0"
                  max="10"
                  step="0.1"
                  className={{ ...styles.input }}
                  style={{ marginBottom: '8px' }}
                />
                <input
                  type="url"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className={{ ...styles.input }}
                  style={{ marginBottom: '8px' }}
                />
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={editWatched}
                    onChange={() => setEditWatched(!editWatched)}
                    className={{ marginRight: '8px' }}
                  />
                  Watched
                </label>
                <div>
                  <button
                    onClick={() => saveEdit(film.id)}
                    className={{ ...styles.button }}
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
                  onClick={() => startEditing(film)}
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
