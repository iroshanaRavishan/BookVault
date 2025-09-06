import { useState } from "react";
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
    onSet("12:00 AM"); // notify parent
  };

  return (
    <div className={styles.container}>
      Time Picker
    </div>
  );
}
