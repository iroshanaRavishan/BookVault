import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import styles from './filmvaultapp.module.css';

import LandingPage from '../landing-page/LandingPage'
import CreateFilm from '../create-films/CreateFilm';
import DeleteFilms from '../delete-films/DeleteFilms';
import NavBar from '../nav-bar/NavBar';
import AllFilms from '../all-films/AllFilms';
import EditFilms from '../edit-films/EditFilms';
import Footer from '../footer-section/Footer';

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
            <Route path="/search" element={<AllFilms />} />
            <Route path="/delete" element={<DeleteFilms />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  )
}
