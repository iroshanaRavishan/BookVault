import React, { useState } from 'react';
import styles from './filmcard.module.css';
import { FaCalendarAlt } from "react-icons/fa";
import { GoClockFill } from "react-icons/go";
import StarRating from '../star-rating/StartRating';

export default function FilmCard({ film }) {
  const [showModal, setShowModal] = useState(false);

  // Sample film object structure for reference
  const filmz = {
    id: 1,
    name: "Inception of the case in the moon",
    image: "/path/to/image.jpg",
    rating: 3.9,
    year: 2010,
    watched: true,
    genres: ["Sci-Fi", "Action", "Thriller"],
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
    plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    duration: "2h 28m",
    watchUrl: "https://www.netflix.com/watch/inception"
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <div className={styles.filmCard}>
        <div className={styles.imageContainer}>
          {filmz.imageUrl ? (
            <img src={filmz.imageUrl} alt={filmz.name} className={styles.filmImage} />
          ) : (
            <div className={styles.placeholderImage}>No Image</div>
          )}
          <div className={styles.overlay}>
            <button className={styles.detailsButton} onClick={openModal}>
              See Details
            </button>
          </div>
          {filmz.watched && (
            <div className={styles.watchedBadge}>
              <svg viewBox="0 0 24 24" fill="none" className={styles.watchedIcon}>
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span>Watched</span>
            </div>
          )}
        </div>
        
        <div className={styles.contentContainer}>
          <div className={styles.infoRow}>
            <div className={styles.titleRow}>
              <h3 className={styles.filmName}>{filmz.name}</h3>
            </div>
            
            <div className={styles.yearContainer}>
              <span className={styles.year}>{filmz.year}</span>
            </div>
            
            <div className={styles.ratingRow}>
              <div className={styles.rating}>
                <StarRating rating={filmz.rating} />
              </div>
            </div>
          </div>
          <div className={styles.genresContainer}>
            <div className={styles.genreBadgesList}>
              {filmz.genres.map((genre, index) => (
                <span key={index} className={styles.genreTag}>
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal/Popup */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>×</button>
            
            <div className={styles.modalGrid}>
              <div className={styles.modalImageContainer}>
                {filmz.imageUrl ? (
                  <img src={filmz.imageUrl} alt={filmz.name} className={styles.filmImage} />
                ) : (
                  <div className={styles.placeholderImage}>No Image</div>
                )}
                {filmz.watched && (
                  <div className={styles.modalWatchedBadge}>
                    <svg viewBox="0 0 24 24" fill="none" className={styles.watchedIcon}>
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span>Watched</span>
                  </div>
                )}
              </div>
              
              <div className={styles.modalDetails}>
                <div className={styles.modalTitleRow}>
                  <h2 className={styles.modalTitle}>{filmz.title}</h2>
                 
                </div>
                
                <div className={styles.modalInfo}>
                  <span className={styles.modalYear}><FaCalendarAlt size={15} style={{marginRight: '5px'}}/>{filmz.year}</span>
                  <span className={styles.modalDuration}><GoClockFill size={15} style={{marginRight: '5px'}}/>{filmz.duration}</span>
                   <div className={styles.modalRating}>
                    <StarRating rating={filmz.rating} />
                  </div>
                </div>
                
                <div className={styles.genresContainer} style={{ margin: '0px 0px 20px 0px' }}>
                  <div className={styles.genreBadgesList}>
                    {filmz.genres.map((genre, index) => (
                      <span key={index} className={styles.genreTag} style={{ textAlign: 'left', width: 'fit-content' }}>
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className={styles.modalSection}>
                  <h4 className={styles.modalSectionTitle}>Plot</h4>
                  <p className={styles.modalPlot}>{filmz.plot}</p>
                </div>
                
                <div className={styles.modalSection}>
                  <h4 className={styles.modalSectionTitle}>Director</h4>
                  <p className={styles.modalPlot}>{filmz.director}</p>
                </div>
                
                <div className={styles.modalWatchSection}>
                  <h4 className={styles.modalSectionTitle}>Watch Now</h4>
                  <a href={filmz.watchUrl} target="_blank" rel="noopener noreferrer" className={styles.watchButton}>
                    <svg viewBox="0 0 24 24" fill="none" className={styles.playIcon}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
                    </svg>
                    Watch on Platform
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
