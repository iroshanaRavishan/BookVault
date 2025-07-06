import React, { useRef, useEffect, useState } from "react";
import BoolReadingBoardSideButton from "./BoolReadingBoardSideButton";

const rightButtonData = [
  "Appearance",
  "Reading Style",
  "Bookmarks",
  "Statistics",
];

const leftButtonData = ["Notes"];

export default function SideButtonsWrapper() {
  const [rightOffsets, setRightOffsets] = useState([]);
  const [leftOffsets, setLeftOffsets] = useState([]);

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

  return (
    <>
      {rightButtonData.map((label, index) => (
        <BoolReadingBoardSideButton
          key={`right-${index}`}
          name={label}
          top={rightOffsets[index] || 132}
          ref={(el) => (rightRefs.current[index] = el)}
          position="right"
        />
      ))}
      {leftButtonData.map((label, index) => (
        <BoolReadingBoardSideButton
          key={`left-${index}`}
          name={label}
          top={leftOffsets[index] || 132}
          ref={(el) => (leftRefs.current[index] = el)}
          position="left"
        />
      ))}
    </>
  );
}
