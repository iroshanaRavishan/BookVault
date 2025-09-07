import { useState, useImperativeHandle, forwardRef } from "react";
import styles from './timepicker.module.css';
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

const TimePicker = forwardRef(({ isAutoThemeEnabled, onSet }, ref) => {
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

  const handleSet = () => {
    const timeString = `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
    onSet(timeString); // send selected time back to parent
  };

  const handleReset = () => {
    setHour(12);
    setMinute(0);
    setAmpm("AM");
    onSet("12:00 AM");
  };

  // Expose functions to parent through ref
  useImperativeHandle(ref, () => ({
    handleSet,
    handleReset
  }));

  return (
    <div className={styles.container}>
      <div
        className={styles.timePickerWrapper}
        style={{
          opacity: isAutoThemeEnabled ? 1 : 0.4,
          pointerEvents: isAutoThemeEnabled ? "auto" : "none",
        }}
      >
        {/* Hour */}
        <div className={styles.timeColumn}>
          <button className={styles.timeChangeButton} onClick={() => increment("hour")}><FaChevronUp className={styles.timeChangeButtonIcon} /></button>
          <input
            type="number"
            value={hour.toString().padStart(2, "0")}
            onChange={(e) => {
              let val = parseInt(e.target.value, 10);
              if (isNaN(val)) val = 1;
              if (val < 1) val = 1;
              if (val > 12) val = 12;
              setHour(val);
            }}
            className={styles.timeInput}
          />
          <button className={styles.timeChangeButton} onClick={() => decrement("hour")}><FaChevronDown className={styles.timeChangeButtonIcon} /></button>
        </div>
        <span style={{ fontSize: "20px" }}>:</span>
        {/* Minute */}
        <div className={styles.timeColumn}>
          <button className={styles.timeChangeButton} >+</button>
          <button className={styles.timeChangeButton} >-</button>
        </div>
      </div>
    </div>
  );
});

export default TimePicker;
