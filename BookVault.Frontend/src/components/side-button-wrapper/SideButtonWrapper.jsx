import React, { useRef, useEffect, useState } from "react";
import BookReadingBoardSideButton from "../book-reading-board-side-button/BookReadingBoardSideButton";
import styles from "./sidebuttonwrapper.module.css";
import { IoCloseCircleSharp } from "react-icons/io5";

const rightButtonData = ["Appearance", "Reading Style", "Bookmarks", "Statistics"];
const leftButtonData = ["Notes"];

export default function SideButtonsWrapper() {
  const [rightOffsets, setRightOffsets] = useState([]);
  const [leftOffsets, setLeftOffsets] = useState([]);
  const [mainPanel, setMainPanel] = useState(null); // right or bottom panel
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [pendingPanel, setPendingPanel] = useState(null);   // Panel to open next after closing

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
    const newPanel = { name, position };

    if (position === "left") {
      setLeftPanelOpen(true);
      return;
    }

    // Handle bottom + right conflict
    if (mainPanel) {
      // If trying to open right and bottom is open, or vice versa
      if (
        (mainPanel.position === "bottom" && position === "right") ||
        (mainPanel.position === "right" && position === "bottom")
      ) {
        handleCloseMainPanel(newPanel);
        return;
      }

      // Same panel clicked again
      if (mainPanel.name === name) return;

      // Close current panel and open new one
      handleCloseMainPanel(newPanel);
    } else {
      setMainPanel(newPanel);
      setTimeout(() => setIsOpening(true), 0);
    }
  };

  const handleCloseMainPanel = (nextPanel = null) => {
    setIsClosing(true);
    setIsOpening(false);

    if (nextPanel) {
      setPendingPanel(nextPanel);
    }

    setTimeout(() => {
      setMainPanel(null);
      setIsClosing(false);
    }, 300);
  };

  const handleCloseLeftPanel = () => {
    setLeftPanelOpen(false);
  };

  useEffect(() => {
    if (!isClosing && pendingPanel) {
      setMainPanel(pendingPanel);
      setPendingPanel(null);
      requestAnimationFrame(() => {
        setIsOpening(true);
      });
    }
  }, [isClosing, pendingPanel]);

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
          isActive={mainPanel?.name === label}
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
          isActive={leftPanelOpen}
        />
      ))}
      <BookReadingBoardSideButton
        name="Ask AI"
        position="bottom"
        onClick={() => handleButtonClick("Ask AI", "bottom")}
        isActive={mainPanel?.name === "Ask AI"}
      />

      {/* Left Panel */}
      {leftPanelOpen && (
        <div className={`${styles.panel} ${styles.left} ${styles.open}`}>
          <IoCloseCircleSharp
            className={`${styles.closeButton} closeBtn`}
            color="#e53e3e"
            onClick={handleCloseLeftPanel}
            size={30}
          />
          <div className={styles.panelContent}>
            <span>Notes</span>
          </div>
        </div>
      )}

      {/* Main Panel: right or bottom */}
      {mainPanel && (
        <div
          className={`
            ${styles.panel}
            ${styles[mainPanel.position]}
            ${isOpening && !isClosing ? styles.open : ""}
            ${isClosing ? styles.closing : ""}
          `}
        >
          <IoCloseCircleSharp
            className={`${styles.closeButton} closeBtn`}
            color="#e53e3e"
            onClick={() => handleCloseMainPanel()}
            size={30}
          />
          <div className={styles.panelContent}>
            <span>{mainPanel.name}</span>
          </div>
        </div>
      )}
    </>
  );
}
