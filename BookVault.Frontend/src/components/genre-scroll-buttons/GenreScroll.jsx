import { useRef, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import styles from './genrescroll.module.css'; 

export default function GenreScroll({ genres }) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const el = scrollContainerRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }
  };

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({ left: -100, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({ left: 100, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons);

    // Initial check in case scroll is already needed
    window.addEventListener('resize', updateScrollButtons);

    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, []);

  return (
    <div className={styles.genreScrollWrapper}>
        <button onClick={scrollLeft} className={styles.scrollButton} style={{left: '-8px'}} disabled={!canScrollLeft}>
            <FaChevronLeft />
        </button>

        <div ref={scrollContainerRef} className={styles.genreBadgesList}>
            {Array.isArray(genres) && genres.length > 0 ? (
                genres.map((genre, index) => (
                    <span key={index} className={styles.genreTag}>
                        {genre}
                    </span>
                ))
            ) : (
                <span className={styles.noGenreText}>#no genre is added</span>
            )}
        </div>

        <button onClick={scrollRight} className={styles.scrollButton} style={{right: '-8px'}} disabled={!canScrollRight}>
            <FaChevronRight />
        </button>
    </div>
  );
}
