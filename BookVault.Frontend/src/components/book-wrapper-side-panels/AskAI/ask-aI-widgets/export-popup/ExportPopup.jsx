import React from "react";
import styles from "./exportpopup.module.css";

export default function ExportPopup({ onSelect, onClose}) {
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
      </div>
    </div>
  );
}