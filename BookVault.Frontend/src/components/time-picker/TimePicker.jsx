import React from "react";
import styles from './timepicker.module.css';

export default function TimePicker({ isAutoThemeEnabled, onSet }) {
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [ampm, setAmpm] = useState("AM");

  const increment = (type) => {
    if (type === "hour") {
      setHour((prev) => (prev === 12 ? 1 : prev + 1));
    } else if (type === "minute") {
      setMinute((prev) => (prev === 59 ? 0 : prev + 1));
    } 
  };

  return (
    <div className={styles.container}>
      Time Picker
    </div>
  );
}
