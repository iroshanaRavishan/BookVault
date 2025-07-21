import React, { useState } from 'react';
import styles from './bookcard.module.css';
import { RiEdit2Fill } from "react-icons/ri";
import { RiDeleteBin6Fill } from "react-icons/ri";
import GenreScroll from '../genre-scroll-buttons/GenreScroll';
import { TbClock } from "react-icons/tb";
import { Link, useNavigate } from 'react-router-dom';
import ConfirmDeleteModal from '../confirm-dialog/ConfirmDialogModal';
import useBooks from "../../hooks/useBook";
import { IoCloseCircleSharp } from "react-icons/io5";
import { FiCheckCircle } from "react-icons/fi";
import { FaRegWindowMaximize, FaRegWindowRestore } from "react-icons/fa6";
import { LoadingAnimation } from '../loading-animation/LoadingAnimation';

export default function BookCard({ book, refreshBooks }) {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const { books, loading, fetchBooks } = useBooks(); // custom hook
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  function ImagePathReviser(path){
    return `https://localhost:7157/uploads/${path.replace(/\\/g, '/')}`;
  }

  function handleDeleteClick() {
    setShowDeleteConfirmModal(true);   // Show the confirmation modal
    closeModal(); // Open the modal to confirm deletion           
  };
  
  function handleCloseModal() {
    setShowDeleteConfirmModal(false);
  };

  async function handleConfirmDelete() {
    await fetchBooks(); // refresh after successful delete
    setShowDeleteConfirmModal(false);
    // TODO : Implement the logic of opening the book modal if the modal is closed or cancel. 
    // now the book modal is closing when close or cancel. so to delete have to start fro the begininghere
  };

  function handleDelayedNavigation() {
    setIsLoading(true);
    setTimeout(() => {
      navigate(`/read/${book.id}`);
    }, 3000); // 1000ms = 1 second delay
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <div className={styles.bookCard}>
        <div className={styles.imageContainer}>
          {book.coverImagePath ? (
            <img src={ImagePathReviser(book.coverImagePath)} alt={book.name} className={styles.bookImage} />
          ) : (
             book.thumbnailPath ? (
              <img src={ImagePathReviser(book.thumbnailPath)} alt={book.name} className={styles.bookImage} />
            ) : (
              <div className={styles.placeholderImage}>
                <span className={styles.placeholderText}>No Image</span>
              </div>
            )
          )}
          <div className={styles.overlay}>
            <button className={styles.detailsButton} onClick={openModal}>
              See Details
            </button>
          </div>
          {book.isRead && (
            <div className={styles.readBadge}>
              <span className={styles.readIcon}>
                <FiCheckCircle size={16}/>
              </span>
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
            <span className={styles.closeButton} onClick={closeModal}><IoCloseCircleSharp size={30}/></span>
            
            <div className={styles.modalGrid}>
              <div className={styles.modalImageContainer}>
                {book.coverImagePath ? (
                  <img src={ImagePathReviser(book.coverImagePath)} alt={book.name} className={styles.bookImage} />
                ) : (
                  book.thumbnailPath ? (
                    <img src={ImagePathReviser(book.thumbnailPath)} alt={book.name} className={styles.bookImage} />
                  ) : (
                    <div className={styles.placeholderImage}>
                      <span className={styles.placeholderText}>No Image</span>
                    </div>
                  )
                )}
                {book.isRead && (
                  <div className={styles.modalReadBadge}>
                    <span className={styles.readIcon}>
                      <FiCheckCircle size={16}/>
                    </span>
                    <span>Read</span>
                  </div>
                )}
              </div>
              
              <div className={styles.modalDetails}>
                <div className={styles.modalTitleRow}>
                  <h2 className={styles.modalTitle}>{book.name}</h2>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', width: '100%' , marginTop: '10px'}}>
                    <Link to={`/edit/${book.id}`}>
                      <span className={styles.editBookRec}><RiEdit2Fill size={16} color='black'/></span>
                    </Link>
                    <button onClick={handleDeleteClick} className={styles.editBookRec} style={{ marginLeft: '10px', background: 'white', border: 'none' }}>
                      <RiDeleteBin6Fill size={16} color='black' />
                    </button>
                  </div>
                </div>
                
                <div className={styles.modalInfo}>
                  <span className={styles.estTime}><TbClock size={15} style={{marginRight: '5px', marginTop: '2px'}}/>27 mins read</span>
                  <span className={styles.inprogressStatus} style={{fontStyle:"italic", fontSize: "12px", color: "#858585"}}>progress: 0%</span>
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
                  <div className={styles.readPlatformActionBtns}>
                    <button className={styles.readButton} onClick={handleDelayedNavigation}>
                      <FaRegWindowMaximize className={styles.sourceIcon} />
                      Read on Platform
                    </button>
                    <button disabled={!book.readUrl} className={styles.readButton}>
                      <FaRegWindowRestore className={styles.sourceIcon}/>
                      Read on source
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        bookId={book.id}
        isOpen={showDeleteConfirmModal}
        onClose={handleCloseModal}
        onConfirm={()=> {
          handleConfirmDelete();
          refreshBooks();
        }}
      />
      { isLoading && <LoadingAnimation /> }
    </>
  );
};
