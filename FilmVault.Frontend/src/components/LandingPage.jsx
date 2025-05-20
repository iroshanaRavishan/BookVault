import React from 'react';
import styles from './componentstyles.module.css';
import AllFilms from './AllFilms';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { FaAnglesDown } from "react-icons/fa6";

export default function LandingPage() {

  const [text] = useTypewriter({
    words: ['manage your personal film collection.', 'Add films,', 'Organize the colletion,', 'Search films', 'and keep track of the movies you have watched.'],
    loop: {},
  });

  return (
    <div className={styles.landingPage}>
      <div className={styles.landingContainer}>
        <h1 className={ styles.title} style={{ animation: 'fadeInDown 1s ease forwards' }}>
          Welcome to FilmVault
        </h1>
        <p className={`${styles.subtitle} ${styles.dancingFont}`} style={{ animation: 'fadeInUp 1s ease forwards' }}>
          Your personal film collection manager.
        </p>
        <div className={`${styles.LandingPageIntroText} ${styles.landingIntro}`}>
          <span>FilmVault helps you effortlessly<br />
            <span className={styles.typeText}>
              {text} <span><Cursor cursorStyle='|'/></span>
            </span><br /> 
            — all in one beautifully simple interface.
          </span>
          <div
            className={styles.bouncingArrow}
            onClick={() => {
              document.getElementById('all-films-section')?.scrollIntoView({ behavior: 'smooth' });
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
      <div id="all-films-section">
        <AllFilms />
      </div>
    </div>
  );
}
