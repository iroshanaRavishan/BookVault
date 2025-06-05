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

          <div className={`${styles.sideMenu} ${isSideMenuOpen ? styles.open : ""}`}>
              <div className={styles.sideMenuFirstContent}>
                  <span className={styles.closeBtn} onClick={sideMenu}> 
                        <IoCloseCircleSharp size={26} className={styles.closeIcon} />
                  </span>
                  <div className={styles.menuHeader}>
                      <img src="../src/assets/profile-image.jpg" alt="Profile" className={styles.profilePicture}/>  {/*  src={profilePictureUrl} */}
                      <span>Hello, <br /> Iroshana Ravishan</span> {/*  {username} */}
                  </div>
                  <li href="/" className={styles.menuIconWrapper}>
                      <img className={styles.menuIcon} src="./src/assets/images/order.png" alt="Orders"/>
                      <a>Orders <br />
                          <span>Check out the current ongoing orders</span> 
                      </a>
                  </li>
                  <li href="/menu" className={styles.menuIconWrapper}>
                      <img className={styles.menuIcon} src="./src/assets/images/history.png" alt="History"/>
                      <a >History <br />
                          <span>Access the past, completed orders</span>
                      </a>
                  </li>
                  <li href="/contact" className={styles.menuIconWrapper}>
                      <img className={styles.menuIcon} src="./src/assets/images/promotion.png" alt="Promotion"/>
                      <a>Promotion <br />
                          <span>Check you luck here</span>
                      </a>
                  </li>
                  <li href="/profile" className={styles.menuIconWrapper}>
                      <img className={styles.menuIcon} src="./src/assets/images/settings.png" alt="Settings"/>
                      <a >Settings </a>
                  </li>
                  <li href="/contact" className={styles.menuIconWrapper}>
                      <img className={styles.menuIcon} src="./src/assets/images/help.png" alt="Contact"/>
                      <a >Contact</a>
                  </li>
                  <li href="/feedback" className={styles.menuIconWrapper}>
                      <img className={styles.menuIcon} src="./src/assets/images/faq.png" alt="FAQ"/>
                      <a >FAQ<br />
                          <span>Any question, expore here</span>
                      </a>
                  </li>
                  <li href="/feedback" className={styles.menuIconWrapper}>
                      <img className={styles.menuIcon} src="./src/assets/images/feedback.png" alt="Feedback"/>
                      <a >Feedback<br />
                          <span>Feedbacks and suggestions are welcome!</span>
                      </a>
                  </li>
              </div>
              <div className={styles.sideMenuMiddleContent}>
                  <span>
                      <p>There is more to love in the Mobile Application</p>
                      <img src='./src/assets/images/logo.png' />
                      <a href=""><img src='./src/assets/images/mobile-app-options.png' /></a>
                  </span>
              </div>
              <div className={styles.sideMenuLastContent}>
                  <div >
                      <img className={styles.menuIcon} id="invite-friends" src="./src/assets/images/invite-friends.png" alt="Feedback"/>    
                      <span>Invite Friends?</span>
                  </div>
                  <img className={styles.logOutBtn} src="./src/assets/images/logout.png" alt="signout" onClick={logOutHandler}/>
              </div>
          </div>
          {isSideMenuOpen && <div className={styles.overlay} onClick={sideMenu}></div>}
        </div>
      )}
    </nav>
  );
}
