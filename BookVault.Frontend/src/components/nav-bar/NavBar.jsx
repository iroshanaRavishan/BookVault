import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './navbar.module.css';
import { TbCopyPlus, TbCopyPlusFilled } from "react-icons/tb";
import { RiHome9Fill, RiHome9Line } from "react-icons/ri";
import { PiBooksDuotone, PiBooksFill } from "react-icons/pi";
import { SlMenu } from "react-icons/sl";
import { useUser } from '../../context/UserContext';
import { FaUserCircle } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { IoCloseCircleSharp } from 'react-icons/io5';

export default function NavBar() {
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [loggedUser, setLoggedUser] = useState(null);
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

    useEffect(()=>{
      const userEmail = localStorage.getItem('userEmail');
      setLoggedUser(userEmail);
    },[user])

    function sideMenu() {
      setIsSideMenuOpen(!isSideMenuOpen);
    };

    async function logOutHandler() {
      sideMenu();
      setIsLoading(true);
      setTimeout(async () => {
          try {
              const response = await fetch("https://localhost:7157/api/Auth/logout", {
                  method: "GET",
                  credentials: "include"
              });
              const data = await response.json();
              if (response.ok) {
                  localStorage.removeItem("userEmail");
                  document.location = "/";
              } else {
                  console.log("Could not log out: ", response);
              }
          } catch (error) {
              console.error("Error logging out:", error);
          } finally {
              setIsLoading(false);
          }
      }, 400);
    }

  return (
    <nav className={styles.navBar}>
      <div>
        <img src="../src/assets/logo.png" className={styles.navBarLogo} alt="logo" />
      </div>

      {!loggedUser && (
          <NavLink
            to="/auth"
              className={({ isActive }) => `${isActive ? styles.activeNavLink : styles.navLink} ${styles.navFlex}`}
          >
            {({ isActive }) => (
              <>
                {isActive ? <FaUserCircle size={20} /> : <FaRegUserCircle size={20} />}
                <span>Account </span>
              </>
            )}
          </NavLink>
      )}

      {loggedUser && (
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
            className={`${styles.navLink} ${styles.navFlex}`}
            onClick={sideMenu}
          >
            <SlMenu size={20} />
            <span>Menu</span>
          </NavLink>
        </div>
      )}
    </nav>
  );
}
