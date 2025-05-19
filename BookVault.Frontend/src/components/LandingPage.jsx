import React from 'react';
import styles from './componentstyles.module.css';

export default function LandingPage() {
  return (
    <div className={styles.landingContainer}>
      <h1 className={{...styles.title, animation: 'fadeInDown 1s ease forwards'}}>
        Welcome to BookVault
      </h1>
      <p className={{...styles.subtitle, animation: 'fadeInUp 1.5s ease forwards'}}>
        Your personal book collection manager.
      </p>
      <div className={styles.cinemaScreen}>
        <div className={styles.lightBeam}></div>
        <div className={{...styles.projector, animation: 'rotate 6s infinite linear'}}></div>
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
  );
}
