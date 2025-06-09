import React, { useState, useEffect, useRef } from 'react';
import styles from './filtermodal.module.css';

export default function FilterModal({ isOpen, onClose, onApplyFilters }) {
  const [yearRange, setYearRange] = useState(2015);
  const [rating, setRating] = useState(2.5);
  const [director, setDirector] = useState('');
  const modalRef = useRef(null);

  // Calculate percentage for slider fill
  const getYearPercentage = () => {
    return ((yearRange - 2025) / (2005 - 2025)) * 100;
  };

  const getRatingPercentage = () => {
    return ((rating - 5) / (0 - 5)) * 100;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleYearChange(e) {
    setYearRange(parseInt(e.target.value, 10));
  };

  function handleRatingChange(e) {
    setRating(parseFloat(e.target.value));
  };

  function handleDirectorChange(e) {
    setDirector(e.target.value);
  };

  function handleApply() {
    onApplyFilters({
      yearRange,
      rating,
      director
    });
    onClose();
  }

    // Dynamic styles for slider tracks
  const yearSliderStyle = {
    background: `linear-gradient(to left, #000 0%, #000 ${getYearPercentage()}%, #e0e0e0 ${getYearPercentage()}%, #e0e0e0 100%)`
  };

  const ratingSliderStyle = {
    background: `linear-gradient(to left, #000 0%, #000 ${getRatingPercentage()}%, #e0e0e0 ${getRatingPercentage()}%, #e0e0e0 100%)`
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer} ref={modalRef}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Filter Books</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalContent}>
          <p className={styles.modalSubtitle}>
            Refine your book collection with advanced filters.
          </p>

          <div className={styles.filterSection}>
            <label className={styles.filterLabel}>Year Range</label>
            <input
              type="range"
              min="2005"
              max="2025"
              value={yearRange}
              onChange={handleYearChange}
              className={styles.rangeSlider}
              style={yearSliderStyle}
            />
            <div className={styles.rangeValues}>
              <span>{yearRange}</span>
              <span>2025</span>
            </div>
          </div>

          <div className={styles.filterSection}>
            <label className={styles.filterLabel}>Rating</label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={rating}
              onChange={handleRatingChange}
              className={styles.rangeSlider}
               style={ratingSliderStyle}
            />
            <div className={styles.rangeValues}>
              <span>{parseFloat(rating).toFixed(1)}</span>
              <span>5.0</span>
            </div>
          </div>

          <div className={styles.filterSection}>
            <label className={styles.filterLabel}>Director</label>
            <input
              type="text"
              placeholder="Search directors..."
              value={director}
              onChange={handleDirectorChange}
              className={styles.textInput}
            />
          </div>

          <button className={styles.applyButton} onClick={handleApply}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
