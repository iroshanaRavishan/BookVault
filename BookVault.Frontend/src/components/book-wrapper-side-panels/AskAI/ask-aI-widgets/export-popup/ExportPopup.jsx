import React from "react";
import styles from "./exportpopup.module.css";

export default function ExportPopup({ onSelect, isClosing, popupRef }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.popup} ${
          isClosing ? styles.slideOut : styles.slideIn
        }`}
      >
      </div>
    </div>
  );
}