import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './navbar.module.css';
import { TbCopyPlus, TbCopyPlusFilled } from "react-icons/tb";
import { RiEditBoxFill, RiHome9Fill, RiHome9Line } from "react-icons/ri";
import { RiEditBoxLine } from "react-icons/ri";
import { PiBooksDuotone, PiBooksFill } from "react-icons/pi";
import { BsBookmarkX } from "react-icons/bs";
import { BsFillBookmarkXFill } from "react-icons/bs";

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
              <span>Add Book</span>
            </>
          )}
        </NavLink>
        <NavLink
          to="/edit"
          className={({ isActive }) => `${isActive ? styles.activeNavLink : styles.navLink} ${styles.navFlex}`}
        >
          {({ isActive }) => (
            <>
              {isActive ? <RiEditBoxFill size={20} /> : <RiEditBoxLine size={20} />}
              <span>Edit Books</span>
            </>
          )}
        </NavLink>
        <NavLink
          to="/search"
          className={({ isActive }) => `${isActive ? styles.activeNavLink : styles.navLink} ${styles.navFlex}`}
        >
          {({ isActive }) => (
            <>
              {isActive ? <PiBooksFill size={20} /> : <PiBooksDuotone size={20} />}
              <span>Search Books</span>
            </>
          )}
        </NavLink>
        <NavLink
          to="/delete"
          className={({ isActive }) => `${isActive ? styles.activeNavLink : styles.navLink} ${styles.navFlex}`}
        >
          {({ isActive }) => (
            <>
              {isActive ? <BsFillBookmarkXFill size={20} /> : <BsBookmarkX size={20} />}
              <span>Delete Books</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
}
