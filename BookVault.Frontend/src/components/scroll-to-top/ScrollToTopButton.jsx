import React, { useEffect, useState } from 'react';
import Styles from './scrolltotopbutton.module.css';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when scrolled down 300px
  const toggleVisibility = () => {
    setIsVisible(window.scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <button
      className={Styles.button}  
      onClick={scrollToTop}
      aria-label="Scroll to top"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transition: 'opacity 0.3s ease-in-out'
      }}
    >
      ↑
    </button>
  );
}
