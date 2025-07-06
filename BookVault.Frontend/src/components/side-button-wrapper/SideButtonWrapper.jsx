import React, { useRef, useEffect, useState } from "react";
import BookReadingBoardSideButton from "../book-reading-board-side-button/BookReadingBoardSideButton";
import styles from "./sidebuttonwrapper.module.css";
const rightButtonData = ["Appearance", "Reading Style", "Bookmarks", "Statistics"];
const leftButtonData = ["Notes"];

export default function SideButtonsWrapper() {
  const [rightOffsets, setRightOffsets] = useState([]);
  const [leftOffsets, setLeftOffsets] = useState([]);
  const [activePanel, setActivePanel] = useState(null); // { name, position }

  const rightRefs = useRef([]);
  const leftRefs = useRef([]);

  useEffect(() => {
    const calcOffsets = (refs) => {
      const newOffsets = [];
      let cumulativeOffset = 132;

      refs.forEach((el) => {
        if (el) {
          const width = el.offsetWidth;
          newOffsets.push(cumulativeOffset);
          cumulativeOffset += width + 20;
        }
      });

      return newOffsets;
    };

    setRightOffsets(calcOffsets(rightRefs.current));
    setLeftOffsets(calcOffsets(leftRefs.current));
  }, []);

const handleButtonClick = (name, position) => {
  setActivePanel((prev) =>
    prev && prev.name === name ? null : { name, position }
  );
};
  return (
    <>
      {rightButtonData.map((label, index) => (
        <BookReadingBoardSideButton
          key={`right-${index}`}
          name={label}
          top={rightOffsets[index] || 132}
          ref={(el) => (rightRefs.current[index] = el)}
          position="right"
          onClick={() => handleButtonClick(label, "right")}
          isActive={activePanel?.name === label}
        />
      ))}
      {leftButtonData.map((label, index) => (
        <BookReadingBoardSideButton
          key={`left-${index}`}
          name={label}
          top={leftOffsets[index] || 132}
          ref={(el) => (leftRefs.current[index] = el)}
          position="left"
          onClick={() => handleButtonClick(label, "left")}
          isActive={activePanel?.name === label}
        />
      ))}
      <BookReadingBoardSideButton
        name="Ask AI"
        position="bottom"
        onClick={() => handleButtonClick("Ask AI", "bottom")}
        isActive={activePanel?.name === "Ask AI"}
      />

      {activePanel && (
        <div className={`${styles.panel} ${styles[activePanel.position]}`}>
          <div className={styles.panelContent}>
            <h3>{activePanel.name}</h3>
            <p>This is the {activePanel.name} panel.</p>
          </div>
        </div>
      )}
    </>
  );
}
