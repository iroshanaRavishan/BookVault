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
      {currentPageInfo.left > 0 &&
        currentPageInfo.left <= currentPageInfo.total && (
          <span
            className={`${styles.pageNumber} ${isActive(
              currentPageInfo.left
            )}`}
            style={{ padding: '5px 8px 8.2px 8px' }}
            onClick={() => onSelectPage(currentPageInfo.left)}
          >
            {currentPageInfo.left}
          </span>
        )}

      {
        currentPageInfo.left > 0 &&
        (
          <span className={styles.separator}></span>
        )
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
