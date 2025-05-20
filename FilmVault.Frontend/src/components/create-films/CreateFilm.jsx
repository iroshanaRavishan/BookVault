import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './createfilms.module.css';
import { getStoredFilms } from '../../utils/storage';
import { saveFilms } from '../../utils/saveFilms';

export default function CreateFilm() {
    const [name, setName] = useState('');
    const [rating, setRating] = useState('');
    const [image, setImage] = useState('');
    const [watched, setWatched] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleAddFilm = (e) => {
        e.preventDefault();
        if (!name.trim()) {
        setMessage('Please enter a film name.');
        return;
        }
        if (!rating || isNaN(rating) || rating < 0 || rating > 10) {
        setMessage('Please enter a valid rating between 0 and 10.');
        return;
        }
        // Create film object with unique id
        const films = getStoredFilms();
        const newFilm = {
        id: Date.now().toString(),
        name: name.trim(),
        rating: parseFloat(rating),
        image: image.trim(),
        watched,
        };
        films.push(newFilm);
        saveFilms(films);
        setMessage('Film added successfully!');
        // Reset form
        setName('');
        setRating('');
        setImage('');
        setWatched(false);
        // Optionally navigate to edit or home page after a while
        setTimeout(() => {
        setMessage('');
        navigate('/edit');
        }, 1500);
    };

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>Add a New Film</h2>
      <form onSubmit={handleAddFilm} className={styles.form}>
        <label className={styles.label}>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            placeholder="Film Name"
            required
          />
        </label>
        <label className={styles.label}>
          Rating (0-10):
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className={styles.input}
            placeholder="e.g. 8.5"
            min="0"
            max="10"
            step="0.1"
            required
          />
        </label>
        <label className={styles.label}>
          Image URL:
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className={styles.input}
            placeholder="http://example.com/image.jpg"
          />
        </label>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={watched}
            onChange={() => setWatched(!watched)}
            className={{ marginRight: '8px' }}
          />
          Watched
        </label>
        <button type="submit" className={styles.button}>Add Film</button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
