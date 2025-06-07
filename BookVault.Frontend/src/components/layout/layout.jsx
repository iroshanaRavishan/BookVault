import React from 'react';
import NavBar from '../nav-bar/NavBar';
import { Outlet } from 'react-router-dom';
import Footer from '../footer-section/Footer';
import styles from './layout.module.css';

export default function Layout() {
  return (
    <div className={styles.appContainer}>
      <NavBar />
        <Outlet />
      <Footer />
    </div>
  );
}
