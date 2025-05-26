import React, { useRef, useEffect } from "react"
import styles from "./confirmdialogmodal.module.css"

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm }) {
  const modalRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer} ref={modalRef}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Confirm Delete</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalContent}>
          <p className={styles.modalText}>
            Are you sure you want to delete this item? This action cannot be undone.
          </p>

          <div className={styles.modalActions}>
            <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
            <button className={styles.deleteButton} onClick={onConfirm}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  )
}
