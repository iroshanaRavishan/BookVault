import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import styles from './componentstyles.module.css';

import LandingPage from './LandingPage'
import CreateBook from './CreateBook';
import EditBooks from './EditBooks';
import NavBar from './NavBar';

export default function BookVaultApp() {
  return (
    <Router>
      <div className={styles.appContainer}>
        <NavBar />
        <div className={styles.content}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/create" element={<CreateBook />} />
            <Route path="/edit" element={<EditBooks />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}
