import React from 'react';
import styles from './landingpage.module.css';

import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { FaAnglesDown } from "react-icons/fa6";
import AllBooks from '../all-books/AllBooks';

export default function LandingPage() {

  const [text] = useTypewriter({
    words: ['manage your personal book collection.', 'Add books,', 'Organize the colletion,', 'Search books', 'and keep track of the books you have read.'],
    loop: {},
  });

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
