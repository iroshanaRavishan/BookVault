import React from "react";
import styles from "./chatpageselector.module.css";
import { useFlipBook } from "../../../../context/FlipBookContext";

export default function ChatPageSelector({
  selectedPage,
  onSelectPage,
}) {
  const { currentPageInfo } = useFlipBook();
  const isActive = (page) =>
    selectedPage === page ? styles.active : "";

  return (
    <span className={styles.pageText}>
      {
        currentPageInfo.left > 
          <span
            className={styles.pageNumber}
            style={{ padding: '5px 8px 8.2px 8px' }} 
          >
            left page
          </span>
      }
      {currentPageInfo.right > 0 &&
        currentPageInfo.right <= currentPageInfo.total && (
          <span
            className={`${styles.pageNumber} ${isActive(
              currentPageInfo.right
            )}`}
            style={{ padding: '5px 8px 8.2px 8px' }}
            onClick={() => onSelectPage(currentPageInfo.right)}
          >
            {currentPageInfo.right}
          </span>
        )}
    </span>
  );
}
