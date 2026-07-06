import React from "react";
import styles from "./exportpopup.module.css";

export default function ExportPopup({ onSelect, isClosing, popupRef }) {
  return (
    <div className={styles.overlay} ref={popupRef}>
      <div className={`${styles.popup} ${
          isClosing ? styles.slideOut : styles.slideIn
        }`}
      >
      </div>
    </div>
  );
}