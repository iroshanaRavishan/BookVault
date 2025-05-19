import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import styles from './componentstyles.module.css';

import LandingPage from './LandingPage'
import CreateFilm from './CreateFilm';

import NavBar from './NavBar';

export default function FilmVaultApp() {
  return (
    <Router>
      <div className={styles.appContainer}>
        <NavBar />
        <div className={styles.content}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/create" element={<CreateFilm />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}
