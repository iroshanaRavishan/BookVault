import React, { useState } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import styles from "./searchfilter.module.css"; // Fixed typo in import

export default function SearchFilters() {
  const [yearRange, setYearRange] = useState([1950, 2025]);
  const [ratingRange, setRatingRange] = useState([0, 10]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const handleYearChange = (index, value) => {
    const updated = [...yearRange];
    updated[index] = Number(value);
    setYearRange(updated);
  };

  const handleRatingChange = (index, value) => {
    const updated = [...ratingRange];
    updated[index] = Number(value);
    setRatingRange(updated);
  };

  return (
    <div className={styles.searchFilters}>
      <div className={styles.searchInputWrapper}>
        <FaSearch className={styles.icon} />
        <input type="text" placeholder="Search films..." className={styles.searchInput} />
      </div>

      <div className={styles.filters}>
        <select className={styles.dropdown}>
          <option value="">Genre</option>
          <option value="all">All Genres</option>
          <option value="action">Action</option>
          <option value="comedy">Comedy</option>
          <option value="drama">Drama</option>
          <option value="horror">Horror</option>
          <option value="sci-fi">Sci-Fi</option>
          <option value="thriller">Thriller</option>
        </select>

        <select className={styles.dropdown}>
          <option value="">Sort by</option>
          <option value="title-asc">Title (A-Z)</option>
          <option value="title-desc">Title (Z-A)</option>
          <option value="year-desc">Year (Newest)</option>
          <option value="year-asc">Year (Oldest)</option>
          <option value="rating-desc">Rating (Highest)</option>
          <option value="rating-asc">Rating (Lowest)</option>
        </select>

        <button className={styles.filterBtn} onClick={() => setShowFilterPanel(!showFilterPanel)}>
          <FaFilter />
        </button>
      </div>

      {showFilterPanel && (
        <div className={styles.filterPanel}>
          <h3>Filter Films</h3>
          <p>Refine your film collection with advanced filters.</p>

          <div className={styles.filterSection}>
            <label>Year Range</label>
            <div className={styles.rangeSliders}>
              <input
                type="range"
                min="1900"
                max="2025"
                step="1"
                value={yearRange[0]}
                onChange={(e) => handleYearChange(0, e.target.value)}
              />
              <input
                type="range"
                min="1900"
                max="2025"
                step="1"
                value={yearRange[1]}
                onChange={(e) => handleYearChange(1, e.target.value)}
              />
            </div>
            <div className={styles.rangeValues}>
              <span>{yearRange[0]}</span>
              <span>{yearRange[1]}</span>
            </div>
          </div>

          <div className={styles.filterSection}>
            <label>Rating</label>
            <div className={styles.rangeSliders}>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={ratingRange[0]}
                onChange={(e) => handleRatingChange(0, e.target.value)}
              />
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={ratingRange[1]}
                onChange={(e) => handleRatingChange(1, e.target.value)}
              />
            </div>
            <div className={styles.rangeValues}>
              <span>{ratingRange[0].toFixed(1)}</span>
              <span>{ratingRange[1].toFixed(1)}</span>
            </div>
          </div>

          <div className={styles.filterSection}>
            <label>Director</label>
            <input type="text" placeholder="Search directors..." className={styles.directorInput} />
          </div>

          <button className={styles.applyBtn} onClick={() => setShowFilterPanel(false)}>
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}
