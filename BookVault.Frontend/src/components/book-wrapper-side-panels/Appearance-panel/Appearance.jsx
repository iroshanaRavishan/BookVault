import { useState } from "react";
import styles from './appearance.module.css';

export default function Appearance() {
  const [color, setColor] = useState("#f1c40f"); // default yellow
  const [marginEnabled, setMarginEnabled] = useState(true); // default ON (45px)
  const [brightness, setBrightness] = useState(1); // default brightness

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setColor(newColor);

    // update CSS variable globally
    document.documentElement.style.setProperty("--flipbook-bg", newColor);
  };

  const handleMarginToggle = (e) => {
    const isChecked = e.target.checked;
    setMarginEnabled(isChecked);

    // update CSS variable globally
    document.documentElement.style.setProperty("--flipbook-margin", isChecked ? "45px" : "0px");
  };

  return (
    <div className={styles.AppearancePanel}>
      <div>
        <div className={styles.appearanceOptions}>
          <label>Choose FlipBook Background: </label>
          <input type="color" value={color} onChange={handleColorChange} />
        </div>

        <div className={styles.appearanceOptions}>
          <label>
            <input
              type="checkbox"
              checked={marginEnabled}
              onChange={handleMarginToggle}
            />
            Enable Page Margin
          </label>
        </div>

        <div className={styles.appearanceOptions}>
          <label htmlFor="brightness-slider">Brightness: </label>
        </div>
      </div>

      <div className={styles.appearanceActions}>
        <button>Cancel</button>
        <button>Save</button>
      </div>
    </div>
  );
}
