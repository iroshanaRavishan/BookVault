import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import styles from './componentstyles.module.css';

import LandingPage from './LandingPage'
import CreateFilm from './CreateFilm';
import EditFilms from './EditFilms';
import GetFilm from './GetFilm';
import DeleteFilms from './DeleteFilms';
import NavBar from './NavBar';
import AllFilms from './AllFilms';

export default function FilmVaultApp() {
  return (
    <Router>
      <div className={styles.appContainer}>
        <NavBar />
        <div className={styles.content}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/" element={<AllFilms />} />
            <Route path="/create" element={<CreateFilm />} />
            <Route path="/edit" element={<EditFilms />} />
            <Route path="/search" element={<GetFilm />} />
            <Route path="/delete" element={<DeleteFilms />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}
