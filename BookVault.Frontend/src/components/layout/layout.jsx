import React from 'react';
import NavBar from '../nav-bar/NavBar';
import { Outlet } from 'react-router-dom';
import Footer from '../footer-section/Footer';
import styles from './layout.module.css';
import ScrollToTopButton from '../scroll-to-top/ScrollToTopButton';

export default function Layout() {
  return (
    <div className={styles.appContainer}>
      <NavBar />
        <Outlet />
         <ScrollToTopButton />
      <Footer />
    </div>
  );
}
