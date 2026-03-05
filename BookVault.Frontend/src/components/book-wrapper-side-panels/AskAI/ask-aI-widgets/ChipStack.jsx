import { useEffect, useState } from "react";
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
  const [chips, setChips] = useState(initialChips);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // start animation
      setAnimate(true);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.track}
        style={{
          transform: animate ? "translateY(-36px)" : "translateY(0)",
          transition: animate ? "transform 0.6s ease-in-out" : "none",
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
