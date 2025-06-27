import React, { useState, useRef, useEffect } from "react";
import styles from "./genreselector.module.css";
import { GENRES } from '../../constants/constants';

export default function GenreSelector ({ selectedGenre, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGenreClick = (genre) => {
    onSelect(genre);
    setIsOpen(false);
  };

  return (
    <div className={styles.wrapper}>
        <button
            className={styles.button}
            onClick={() => setIsOpen((prev) => !prev)}
        >
            {selectedGenre || "Select Genre"}
        </button>

        {isOpen && (
            <div className={styles.modal} ref={modalRef}>
                <div className={styles.optionsGrid}>
                {GENRES.map((genre) => (
                    <div
                    key={genre}
                    className={`${styles.option} ${
                        genre === selectedGenre ? styles.selected : ""
                    }`}
                    onClick={() => handleGenreClick(genre)}
                    >
                    {genre}
                    </div>
                ))}
                </div>
            </div>
        )}
    </div>
  );
};
