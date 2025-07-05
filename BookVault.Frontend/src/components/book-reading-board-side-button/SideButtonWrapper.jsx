import React, { useRef, useEffect, useState } from "react";
import BoolReadingBoardSideButton from "./BoolReadingBoardSideButton";

const buttonData = [
  "Appearance",
  "Reading Style",
  "Bookmarks",
  "Statistics",
];

export default function SideButtonsWrapper() {
  const [offsets, setOffsets] = useState([]);
  const refs = useRef([]);

  useEffect(() => {
    const newOffsets = [];
    let cumulativeOffset = 132; // starting top

    refs.current.forEach((el, idx) => {
      if (el) {
        const width = el.offsetWidth; // this becomes height after rotation
        newOffsets.push(cumulativeOffset);
        cumulativeOffset += width + 20; // add spacing
      }
    });

    setOffsets(newOffsets);
  }, []);

  return (
    <>
      {buttonData.map((label, index) => (
        <BoolReadingBoardSideButton
          key={index}
          name={label}
          top={offsets[index] || 132}
          ref={(el) => (refs.current[index] = el)}
        />
      ))}
    </>
  );
}
