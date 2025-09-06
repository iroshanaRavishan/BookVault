import { useState } from "react";
import styles from './timepicker.module.css';
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

export default function TimePicker({ isAutoThemeEnabled, onSet }) {
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [ampm, setAmpm] = useState("AM");

  const increment = (type) => {
    if (type === "hour") {
      setHour((prev) => (prev === 12 ? 1 : prev + 1));
    } else if (type === "minute") {
      setMinute((prev) => (prev === 59 ? 0 : prev + 1));
    } else {
      setAmpm((prev) => (prev === "AM" ? "PM" : "AM"));
    }
  };

  const decrement = (type) => {
    if (type === "hour") {
      setHour((prev) => (prev === 1 ? 12 : prev - 1));
    } else if (type === "minute") {
      setMinute((prev) => (prev === 0 ? 59 : prev - 1));
    } else {
      setAmpm((prev) => (prev === "AM" ? "PM" : "AM"));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.timePickerWrapper} style={{ opacity: isAutoThemeEnabled ? 1 : 0.4, pointerEvents: isAutoThemeEnabled ? 'auto' : 'none' }}>
        <div className={styles.timeColumn}>
            <button className={styles.timeChangeButton} onClick={() => increment("hour")}><FaChevronUp className={styles.timeChangeButtonIcon} /></button>
            <button className={styles.timeChangeButton}  onClick={() => decrement("hour")}><FaChevronDown className={styles.timeChangeButtonIcon} /></button>
        </div>
      </div>
    </div>
  );
}
