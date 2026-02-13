import React from "react";
import styles from "./ChipStack.module.css";

const initialChips = [
  "Ask about this book",
  "Get a chapter-wise summary",
  "Want highlights instead of full reading?",
  "Get a quick summary",
  "Not sure where to start? Ask me anything",
  "Explain this chapter",
  "Need help understanding this book?",
  "Summarize key points",
  "Need a quick overview of the story?"
];

export default function ChipStack() {

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.track}
        style={{
          transform: animate ? "translateY(-36px)" : "translateY(0)"
        }}
      >
        {chips.map((text, i) => (
          <div key={i} className={styles.chip}>
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}
