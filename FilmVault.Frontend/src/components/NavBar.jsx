import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './componentstyles.module.css';

export default function NavBar() {
  return (
    <nav className={styles.navBar}>
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? styles.activeNavLink : styles.navLink)}
      >
        Home
      </NavLink>
      <NavLink
        to="/create"
        className={({ isActive }) => (isActive ? styles.activeNavLink : styles.navLink)}
      >
        Add Film
      </NavLink>
      <NavLink
        to="/edit"
        className={({ isActive }) => (isActive ? styles.activeNavLink : styles.navLink)}
      >
        Edit Films
      </NavLink>
      <NavLink
        to="/search"
        className={({ isActive }) => (isActive ? styles.activeNavLink : styles.navLink)}
      >
        Search Film
      </NavLink>
      <NavLink
        to="/delete"
        className={({ isActive }) => (isActive ? styles.activeNavLink : styles.navLink)}
      >
        Delete Film
      </NavLink>
    </nav>
  );
}
