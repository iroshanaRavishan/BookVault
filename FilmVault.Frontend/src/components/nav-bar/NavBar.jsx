import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './navbar.module.css';
import { TbCopyPlus, TbCopyPlusFilled } from "react-icons/tb";
import { RiFilmAiFill, RiHome9Fill, RiHome9Line } from "react-icons/ri";
import { RiFilmAiLine } from "react-icons/ri";
import { PiFilmReel, PiFilmReelFill } from "react-icons/pi";
import { BsCameraVideoOff } from "react-icons/bs";
import { BsCameraVideoOffFill } from "react-icons/bs";

export default function NavBar() {
  return (
    <nav className={styles.navBar}>
      <div>
        <img src="../src/assets/logo.png" className={styles.navBarLogo} alt="logo" />
      </div>
      <div className={styles.navBarLinks} >
        <NavLink
          to="/"
          className={({ isActive }) => `${isActive ? styles.activeNavLink : styles.navLink} ${styles.navFlex}`}
        >
          {({ isActive }) => (
            <>
              {isActive ? <RiHome9Fill size={20} /> : <RiHome9Line size={20} />}
              <span>Home</span>
            </>
          )}
        </NavLink>
        <NavLink
          to="/create"
            className={({ isActive }) => `${isActive ? styles.activeNavLink : styles.navLink} ${styles.navFlex}`}
        >
          {({ isActive }) => (
            <>
              {isActive ? <TbCopyPlusFilled size={20} /> : <TbCopyPlus size={20} />}
              <span>Add Film</span>
            </>
          )}
        </NavLink>
        <NavLink
          to="/edit"
          className={({ isActive }) => `${isActive ? styles.activeNavLink : styles.navLink} ${styles.navFlex}`}
        >
          {({ isActive }) => (
            <>
              {isActive ? <RiFilmAiFill size={20} /> : <RiFilmAiLine size={20} />}
              <span>Edit Films</span>
            </>
          )}
        </NavLink>
        <NavLink
          to="/search"
          className={({ isActive }) => `${isActive ? styles.activeNavLink : styles.navLink} ${styles.navFlex}`}
        >
          {({ isActive }) => (
            <>
              {isActive ? <PiFilmReelFill size={20} /> : <PiFilmReel size={20} />}
              <span>Search Films</span>
            </>
          )}
        </NavLink>
        <NavLink
          to="/delete"
          className={({ isActive }) => `${isActive ? styles.activeNavLink : styles.navLink} ${styles.navFlex}`}
        >
          {({ isActive }) => (
            <>
              {isActive ? <BsCameraVideoOffFill size={20} /> : <BsCameraVideoOff size={20} />}
              <span>Delete Films</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
}
