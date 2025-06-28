import React, { useState } from "react";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import styles from "./searchfilters.module.css";
import FilterModal from "../filter-modal/FilterModal";
import FilterPopupSelect from "../genre-selector/FilterPopupSelect";
import { GENRE_OPTIONS, SORT_OPTIONS } from '../../constants/constants';

export default function SearchFilters() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sortValue, setSortValue] = useState("");
  const [genreValue, setGenreValue] = useState("");
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
        <FilterPopupSelect
          options={GENRE_OPTIONS}
          selectedValue={genreValue}
          onSelect={setGenreValue}
          placeholder="Select Genre"
          twoColumns={true}
        />

        <FilterPopupSelect
          options={SORT_OPTIONS}
          selectedValue={sortValue}
          onSelect={setSortValue}
          placeholder="Sort by"
        />

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
