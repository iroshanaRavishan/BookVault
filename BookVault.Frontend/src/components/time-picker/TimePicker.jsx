import React from "react";
import styles from './timepicker.module.css';

export default function TimePicker({ isAutoThemeEnabled, onSet }) {
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [ampm, setAmpm] = useState("AM");
  return (
    <div className={styles.container}>
      Time Picker
    </div>
  );
}
