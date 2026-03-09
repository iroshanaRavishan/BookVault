import React from "react";
import styles from "./chatpageselector.module.css";
import { useFlipBook } from "../../../../context/FlipBookContext";

export default function ChatPageSelector({
  selectedPage,
  onSelectPage,
}) {
  const { currentPageInfo } = useFlipBook();

  return (
    <span className={styles.pageText}>
      {currentPageInfo.right > 0 &&
        currentPageInfo.right <= currentPageInfo.total && (
          <span>
            right page goes here
          </span>
        )}
    </span>
  );
}
