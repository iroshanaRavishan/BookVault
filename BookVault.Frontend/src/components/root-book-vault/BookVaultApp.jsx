import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import styles from './bookvaultapp.module.css';

import LandingPage from '../landing-page/LandingPage'
import CreateBook from '../create-books/CreateBook';
import NavBar from '../nav-bar/NavBar';
import AllBooks from '../all-books/AllBooks';
import EditBooks from '../edit-books/EditBooks';
import Footer from '../footer-section/Footer';
import Auth from '../auth/Auth';

export default function BookVaultApp() {
  return (
    <Router>
      <div className={styles.appContainer}>
        <NavBar />
        <div className={styles.content}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/" element={<AllBooks />} />
            <Route path="/create" element={<CreateBook />} />
            <Route path="/edit/:id" element={<EditBooks />} />
            <Route path="/search" element={<AllBooks />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  )
}
