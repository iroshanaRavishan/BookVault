import React from 'react';
import styles from './allfilms.module.css';
import FilmGrid from '../film-grid/FilmGrid';
import SearchFilters from '../search-filter/SearchFilters';

export default function AllFilms() {

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>All Films</h2>
      <div className={styles.pageContent}>
        <SearchFilters />
        <FilmGrid />
      </div>
    </div>
  );
}
