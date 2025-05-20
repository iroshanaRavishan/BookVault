import React, { useState } from "react";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import styles from "./searchfilter.module.css"; // Fixed typo in import
import FilterModal from "../filter-modal/FilterModal";

export default function SearchFilters() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    yearRange: 2025,
    rating: 2.6,
    director: ''
  });

  function handleClear() {
    setSearchText('');
  };

  function openFilterModal() {
    setIsFilterModalOpen(true);
  };

  function closeFilterModal() {
    setIsFilterModalOpen(false);
  };

  function handleApplyFilters(newFilters){
    setFilters(newFilters);
    console.log('Applied filters:', newFilters);
    // Here you would typically filter your book data based on these filters
  };

  return (
    <div className={styles.searchFilters}>
      <div className={styles.searchInputWrapper}>
        <FaSearch className={styles.icon} />
        <input   type="text"
          placeholder="Search books..."
          className={styles.searchInput}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)} />

        {searchText && (
          <FaTimes className={styles.clearIcon} onClick={handleClear} />
        )}
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

        <button className={styles.filterBtn} onClick={openFilterModal}   > 
          <FaFilter />
        </button>
      </div>

      <FilterModal 
        isOpen={isFilterModalOpen}
        onClose={closeFilterModal}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
}
