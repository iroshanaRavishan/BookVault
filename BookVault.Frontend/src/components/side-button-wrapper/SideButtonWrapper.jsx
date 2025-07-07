import React, { useRef, useEffect, useState } from "react";
import BookReadingBoardSideButton from "../book-reading-board-side-button/BookReadingBoardSideButton";
import styles from "./sidebuttonwrapper.module.css";
import { IoCloseCircleSharp } from "react-icons/io5";

const rightButtonData = ["Appearance", "Reading Style", "Bookmarks", "Statistics"];
const leftButtonData = ["Notes"];

export default function SideButtonsWrapper() {
  const [rightOffsets, setRightOffsets] = useState([]);
  const [leftOffsets, setLeftOffsets] = useState([]);
  const [activePanel, setActivePanel] = useState(null);     // The currently active panel (mounted)
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [pendingPanel, setPendingPanel] = useState(null);   // Panel to open next after closing

  const rightRefs = useRef([]);
  const leftRefs = useRef([]);

  // Calculate button offsets for vertical positioning
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

  // Handle button click
  const handleButtonClick = (name, position) => {
    const newPanel = { name, position };

    if (activePanel) {
      // If user clicks another panel while one is open, close it first
      handleClosePanel(newPanel);
    } else {
      // No panel is open, open immediately
      setActivePanel(newPanel);
      setTimeout(() => setIsOpening(true), 0);
    }
  };

  // When closing finishes, open the pending panel if any
  useEffect(() => {
    if (!isClosing && pendingPanel) {
      setActivePanel(pendingPanel);
      setPendingPanel(null);

      // Wait for next paint to trigger `.open`
      requestAnimationFrame(() => {
        setIsOpening(true);
      });
    }
  }, [isClosing, pendingPanel]);

  // Close panel handler
  const handleClosePanel = (nextPanel = null) => {
    setIsClosing(true);
    setIsOpening(false);

    if (nextPanel) {
      setPendingPanel(nextPanel); // queue the next panel if provided
    }

    setTimeout(() => {
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

      {activePanel && (
        <div
          className={`
            ${styles.panel}
            ${styles[activePanel.position]}
            ${isOpening && !isClosing ? styles.open : ""}
            ${isClosing ? styles.closing : ""}
          `}
        >
          <IoCloseCircleSharp
            className={`${styles.closeButton} closeBtn`}
            color="#e53e3e"
            onClick={() => handleClosePanel()}
            size={30}
          />
          <div className={styles.panelContent}>
            <span>{activePanel.name}</span>
          </div>
        </div>
      )}
    </>
  );
}
