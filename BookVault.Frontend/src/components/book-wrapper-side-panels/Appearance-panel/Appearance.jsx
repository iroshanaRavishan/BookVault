import { useState } from "react";
import styles from './appearance.module.css';

export default function Appearance() {
  const [color, setColor] = useState("#f1c40f"); // default yellow
  const [marginEnabled, setMarginEnabled] = useState(true); // default ON (45px)
  const [brightness, setBrightness] = useState(1); // default brightness
  const [isDarkTheme, setIsDarkTheme] = useState(false); // default light

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

  const handleBrightnessChange = (e) => {
    const newValue = Number(e.target.value);
    setBrightness(newValue);
    document.documentElement.style.setProperty("--flipbook-brightness", newValue);
  };

  const handleThemeToggle = () => {
    setIsDarkTheme((prev) => {
      const newTheme = !prev;

      if (newTheme) {
        // Dark theme
        document.documentElement.style.setProperty("--panel-header", "#333");
        document.documentElement.style.setProperty("--panel-header-name-color", "#fff");  
        document.documentElement.style.setProperty("--panel-body-bg", "#333");
        document.documentElement.style.setProperty("--note-panel-toolbar", "#333");
        document.documentElement.style.setProperty("--note-quill-item-color", "#ffffffff");
        document.documentElement.style.setProperty("--note-quill-item-background-hover-color", "#acacacff");
        document.documentElement.style.setProperty("--undo-redo-action-button-border-color", "#8f8f8fff");
        document.documentElement.style.setProperty("--undo-redo-action-button-bg-color", "#e9e9e9ff");
        document.documentElement.style.setProperty("--undo-redo-action-button-hover-bg-color", "#c4c4c4ff");
        document.documentElement.style.setProperty("--undo-redo-action-button-item-color", "#3d3d3dff");
        document.documentElement.style.setProperty("--note-detail-bar-bg", "#2b2b2b");
        document.documentElement.style.setProperty("--note-detail-bar-text-color", "#bebebeff");
        document.documentElement.style.setProperty("--note-character-limit-text", "#bebebeff");
        document.documentElement.style.setProperty("--note-action-bg", "#2b2b2b");
        document.documentElement.style.setProperty("--note-navigation-button-bg", "#f3f3f3");
        document.documentElement.style.setProperty("--note-navigation-button-border-color", "#8f8f8fff");
        document.documentElement.style.setProperty("--note-navigation-button-hover-bg-color", "#c4c4c4ff");
        document.documentElement.style.setProperty("--note-settings-button-background-color", "#e9e9e9ff");
        document.documentElement.style.setProperty("--note-settings-button-border-color", "#8f8f8fff");
      } else {
        // Light theme
        document.documentElement.style.setProperty("--panel-header", "#fff");
        document.documentElement.style.setProperty("--panel-header-name-color", "#111");
        document.documentElement.style.setProperty("--panel-body-bg", "#ffffffff");
        document.documentElement.style.setProperty("--note-panel-toolbar", "#fff");
        document.documentElement.style.setProperty("--note-quill-item-color", "#000000");
        document.documentElement.style.setProperty("--note-quill-item-background-hover-color", "#0000001e");
        document.documentElement.style.setProperty("--undo-redo-action-button-border-color", "#bbbbbbff");
        document.documentElement.style.setProperty("--undo-redo-action-button-bg-color", "#d3d3d3ff");
        document.documentElement.style.setProperty("--undo-redo-action-button-hover-bg-color", "#acacacff");
        document.documentElement.style.setProperty("--undo-redo-action-button-item-color", "#3a3a3aff");
        document.documentElement.style.setProperty("--note-detail-bar-bg", "#fff");
        document.documentElement.style.setProperty("--note-detail-bar-text-color", "#666");
        document.documentElement.style.setProperty("--note-character-limit-text", "gray");
        document.documentElement.style.setProperty("--note-action-bg", "#fff");
        document.documentElement.style.setProperty("--note-navigation-button-bg", "#d3d3d3ff");
        document.documentElement.style.setProperty("--note-navigation-button-border-color", "#bbbbbbff");
        document.documentElement.style.setProperty("--note-navigation-button-hover-bg-color", "#acacacff");
        document.documentElement.style.setProperty("--note-settings-button-background-color", "#d3d3d3ff");
        document.documentElement.style.setProperty("--note-settings-button-border-color", "#bbbbbbff");
      }
      return newTheme;
    });
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
          <input
            id="brightness-slider"
            type="range"
            min="0.8"
            max="1.2"
            step="0.01"
            value={brightness}
            onChange={handleBrightnessChange}
          />
        </div>

        <div className={styles.appearanceOptions}>
          <label>Theme: </label>
          <button onClick={handleThemeToggle}>
            {isDarkTheme ? "Switch to Light" : "Switch to Dark"}
          </button>
        </div>
      </div>

      <div className={styles.appearanceActions}>
        <button>Cancel</button>
        <button>Save</button>
      </div>
    </div>
  );
}
