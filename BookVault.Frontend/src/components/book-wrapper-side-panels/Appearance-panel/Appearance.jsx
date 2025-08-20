import { useState } from "react";
import styles from './appearance.module.css';

export default function Appearance() {
  const [color, setColor] = useState("#f1c40f"); // default yellow
  const [marginEnabled, setMarginEnabled] = useState(true); // default ON (45px)

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setColor(newColor);

    // update CSS variable globally
    document.documentElement.style.setProperty("--flipbook-bg", newColor);
  };

  const handleMarginToggle = (e) => {
    const isChecked = e.target.checked;
    setMarginEnabled(isChecked);
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
