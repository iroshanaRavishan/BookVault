import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './navbar.module.css';
import { TbCopyPlus, TbCopyPlusFilled } from "react-icons/tb";
import { RiHome9Fill, RiHome9Line } from "react-icons/ri";
import { PiBooksDuotone, PiBooksFill } from "react-icons/pi";
import { SlMenu } from "react-icons/sl";
import { useUser } from '../../context/UserContext';
import { FaUserCircle } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { IoCloseCircleSharp } from 'react-icons/io5';
import { IoIosPower } from "react-icons/io";
import { HiMiniCog6Tooth } from "react-icons/hi2";
import { IoIosColorPalette } from "react-icons/io";
import { IoCall } from "react-icons/io5";
import { RiInformationFill } from "react-icons/ri";
import { MdDownloadForOffline } from "react-icons/md";

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
    
    const profilePictureUrl = user?.profilePicture 
    ? `data:${user.profilePictureContentType};base64,${user.profilePicture}` 
    : null;

    const username = user?.name ? user.name: null;


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
          <div
            className={`${styles.navLinkButton} ${styles.navLink} ${styles.navFlex}`}
            onClick={sideMenu}
          >
            <SlMenu size={20} />
            <span>Menu</span>
          </div>

          <div className={`${styles.sideMenu} ${isSideMenuOpen ? styles.open : ""}`}>
              <div className={styles.sideMenuFirstContent}>
                  <span className={styles.closeBtn} onClick={sideMenu}> 
                        <IoCloseCircleSharp size={26} className={styles.closeIcon} />
                  </span>
                  <div className={styles.menuHeader}>
                      <img src={profilePictureUrl} alt="Profile" className={styles.profilePicture}/>
                      <span>Hello, <br /> {username}</span>
                  </div>
                  <Link to="/" className={styles.menuIconWrapper} onClick={ ()=>setIsSideMenuOpen(!isSideMenuOpen) }>
                      <HiMiniCog6Tooth className={styles.menuIcon} size={21}/>
                      <span className={styles.menuTitle}>Settings <br />
                          <span className={styles.menuSubTitle}>App settings</span> 
                      </span>
                  </Link>
                  <Link to="/" className={styles.menuIconWrapper} onClick={ ()=>setIsSideMenuOpen(!isSideMenuOpen) }>
                      <FaUserCircle className={styles.menuIcon} size={20}/>
                      <span className={styles.menuTitle}>Profile <br />
                          <span className={styles.menuSubTitle}>Profile related settings</span> 
                      </span>
                  </Link>
                  <Link to="/" className={styles.menuIconWrapper} onClick={ ()=>setIsSideMenuOpen(!isSideMenuOpen) }>
                      <IoIosColorPalette className={styles.menuIcon} size={22}/>
                      <span className={styles.menuTitle}>Appearance <br />
                          <span className={styles.menuSubTitle}>Take control of your view</span>
                      </span>
                  </Link>
                  <Link to="/" className={styles.menuIconWrapper} onClick={ ()=>setIsSideMenuOpen(!isSideMenuOpen) }>
                    <MdDownloadForOffline className={styles.menuIcon} size={21}/>
                    <span className={styles.menuTitle}>Downloads <br />
                        <span className={styles.menuSubTitle}>A quick access to downloaded files</span> 
                    </span>
                  </Link>
                  <Link to="/contact" className={styles.menuIconWrapper} onClick={ ()=>setIsSideMenuOpen(!isSideMenuOpen) }>
                      <IoCall className={styles.menuIcon} size={20}/>
                      <span className={styles.menuTitle}>Contact</span>
                  </Link>
                  <Link to="/" className={styles.menuIconWrapper} onClick={ ()=>setIsSideMenuOpen(!isSideMenuOpen) }>
                      <RiInformationFill className={styles.menuIcon} size={21}/>
                      <span className={styles.menuTitle}>FAQs<br />
                          <span className={styles.menuSubTitle}>Any question, expore here</span>
                      </span>
                  </Link>
              </div>
              <div className={styles.sideMenuMiddleContent}>
                  <span>
                      <p>There is more to love in the Mobile Application</p>
                      <img src='./src/assets/logo.png' />
                      <a href=""><img src='./src/assets/mobile-app-options.png' /></a>
                  </span>
              </div>
              <div className={styles.sideMenuLastContent}>
                  <IoIosPower size={20} className={styles.logOutBtn} onClick={logOutHandler}/>
              </div>
          </div>
          {isSideMenuOpen && <div className={styles.overlay} onClick={sideMenu}></div>}
        </div>
      )}
    </nav>
  );
}
