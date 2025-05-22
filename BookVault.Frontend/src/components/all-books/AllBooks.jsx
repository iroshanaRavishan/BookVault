import React from 'react';
import styles from './allbooks.module.css';
import BookGrid from '../book-grid/BookGrid';
import SearchFilters from '../search-filter/SearchFilters';

export default function AllBooks() {

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>All Books</h2>
      <div className={styles.pageContent}>
        <SearchFilters />
        <BookGrid />
      </div>
    </div>
  );
}
