import { useState } from "react";
import styles from './appearance.module.css';

export default function Appearance() {
  const [color, setColor] = useState("#f1c40f"); // default yellow

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setColor(newColor);

    // update CSS variable globally
    document.documentElement.style.setProperty("--flipbook-bg", newColor);
  };

  return (
    <div className={styles.AppearancePanel}>
      <div>
        <div className={styles.appearanceOptions}>
            <label>Choose FlipBook Background: </label>
            <input type="color" value={color} onChange={handleColorChange} />
        </div>
      </div>
      <div className={styles.appearanceActions}>
          <button>Cancel</button>
          <button>Save</button>
      </div>
    </div>
  );
}