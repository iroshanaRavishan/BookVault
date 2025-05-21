import React from 'react';
import styles from './footer.module.css';
import { MdEmail } from "react-icons/md";
import { FaSquareXTwitter } from "react-icons/fa6";
import { PiInstagramLogoFill } from "react-icons/pi";
import { IoLogoYoutube } from "react-icons/io";
import { Link } from 'react-router-dom';


export default function Footer() {
  return (
    <footer className={styles.bookVaultFooter}>
      <div className={styles.footerMain}>
        <div className={styles.footerNewsletter}>
          <h3>Get the BookVault Newsletter</h3>
          <div className={styles.emailInputContainer}>
            <input type="email" placeholder="Enter your email" />
            <button className={styles.subscribeBtn}>Subscribe</button>
          </div>
          <div className={styles.consentCheckbox}>
            <input type="checkbox" id="consent" />
            <label htmlFor="consent">By checking this box, you agree that you are at least 18 years of age</label>
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
              <li><Link to="/edit">Edit Books</Link></li>
              <li><Link to="/search">Search Added Books</Link></li>
              <li><Link to="/delete">Delete Books</Link></li>
            </ul>
          </div>
          
          <div className={styles.footerColumn}>
            <h4>BookVault News</h4>
            <ul>
              <li><Link to="#">Book Industry</Link></li>
              <li><Link to="#">Interviews</Link></li>
              <li><Link to="#">Book Festivals</Link></li>
              <li><Link to="#">Awards</Link></li>
            </ul>
          </div>
          
          <div className={styles.footerColumn}>
            <div className={styles.regionSelector}>
              <select>
                <option>Choose region</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Australia</option>
                <option>Europe</option>
                <option>Asia</option>
              </select>
            </div>
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
