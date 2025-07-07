import React, { useRef, useEffect, useState } from "react";
import BookReadingBoardSideButton from "../book-reading-board-side-button/BookReadingBoardSideButton";
import styles from "./sidebuttonwrapper.module.css";
import { IoCloseCircleSharp } from "react-icons/io5";

// and add a style to the panels to grow from 0 to this size and then shrink to 0 when closed
// notes hould be opebed when ask AI  OR  any right side panel is opened
const rightButtonData = ["Appearance", "Reading Style", "Bookmarks", "Statistics"];
const leftButtonData = ["Notes"];

export default function SideButtonsWrapper() {
  const [rightOffsets, setRightOffsets] = useState([]);
  const [leftOffsets, setLeftOffsets] = useState([]);
  const [activePanel, setActivePanel] = useState(null);
  const [visiblePanel, setVisiblePanel] = useState(null); 
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

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
    if (activePanel) {
      // Close current first
      setIsClosing(true);
      setTimeout(() => {
        setActivePanel({ name, position });
        setVisiblePanel({ name, position });
        setIsClosing(false);
        setIsOpening(true); // trigger open on next tick
      }, 300);
    } else {
      setActivePanel({ name, position });
      setVisiblePanel({ name, position });
      // Delay adding `.open` class to trigger transition
      setTimeout(() => setIsOpening(true), 0);
    }
  };

  const handleClosePanel = () => {
    setIsClosing(true);
    setIsOpening(false); // stop opening
    setTimeout(() => {
      setVisiblePanel(null);
      setActivePanel(null);
      setIsClosing(false);
    }, 300);
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

      {visiblePanel && (
        <div
          className={`
            ${styles.panel}
            ${styles[visiblePanel.position]}
            ${isOpening && !isClosing ? styles.open : ""}
            ${isClosing ? styles.closing : ""}
          `}
        >
          <IoCloseCircleSharp
            className={`${styles.closeButton} closeBtn`}
            color="#e53e3e"
            onClick={handleClosePanel}
            size={30}
          />
          <div className={styles.panelContent}>
            <span>{visiblePanel.name}</span>
          </div>
        </div>
      )}
    </>
  );
}
