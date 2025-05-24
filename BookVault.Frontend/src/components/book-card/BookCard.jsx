import React, { useEffect, useState } from 'react';
import styles from './bookcard.module.css';
import { FaCalendarAlt } from "react-icons/fa";
import { GoClockFill } from "react-icons/go";
import GenreScroll from '../genre-scroll-buttons/GenreScroll';
import { TbClock } from "react-icons/tb";
// import StarRating from '../star-rating/StartRating';

export default function BookCard({ book }) {
  const [showModal, setShowModal] = useState(false);

  // Sample book object structure for reference
  // const book = {
  //   id: 1,
  //   name: "Inception of the case in the moon",
  //   image: "/path/to/image.jpg",
  //   rating: 3.9,
  //   year: 2010,
  //   read: true,
  //   genres: ["Sci-Fi", "Action", "Thriller"],
  //   author: "Christopher Nolan",
  //   cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
  //   plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
  //   length: "2h 28m",
  //   readUrl: "https://www.websitename.com/read/books"
  // };

  function ImagePathReviser(path){
    return `https://localhost:7157/uploads/${path.replace(/\\/g, '/')}`;
  }

  useEffect(() => {
    console.log(('book', book));
  },[]);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <div className={styles.bookCard}>
        <div className={styles.imageContainer}>
          {book.coverImagePath ? (
            <img src={ImagePathReviser(book.coverImagePath)} alt={book.name} className={styles.bookImage} />
          ) : (
            <div className={styles.placeholderImage}>No Image</div>
          )}
          <div className={styles.overlay}>
            <button className={styles.detailsButton} onClick={openModal}>
              See Details
            </button>
          </div>
          {book.isRead && (
            <div className={styles.readBadge}>
              <svg viewBox="0 0 24 24" fill="none" className={styles.readIcon}>
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span>Read</span>
            </div>
          )}
        </div>
        
        <div className={styles.contentContainer}>
          <div className={styles.infoRow}>
            <div className={styles.titleRow}>
              <h3 className={styles.bookName}>{book.name}</h3>
            </div>
            
            <div className={styles.readprogressDetailContainer}>
              <div >
                <span className={styles.estTime}><TbClock size={15} style={{marginRight: '5px', marginTop: '2px'}}/>27 mins read</span>
              </div>               
              <div className={styles.inProgressContainer}>
                <span className={styles.inprogressStatus} style={{fontStyle:"italic", fontSize: "12px", color: "#858585"}}>progress: 0%</span>
              </div>
            </div>
          </div>
          <GenreScroll genres={book.genres} />
        </div>
      </div>

      {/* Modal/Popup */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>×</button>
            
            <div className={styles.modalGrid}>
              <div className={styles.modalImageContainer}>
                {book.coverImagePath ? (
                  <img src={ImagePathReviser(book.coverImagePath)} alt={book.name} className={styles.bookImage} />
                ) : (
                  <div className={styles.placeholderImage}>No Image</div>
                )}
                {book.isRead && (
                  <div className={styles.modalReadBadge}>
                    <svg viewBox="0 0 24 24" fill="none" className={styles.readIcon}>
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span>Read</span>
                  </div>
                )}
              </div>
              
              <div className={styles.modalDetails}>
                <div className={styles.modalTitleRow}>
                  <h2 className={styles.modalTitle}>{book.name}</h2>
                </div>
                
                <div className={styles.modalInfo}>
                  <span className={styles.modalYear}><FaCalendarAlt size={15} style={{marginRight: '5px'}}/>{book.year}</span>
                  <span className={styles.modalDuration}><GoClockFill size={15} style={{marginRight: '5px'}}/>{book.duration}</span>
                </div>
                
                <div className={styles.genresContainer} style={{ margin: '0px 0px 20px 0px'}}>
                  <div className={styles.modelGenreBadgesList}>
                    {book.genres.map((genre, index) => (
                      <span key={index} className={styles.genreTag} style={{ textAlign: 'left', width: 'fit-content' }}>
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className={styles.modalSection}>
                  <h4 className={styles.modalSectionTitle}>Plot</h4>
                  <p className={styles.modalPlot}>{book.plot}</p>
                </div>
                
                <div className={styles.modalSection}>
                  <h4 className={styles.modalSectionTitle}>Author</h4>
                  <p className={styles.modalPlot}>{book.author}</p>
                </div>
                
                <div className={styles.modalReadSection}>
                  <h4 className={styles.modalSectionTitle}>Read Now</h4>
                  <a href={book.readUrl} target="_blank" rel="noopener noreferrer" className={styles.readButton}>
                    <svg viewBox="0 0 24 24" fill="none" className={styles.playIcon}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
                    </svg>
                    Read on Platform
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
