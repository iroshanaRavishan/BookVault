import { useEffect, useRef, useState } from "react";
import styles from './appearance.module.css';
import { useFullscreenContext } from "../../../context/FullscreenContext";
import TimePicker from "../../time-picker/TimePicker";
import { applyTheme, applyColor } from "../../../utils/applyThemeHelpers";

export default function Appearance() {
  const [color, setColor] = useState("#f1c40f"); // default yellow
  const [marginEnabled, setMarginEnabled] = useState(true); // default ON (45px)
  const [brightness, setBrightness] = useState(1); // default brightness
  const [isDarkTheme, setIsDarkTheme] = useState(false); // default light
  const [isDimmed, setIsDimmed] = useState(false); // toggler state
  const [isFocusMode, setIsFocusMode] = useState(false); // focus mode state
  const [isAutoThemeEnabled, setIsAutoThemeEnabled] = useState(false);
  const [fromTime, setFromTime] = useState(null);
  const [toTime, setToTime] = useState(null);
  const [buttonsDisabled, setButtonsDisabled] = useState(true);
  const [fromCurrent, setFromCurrent] = useState("12:00 AM");
  const [toCurrent, setToCurrent] = useState("12:00 AM");
  
  const fromTimeRef = useRef();
  const toTimeRef = useRef();
  const darkTimerRef = useRef(null);
  const lightTimerRef = useRef(null);

  const { isFullScreen, handleFullScreenToggle } = useFullscreenContext();

  useEffect(() => {
    if (!isAutoThemeEnabled) {
      setButtonsDisabled(true);
      return;
    }

    const fromNorm = normalizeTimeString(fromCurrent);
    const toNorm = normalizeTimeString(toCurrent);

    setButtonsDisabled(fromNorm === toNorm);
  }, [fromCurrent, toCurrent, isAutoThemeEnabled]);

  useEffect(() => {
    // clear any existing timers
    if (darkTimerRef.current) clearTimeout(darkTimerRef.current);
    if (lightTimerRef.current) clearTimeout(lightTimerRef.current);

    if (!isAutoThemeEnabled || !fromTime || !toTime) return;

    // Set correct theme immediately (no drift)
    const darkNow = isNowWithinRange(fromTime, toTime);
    setIsDarkTheme(darkNow);
    applyTheme(darkNow);

    // Schedule next dark-on and light-on boundaries exactly
    const scheduleDark = () => {
      const when = nextOccurrence(fromTime);
      const delay = Math.max(0, when.getTime() - Date.now());
      darkTimerRef.current = setTimeout(() => {
        setIsDarkTheme(true);
        applyTheme(true);
        // reschedule for the next day
        scheduleDark();
      }, delay);
    };

    const scheduleLight = () => {
      const when = nextOccurrence(toTime);
      const delay = Math.max(0, when.getTime() - Date.now());
      lightTimerRef.current = setTimeout(() => {
        setIsDarkTheme(false);
        applyTheme(false);
        // reschedule for the next day
        scheduleLight();
      }, delay);
    };

    scheduleDark();
    scheduleLight();

    return () => {
      if (darkTimerRef.current) clearTimeout(darkTimerRef.current);
      if (lightTimerRef.current) clearTimeout(lightTimerRef.current);
    };
  }, [isAutoThemeEnabled, fromTime, toTime]);

  // Handler from time picker
  const handleSetTime = (type, timeString) => {
    if (type === "from") {
      setFromTime(timeString);
    } else if (type === "to") {
      setToTime(timeString);
    }
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    applyColor(newColor);
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

  const applyTheme = (dark) => {
    if (dark) {
      document.documentElement.style.setProperty("--header-pin-icon-color", "#fff");
      document.documentElement.style.setProperty("--panel-header", "#333");
      document.documentElement.style.setProperty("--panel-header-name-color", "#fff");  
      document.documentElement.style.setProperty("--panel-body-bg", "#3f3f3fff");
      document.documentElement.style.setProperty("--note-panel-toolbar", "#3f3f3fff");
      document.documentElement.style.setProperty("--note-quill-item-color", "#ffffffff");
      document.documentElement.style.setProperty("--note-quill-item-background-hover-color", "#acacacff");
      document.documentElement.style.setProperty("--undo-redo-action-button-border-color", "#8f8f8fff");
      document.documentElement.style.setProperty("--undo-redo-action-button-bg-color", "#e9e9e9ff");
      document.documentElement.style.setProperty("--undo-redo-action-button-hover-bg-color", "#c4c4c4ff");
      document.documentElement.style.setProperty("--undo-redo-action-button-item-color", "#3d3d3dff");
      document.documentElement.style.setProperty("--note-detail-bar-bg", "#3f3f3fff");
      document.documentElement.style.setProperty("--note-section-text-color", "#bebebeff");
      document.documentElement.style.setProperty("--note-action-bg", "#3f3f3fff");
      document.documentElement.style.setProperty("--note-navigation-button-bg", "#f3f3f3");
      document.documentElement.style.setProperty("--note-navigation-button-border-color", "#8f8f8fff");
      document.documentElement.style.setProperty("--note-navigation-button-hover-bg-color", "#c4c4c4ff");
      document.documentElement.style.setProperty("--note-settings-button-background-color", "#e9e9e9ff");
      document.documentElement.style.setProperty("--note-settings-button-border-color", "#8f8f8fff");
      document.documentElement.style.setProperty("--note-clear-button-border-color", "#8f8f8fff");
      document.documentElement.style.setProperty("--note-delete-button-border-color", "#8f8f8fff");
      document.documentElement.style.setProperty("--note-navigation-highlighted-note-bg", "#c4c4c4ff");
      document.documentElement.style.setProperty("--note-navigation-non-heighlighted-button-text-color", "#ffffffff");
      document.documentElement.style.setProperty("--note-navigation-highlighted-note-number-hover-bg-color", "#c4c4c4b6");
      document.documentElement.style.setProperty("--note-settings-button-hover-bg-color", "#c4c4c4ff");
      document.documentElement.style.setProperty("--note-action-button-bg-color", "#ffffffff");
      document.documentElement.style.setProperty("--note-action-button-text-color", "#000000ff");
      document.documentElement.style.setProperty("--note-action-button-hover-bg-color", "#c4c4c4ff");
      document.documentElement.style.setProperty("--note-action-button-disabled-bg-color", "#ffffffff");
      document.documentElement.style.setProperty("--note-action-button-disabled-text-color", "#858585ff");
      document.documentElement.style.setProperty("--editor-bg-color", "#dbdbdbff");
      document.documentElement.style.setProperty("--editor-line-color", "#808080ff");

      document.documentElement.style.setProperty("--bookmark-action-button-bg-color", "#ffffffff");
      document.documentElement.style.setProperty("--bookmark-action-button-text-color", "#000000ff");
      document.documentElement.style.setProperty("--bookmark-section-text-color", "#bebebeff");
      document.documentElement.style.setProperty("--bookmark-list-item-bg-color", "#1f1f1fb7");
      document.documentElement.style.setProperty("--bookmark-list-item-hover-number-color", "#ffffffd2");
      document.documentElement.style.setProperty("--bookmark-list-action-button-bg-color", "#dddddd25");
      document.documentElement.style.setProperty("--bookmark-thumbnail-section-header-bg-color", "#616161ff");
      document.documentElement.style.setProperty("--bookmark-list-action-button-color", "#1a1a1aff");
      document.documentElement.style.setProperty("--bookmark-list-action-button-hover-bg-color", "#acacacff");
      document.documentElement.style.setProperty("--bookmark-page-preview-border-color", "#e0e0e0ff");
      document.documentElement.style.setProperty("--bookmark-action-button-disabled-bg-color", "#ffffffff");
      document.documentElement.style.setProperty("--bookmark-action-button-disabled-text-color", "#858585ff");
      document.documentElement.style.setProperty("--bookmark-page-preview-header-text-color", "#e0e0e0ff");

      document.documentElement.style.setProperty("--book-reading-board-side-button-bg-color", "#333");
      document.documentElement.style.setProperty("--book-reading-board-side-button-text-color", "#fff");

      document.documentElement.style.setProperty("--appearance-action-button-bg-color", "#ffffffff");
      document.documentElement.style.setProperty("--appearance-action-button-text-color", "#000000ff");
      document.documentElement.style.setProperty("--appearance-action-button-hover-bg-color", "#c4c4c4ff");
      document.documentElement.style.setProperty("--appearance-action-button-disabled-bg-color", "#ffffffff");
      document.documentElement.style.setProperty("--appearance-action-button-disabled-text-color", "#858585ff");
      document.documentElement.style.setProperty("--appearance-section-text-color", "#ffffffff");
      document.documentElement.style.setProperty("--appearance-section-sub-text-color", "#dddddd");
      document.documentElement.style.setProperty("--appearance-color-picker-button-border-color", "#e9e9e9ff");
      document.documentElement.style.setProperty("--appearance-toggle-slider-bg-color", "#000");
      document.documentElement.style.setProperty("--appearance-toggle-slider-border-color", "#fff");
      document.documentElement.style.setProperty("--appearance-toggle-bg-unchecked-color", "#8f8f8fff");
      document.documentElement.style.setProperty("--appearance-toggle-bg-checked-color", "#ddddddff");

    } else {
      document.documentElement.style.setProperty("--header-pin-icon-color", "black");
      document.documentElement.style.setProperty("--panel-header", "#fff");
      document.documentElement.style.setProperty("--panel-header-name-color", "#111");
      document.documentElement.style.setProperty("--panel-body-bg", "#f1f1f1ff");
      document.documentElement.style.setProperty("--note-panel-toolbar", "#f1f1f1ff");
      document.documentElement.style.setProperty("--note-quill-item-color", "#000000");
      document.documentElement.style.setProperty("--note-quill-item-background-hover-color", "#0000001e");
      document.documentElement.style.setProperty("--undo-redo-action-button-border-color", "#bbbbbbff");
      document.documentElement.style.setProperty("--undo-redo-action-button-bg-color", "#d3d3d3ff");
      document.documentElement.style.setProperty("--undo-redo-action-button-hover-bg-color", "#acacacff");
      document.documentElement.style.setProperty("--undo-redo-action-button-item-color", "#3a3a3aff");
      document.documentElement.style.setProperty("--note-detail-bar-bg", "#f1f1f1ff");
      document.documentElement.style.setProperty("--note-section-text-color", "#666");
      document.documentElement.style.setProperty("--note-action-bg", "#f1f1f1ff");
      document.documentElement.style.setProperty("--note-navigation-button-bg", "#d3d3d3ff");
      document.documentElement.style.setProperty("--note-navigation-button-border-color", "#bbbbbbff");
      document.documentElement.style.setProperty("--note-navigation-button-hover-bg-color", "#acacacff");
      document.documentElement.style.setProperty("--note-settings-button-background-color", "#d3d3d3ff");
      document.documentElement.style.setProperty("--note-settings-button-border-color", "#bbbbbbff");
      document.documentElement.style.setProperty("--note-settings-button-hover-bg-color", "#acacacff");
      document.documentElement.style.setProperty("--note-clear-button-border-color", "#bbbbbbff");
      document.documentElement.style.setProperty("--note-delete-button-border-color", "#bbbbbbff");
      document.documentElement.style.setProperty("--note-navigation-highlighted-note-bg", "#bbbbbbff");
      document.documentElement.style.setProperty("--note-navigation-non-heighlighted-button-text-color", "#000000");
      document.documentElement.style.setProperty("--note-navigation-highlighted-note-number-hover-bg-color", "#acacac8f");
      document.documentElement.style.setProperty("--note-action-button-bg-color", "#313131ff");
      document.documentElement.style.setProperty("--note-action-button-text-color", "#ffffffff");
      document.documentElement.style.setProperty("--note-action-button-hover-bg-color", "#8b8b8bff");
      document.documentElement.style.setProperty("--note-action-button-disabled-bg-color", "#727272ff");
      document.documentElement.style.setProperty("--note-action-button-disabled-text-color", "#ffffffff");
      document.documentElement.style.setProperty("--editor-bg-color", "#fafafaff");
      document.documentElement.style.setProperty("--editor-line-color", "#bdbdbdff");

      document.documentElement.style.setProperty("--bookmark-action-button-bg-color", "#313131ff");
      document.documentElement.style.setProperty("--bookmark-action-button-text-color", "#ffffffff");
      document.documentElement.style.setProperty("--bookmark-section-text-color", "#666");
      document.documentElement.style.setProperty("--bookmark-list-item-bg-color", "#ecececff");
      document.documentElement.style.setProperty("--bookmark-list-item-hover-number-color", "#474747ff");
      document.documentElement.style.setProperty("--bookmark-list-action-button-bg-color", "#e0e0e0ff");
      document.documentElement.style.setProperty("--bookmark-thumbnail-section-header-bg-color", "#838383ff");
      document.documentElement.style.setProperty("--bookmark-list-action-button-color", "#3b3b3b");
      document.documentElement.style.setProperty("--bookmark-list-action-button-hover-bg-color", "#c5c5c5");
      document.documentElement.style.setProperty("--bookmark-page-preview-border-color", "#5e5e5eff");
      document.documentElement.style.setProperty("--bookmark-action-button-disabled-bg-color", "#727272ff");
      document.documentElement.style.setProperty("--bookmark-action-button-disabled-text-color", "#ffffffff");
      document.documentElement.style.setProperty("--bookmark-page-preview-header-text-color", "#fff");

      document.documentElement.style.setProperty("--book-reading-board-side-button-bg-color", "#fff");
      document.documentElement.style.setProperty("--book-reading-board-side-button-text-color", "#333");

      document.documentElement.style.setProperty("--appearance-action-button-bg-color", "#313131ff");
      document.documentElement.style.setProperty("--appearance-action-button-text-color", "#ffffffff");
      document.documentElement.style.setProperty("--appearance-action-button-hover-bg-color", "#8b8b8bff");
      document.documentElement.style.setProperty("--appearance-action-button-disabled-bg-color", "#727272ff");
      document.documentElement.style.setProperty("--appearance-action-button-disabled-text-color", "#ffffffff");
      document.documentElement.style.setProperty("--appearance-section-text-color", "#000000ff");
      document.documentElement.style.setProperty("--appearance-section-sub-text-color", "#252525ff");
      document.documentElement.style.setProperty("--appearance-color-picker-button-border-color", "#888888");
      document.documentElement.style.setProperty("--appearance-toggle-slider-bg-color", "#fff");
      document.documentElement.style.setProperty("--appearance-toggle-slider-border-color", "#000");
      document.documentElement.style.setProperty("--appearance-toggle-bg-unchecked-color", "#ccc");
      document.documentElement.style.setProperty("--appearance-toggle-bg-checked-color", "#797979");
    }
  };

  const handleThemeToggle = () => {
    setIsDarkTheme((prev) => {
      const newTheme = !prev;
      applyTheme(newTheme);
      return newTheme;
    });
  };

  const handleBookmarkBrightnessChange = () => {
    const newActiveValue = isDimmed ? 1 : 0.5; 
    const newInactiveValue = isDimmed ? 0.5 : 0.2; 
    setIsDimmed(!isDimmed);

    // Adjust bookmark dimming (inverse relationship)
    const activebookmarkOpacity = Math.min(1, Math.max(0.3, newActiveValue));
    const inactivebookmarkOpacity = Math.min(1, Math.max(0.3, newInactiveValue));

    document.documentElement.style.setProperty("--active-bookmark-opacity", activebookmarkOpacity);
    document.documentElement.style.setProperty("--inactive-bookmark-opacity", inactivebookmarkOpacity);
  };

  const handleFocusModeToggle = () => {
    setIsFocusMode((prev) => {
      const newFocusMode = !prev;

      if (newFocusMode) {
        // Close all opened side buttons
        window.dispatchEvent(new Event("closeAllSideButtons"));

        // Reduce background opacity
        document.documentElement.style.setProperty("--flipbook-bg-opacity", "0.5");
      } else {
        // restore full opacity
        document.documentElement.style.setProperty("--flipbook-bg-opacity", "1");
      }

      return newFocusMode;
    });
  };

  const parseTimeToHM = (t) => {
    const [hPart, rest] = t.split(":");
    const [mPart, ampm] = rest.split(" ");
    let h = parseInt(hPart, 10);
    const m = parseInt(mPart, 10);
    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    return { h24: h, m };
  };

  const dateForTodayTime = (t) => {
    const { h24, m } = parseTimeToHM(t);
    const d = new Date();
    d.setHours(h24, m, 0, 0);
    return d;
  };

  const nextOccurrence = (t) => {
    const now = new Date();
    const d = dateForTodayTime(t);
    if (d <= now) d.setDate(d.getDate() + 1);
    return d;
  };

  const isNowWithinRange = (fromT, toT) => {
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const f = parseTimeToHM(fromT);
    const t = parseTimeToHM(toT);
    const fromMin = f.h24 * 60 + f.m;
    const toMin = t.h24 * 60 + t.m;

    if (fromMin === toMin) return false; // same time -> treat as always light
    if (fromMin < toMin) {
      // same-day window
      return nowMin >= fromMin && nowMin < toMin;
    } else {
      // overnight window
      return nowMin >= fromMin || nowMin < toMin;
    }
  };

  const handleCurrentTimeChange = (type, timeString) => {
    const normalized = normalizeTimeString(timeString);
    if (type === "from") setFromCurrent(normalized);
    else setToCurrent(normalized);
  };

  const normalizeTimeString = (t) => {
    // ensures HH:MM AM/PM format
    const [hPart, rest] = t.split(":");
    const [mPart, ampm] = rest.split(" ");
    const h = parseInt(hPart, 10);
    const m = parseInt(mPart, 10);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className={styles.AppearancePanel}>
      <div>
        <div className={styles.appearanceOptions}>
          <span className={styles.sectionHeader}>Background</span>
          <div className={styles.appearanceOption}>
            <label>Choose FlipBook Background: </label>
            <input type="color" value={color} className={styles.colorPicker} onChange={handleColorChange} />
          </div>
        </div>

        <div className={styles.appearanceOptions}>
          <span className={styles.sectionHeader}>Bookmarks</span>
          <div className={styles.appearanceOption}>
            <label> Dim bookmarks  </label>
            <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={isDimmed}
                  onChange={handleBookmarkBrightnessChange}
                />
                <span className={styles.slider}></span>
            </label>
          </div>
        </div>

        <div className={styles.appearanceOptions}>
          <span className={styles.sectionHeader}>Book</span>
          <div>
            <div className={styles.appearanceOption}>
              <label>Enable Page Margin</label>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={marginEnabled}
                  onChange={handleMarginToggle}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <div className={styles.appearanceOption}>
              <label>Brightness: </label>
              <input
                type="range"
                min="0.8"
                max="1.2"
                step="0.01"
                value={brightness}
                onChange={handleBrightnessChange}
                className={styles.birghnessSlider}
                style={{ "--value": `${((brightness - 0.8) / 0.4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className={styles.appearanceOptions} style={{marginBottom: '10px'}}>
          <span className={styles.sectionHeader}>Select your mode</span>
          <div>
            <div className={styles.appearanceOption}>
              <label>View: </label>
              <button onClick={handleFullScreenToggle} className={styles.toggleButton}>
                {isFullScreen ? "Exit Full Mode" : "Enter Full Mode"}
              </button>
            </div>
            <div className={styles.appearanceOption}>
              <label>Focus: </label>
              <button onClick={handleFocusModeToggle} className={styles.toggleButton}>
                {isFocusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
              </button>
            </div>
            <div className={styles.appearanceOption}>
              <label>Theme: </label>
              <button onClick={handleThemeToggle} className={styles.toggleButton} disabled={isAutoThemeEnabled}>
                {isDarkTheme ? "Switch to Light" : "Switch to Dark"}
              </button>
            </div>
            <span className={styles.themeDivider}>or</span>
            <div className={styles.appearanceOption} style={{width: '100%', marginTop: '0px'}}>
              <div className={styles.autoThemeSection}>
                <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <input
                    type="checkbox"
                    checked={isAutoThemeEnabled}
                    onChange={(e) => setIsAutoThemeEnabled(e.target.checked)}
                  />
                  <span style={{fontSize: '13px'}}>Automate Theme</span>
                </label>
                <div className={styles.timeRange}>
                  <div className={!isAutoThemeEnabled ? styles.disabledSection : ""}>
                    <span style={{ fontSize: "12px" }}>From : </span>
                    <TimePicker 
                      id="from" 
                      ref={fromTimeRef} 
                      isAutoThemeEnabled={isAutoThemeEnabled} 
                      onSet={(t) => handleSetTime("from", t)}  
                      onChange={(t) => handleCurrentTimeChange("from", t)}
                    />
                  </div>
                  <span className={styles.timePickerSeparator}></span>
                  <div className={!isAutoThemeEnabled ? styles.disabledSection : ""}>
                    <span style={{ fontSize: "12px" }}>To : </span>
                    <TimePicker 
                      id="to" 
                      ref={toTimeRef} 
                      isAutoThemeEnabled={isAutoThemeEnabled} 
                      onSet={(t) => handleSetTime("to", t)} 
                      onChange={(t) => handleCurrentTimeChange("to", t)}
                    />
                  </div>
                </div>
                <div className={styles.buttonGroup}>
                  <button
                    className={styles.setButton}
                    onClick={() => {
                      fromTimeRef.current?.handleReset();
                      toTimeRef.current?.handleReset();
                      setButtonsDisabled(true);
                    }}
                    disabled={buttonsDisabled}
                  >
                    Reset time
                  </button>
                  <button
                    className={styles.setButton}
                    onClick={() => {
                      fromTimeRef.current?.handleSet();
                      toTimeRef.current?.handleSet();
                    }}
                    disabled={buttonsDisabled}
                  >
                    Set time
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
