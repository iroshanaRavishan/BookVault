import React, { useRef, useEffect, useState, useMemo } from "react";
import BookReadingBoardSideButton from "../book-reading-board-side-button/BookReadingBoardSideButton";
import styles from "./sidebuttonwrapper.module.css";
import { IoBookmarks, IoCloseCircleSharp, IoColorPaletteSharp } from "react-icons/io5";
import { BsChatLeftDotsFill, BsGrid1X2Fill, BsPinAngleFill, BsPinFill } from "react-icons/bs";
import { LuNotebookText } from "react-icons/lu";
import { FaChartBar } from "react-icons/fa";
import Bookmarks from "../book-wrapper-side-panels/bookmark-panel/Bookmarks";
import Note from "../book-wrapper-side-panels/note-panel/Note";

const rightButtonData = ["Bookmarks", "Appearance", "Reading Style", "Statistics"];
const leftButtonData = ["Notes"];

export default function SideButtonsWrapper({
  bookWidth,
  setBookWidth,
  containerRef,
  mainPanel,
  setMainPanel,
  leftPanelOpen,
  setLeftPanelOpen,
  isLeftPanelPinned,
  setIsLeftPanelPinned,
  onBookmarkSelect
}) {
  const [rightOffsets, setRightOffsets] = useState([]);
  const [leftOffsets, setLeftOffsets] = useState([]);
  const [isMainClosing, setIsMainClosing] = useState(false);
  const [isMainOpening, setIsMainOpening] = useState(false);
  const [isLeftOpening, setIsLeftOpening] = useState(false);
  const [isLeftClosing, setIsLeftClosing] = useState(false);
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

  const { dynamicPanelRight, dynamicButtonRight } = useMemo(() => {
    // If the left panel isn’t pinned, neither offset should apply
    if (!isLeftPanelPinned) {
      return { dynamicPanelRight: undefined, dynamicButtonRight: undefined };
    }

    // Compute the shared ratio for both button and panel
    const minBookWidth = 75;
    const maxBookWidth = 85;
    const ratio = (bookWidth - minBookWidth) / (maxBookWidth - minBookWidth);
    const clampedRatio = Math.min(Math.max(ratio, 0), 1);

    // Button always follows bookWidth when pinned
    const buttonRange = { min: 175, max: 220 };
    const dynamicButtonRight = 
      `${buttonRange.min + (buttonRange.max - buttonRange.min) * clampedRatio}px`;

    // Panel only when bottom panel is open
    let dynamicPanelRight;
    if (mainPanel?.position === "bottom") {
      const panelRange = { min: 55, max: 100 };
      dynamicPanelRight = 
        `${panelRange.min + (panelRange.max - panelRange.min) * clampedRatio}px`;
    }

    return { dynamicPanelRight, dynamicButtonRight };
  }, [bookWidth, isLeftPanelPinned, mainPanel]);

  const handleButtonClick = (name, position) => {
    const newPanel = { name, position };

    if (position === "left") {
      setLeftPanelOpen(true);
      setTimeout(() => setIsLeftOpening(true), 0);
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
      setTimeout(() => setIsMainOpening(true), 0);
    }
  };

  const handleCloseMainPanel = (nextPanel = null) => {
    setIsMainClosing(true);
    setIsMainOpening(false);

    if (nextPanel) {
      setPendingPanel(nextPanel);
    }

    setTimeout(() => {
      setMainPanel(null);
      setIsMainClosing(false);
    }, 300);
  };

  const handlePinLeftPanel = () => {
    const nextPinnedState = !isLeftPanelPinned;
    setIsLeftPanelPinned(nextPinnedState);
    setBookWidth(nextPinnedState ? 79 : 100);
  };

  const handleCloseLeftPanel = () => {
    setIsLeftClosing(true);
    setIsLeftOpening(false);

    setTimeout(() => {
      setLeftPanelOpen(false);
      setIsLeftClosing(false);
      setIsLeftPanelPinned(false);
      setBookWidth(100);
    }, 300);
  };

  // Utility function
  const getIconForPanel = (name) => {
    switch (name) {
      case "Bookmarks":
        return <IoBookmarks size={20} />;
      case "Appearance":
        return <IoColorPaletteSharp size={20} />;
      case "Reading Style":
        return <BsGrid1X2Fill size={18} />;
      case "Statistics":
        return <FaChartBar size={20} />;
      case "Ask AI":
        return <BsChatLeftDotsFill size={18} />;
    }
  };

  useEffect(() => {
    if (!isMainClosing && pendingPanel) {
      setMainPanel(pendingPanel);
      setPendingPanel(null);
      requestAnimationFrame(() => {
        setIsMainOpening(true);
      });
    }
  }, [isMainClosing, pendingPanel]);

  const handleMouseDown = (e) => {
    e.preventDefault();

    const startX = e.clientX;
    const containerWidth = containerRef.current.offsetWidth;
    const initialBookWidthPx = (bookWidth / 100) * containerWidth;

    const onMouseMove = (e) => {
      const deltaX = e.clientX - startX;
      const newBookWidthPx = initialBookWidthPx - deltaX;
      const newBookWidthPercent = (newBookWidthPx / containerWidth) * 100;

      // Clamp the width between 75% and 85%
      const clampedWidth = Math.min(Math.max(newBookWidthPercent, 75), 85);

      setBookWidth(clampedWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const panelContentMap = {
    'Bookmarks': <Bookmarks openedAt={Date.now()} onBookmarkItemDoubleClick={onBookmarkSelect} />,
    'Appearance': <span>this is the content of the Appearance</span>,
    'Reading Style': <span>this is the content of the Reading Styles</span>,
    'Statistics': <span>this is the content of the Statistics</span>,
    'Ask AI': <span>this is the content of the Ask AI</span>
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
        rightOffset={dynamicButtonRight} // Pass the dynamic button offset 
      />

      {/* Left Panel */}
      {leftPanelOpen && (
        <div
          className={`
            ${styles.panel}
            ${styles.left}
            ${isLeftOpening && !isLeftClosing ? styles.open : ""}
            ${isLeftClosing ? styles.closing : ""}
          `}
          style={
            isLeftPanelPinned
              ? {
                  width: `${100 - bookWidth}%`,
                  minWidth: "15%",
                  maxWidth: "25%",
                  height: "100%",
                  top: "69px",
                  borderRadius: "0px",
                }
              : {}
          }
        >
          <div className={styles.panelHeader}>
            <IoCloseCircleSharp
              className={"closeBtn"}
              color="#e53e3e"
              onClick={handleCloseLeftPanel}
              size={25}
            />
            {isLeftPanelPinned ? (
              <BsPinFill
                onClick={handlePinLeftPanel}
                className={"panelPinBtn"}
                size={18}
              />
            ) : (
              <BsPinAngleFill
                onClick={handlePinLeftPanel}
                className={"panelPinBtn"}
                size={18}
              />
            )}
            <div className={styles.panelContent}>
              <span className={styles.headerTopic}>
                <LuNotebookText size={20} /> Notes
              </span>
            </div>
          </div>
          <div className={styles.panelBody} 
            style={{
              backgroundColor: 'white',
            }}>
            <Note />
          </div>
          {isLeftPanelPinned && (
            <div className={styles.resizer} onMouseDown={handleMouseDown} />
          )}
        </div>
      )}

      {/* Main Panel: right or bottom */}
      {mainPanel && (
        <div
          className={`
            ${styles.panel}
            ${styles[mainPanel.position]}
            ${isMainOpening && !isMainClosing ? styles.open : ""}
            ${isMainClosing ? styles.closing : ""}
          `}
          style={
            mainPanel.position === "bottom" && isLeftPanelPinned
              ? { right: dynamicPanelRight  }
              : undefined
          }
        >
          <div className={styles.panelHeader}>
            <IoCloseCircleSharp
              className={`${styles.closeButton} closeBtn`}
              color="#e53e3e"
              onClick={() => handleCloseMainPanel()}
              size={25}
            />
            <div className={styles.panelContent}>
              <span className={styles.headerTopic}> {getIconForPanel(mainPanel.name)} {mainPanel.name}</span>
            </div>
          </div>
          <div className={styles.panelBody}>
            {panelContentMap[mainPanel.name] || ''}
          </div>
        </div>
      )}
    </>
  );
}
