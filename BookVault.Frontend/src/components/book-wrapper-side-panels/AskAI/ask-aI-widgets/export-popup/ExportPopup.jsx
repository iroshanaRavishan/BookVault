import React from "react";
import styles from "./exportpopup.module.css";

export default function ExportPopup({ onSelect, isClosing, popupRef }) {
  return (
    <div className={styles.overlay} ref={popupRef}>
      <div className={`${styles.popup} ${
          isClosing ? styles.slideOut : styles.slideIn
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.option} onClick={() => onSelect("pdf")}>
          As PDF
        </div>

        <div className={styles.option} onClick={() => onSelect("word")}>
          As Word
        </div>
      </div>
    </div>
  );
}