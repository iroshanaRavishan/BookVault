import React, { useEffect, useState } from 'react';
import styles from './footer.module.css';
import { MdEmail } from "react-icons/md";
import { FaSquareXTwitter } from "react-icons/fa6";
import { PiInstagramLogoFill } from "react-icons/pi";
import { IoLogoYoutube } from "react-icons/io";
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

export default function Footer() {

  const { user } = useUser();
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(()=>{
    const userEmail = localStorage.getItem('userEmail');
    setLoggedUser(userEmail);
  },[user]);

  return (
    <footer className={styles.bookVaultFooter}>
      <div className={styles.footerMain}>
        <div className={styles.footerNewsletter}>
          <h3>Get the BookVault Newsletter</h3>
          <div className={styles.emailInputContainer}>
            <input type="email" placeholder="Enter your email" />
            <button className={styles.subscribeBtn}>Subscribe</button>
          </div>
          <div className={styles.socialIcons}>
            <Link to="#" aria-label="Email"><MdEmail /></Link>
            <Link to="#" aria-label="Twitter"><FaSquareXTwitter /></Link>
            <Link to="#" aria-label="Instagram"><PiInstagramLogoFill /></Link>
            <Link to="#" aria-label="YouTube"><IoLogoYoutube /></Link>
          </div>
        </div>
        
        <div className={styles.footerLinks}>
          <div className={styles.footerColumn}>
            <h4>Discover Books</h4>
            <ul>
              <li><Link to="#">New Releases</Link></li>
              <li><Link to="#">Top Rated</Link></li>
              <li><Link to="#">Genres</Link></li>
              <li><Link to="#">Collections</Link></li>
            </ul>
          </div>
          
          <div className={styles.footerColumn}>
            <h4>Explore</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/create">Add Books</Link></li>
              <li><Link to="/search">Search Books</Link></li>
            </ul>
          </div>

          {loggedUser && (
            <div className={styles.footerColumn}>
              <h4>Menu</h4>
              <ul>
                <li><Link to="/">Settings</Link></li>
                <li><Link to="/">Profile</Link></li>
                <li><Link to="/">Appearance</Link></li>
                <li><Link to="/">Downloads</Link></li>
                <li><Link to="/">Contact</Link></li>
                <li><Link to="/">FAQs</Link></li>
              </ul>
            </div>
          )}

          <div className={styles.footerColumn}>
            <h4>BookVault News</h4>
            <ul>
              <li><Link to="#">Book Industry</Link></li>
              <li><Link to="#">Interviews</Link></li>
              <li><Link to="#">Book Festivals</Link></li>
              <li><Link to="#">Awards</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className={styles.footerCopyright}>
        <p>© 2025 BookVault Ltd. All Rights Reserved.</p>
      </div>
      
      <div className={styles.footerBottomLinks}>
        <Link to="#">Website Terms</Link>
        <Link to="#">Privacy Policy</Link>
        <Link to="#">Do Not Sell or Share My Personal Information</Link>
        <Link to="#">Ad Choices</Link>
        <Link to="#">Cookie Consent</Link>
        <Link to="#">Accessibility</Link>
      </div>
    </footer>
  );
}
