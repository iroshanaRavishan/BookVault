import React from 'react';
import styles from './landingpage.module.css';

import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { FaAnglesDown } from "react-icons/fa6";
import SearchFilters from '../search-filter/SearchFilters';
import BookCard from '../book-card/BookCard';
import BookGrid from '../book-grid/BookGrid';
import AllBooks from '../all-books/AllBooks';

export default function LandingPage() {

  const [text] = useTypewriter({
    words: ['manage your personal book collection.', 'Add books,', 'Organize the colletion,', 'Search books', 'and keep track of the movies you have watched.'],
    loop: {},
  });

  const mockBooks = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    year: 1994,
    genre: "Drama",
    director: "Frank Darabont",
    poster: "/placeholder.svg?height=450&width=300",
    rating: 9.3,
  },
  {
    id: 2,
    title: "The Godfather",
    year: 1972,
    genre: "Crime, Drama",
    director: "Francis Ford Coppola",
    poster: "/placeholder.svg?height=450&width=300",
    rating: 9.2,
  },
  {
    id: 3,
    title: "Pulp Fiction",
    year: 1994,
    genre: "Crime, Drama",
    director: "Quentin Tarantino",
    poster: "/placeholder.svg?height=450&width=300",
    rating: 8.9,
  },
]

  return (
    <div className={styles.landingPage}>
      <div className={styles.landingContainer}>
        <h1 className={ styles.title} style={{ animation: 'fadeInDown 1s ease forwards' }}>
          Welcome to BookVault
        </h1>
        <p className={`${styles.subtitle} ${styles.dancingFont}`} style={{ animation: 'fadeInUp 1s ease forwards' }}>
          Your personal book collection manager.
        </p>
        <div className={`${styles.LandingPageIntroText} ${styles.landingIntro}`}>
          <span>BookVault helps you effortlessly<br />
            <span className={styles.typeText}>
              {text} <span><Cursor cursorStyle='|'/></span>
            </span><br /> 
            — all in one beautifully simple interface.
          </span>
          <div
            className={styles.bouncingArrow}
            onClick={() => {
              document.getElementById('all-books-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <FaAnglesDown size={40} color='#ffffff86' />
          </div>
        </div>
        <style>
          {`
            @keyframes fadeInDown {
              0% { opacity: 0; transform: translateY(-50px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeInUp {
              0% { opacity: 0; transform: translateY(50px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            @keyframes rotate {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
      <div id="all-books-section">
        <AllBooks />
      </div>
    </div>
  );
}
