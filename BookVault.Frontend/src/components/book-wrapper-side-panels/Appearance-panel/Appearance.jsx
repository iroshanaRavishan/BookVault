import { useEffect, useRef, useState } from "react";
import styles from './appearance.module.css';
import { useFullscreenContext } from "../../../context/FullscreenContext";
import TimePicker from "../../time-picker/TimePicker";
import { 
  applyTheme,
  applyColor,
  applyMargin,
  applyBrightness,
  applyBookmarkDim,
  applyFocusMode 
} from "../../../utils/applyThemeHelpers";

import { getAppearance, createAppearance, updateAppearance } from "../../../utils/appearanceService";

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
  const [appearanceId, setAppearanceId] = useState(() => {
    // Try to load saved ID from localStorage on initial render
    return localStorage.getItem("appearanceId") || null;
  });
  
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
    const fetchOrCreateAppearance = async () => {
      let data = null;

      if (appearanceId) {
        data = await getAppearance(appearanceId);
      }

        if (!data) {
          // POST default appearance
          const defaultPayload = {
            userId: "12345678-90ab-cdef-1234-567890abcdef",
            color: "#f1c40f",
            marginEnabled: true,
            brightness: 1,
            isDarkTheme: false,
            isDimmed: false,
            isFocusMode: false,
            isAutoThemeEnabled: false,
            fromTime: "12:00 AM",
            toTime: "12:00 AM",
          };

          const created = await createAppearance(defaultPayload);
          setAppearanceId(created.id);
          localStorage.setItem("appearanceId", created.id); // persist
        } 
    };

    fetchOrCreateAppearance();
  }, []);

  useEffect(() => {
    if (!appearanceId || !fromCurrent || !toCurrent) return;

    const payload = {
      userId: "12345678-90ab-cdef-1234-567890abcdef",
      color,
      marginEnabled,
      brightness,
      isDarkTheme,
      isDimmed,
      isFocusMode,
      isAutoThemeEnabled,
      fromTime,
      toTime,
    };

    const saveAppearance = async () => {
      try {
        await updateAppearance(appearanceId, payload);
      } catch (err) {
        console.error(err);
      }
    };

    saveAppearance();
  }, [
    appearanceId,
    color,
    marginEnabled,
    brightness,
    isDarkTheme,
    isDimmed,
    isFocusMode,
    isAutoThemeEnabled,
    fromTime,
    toTime,
    fromCurrent,
    toCurrent,
  ]);

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
    applyMargin(isChecked);
  };

  const handleBrightnessChange = (e) => {
    const newValue = Number(e.target.value);
    setBrightness(newValue);
    applyBrightness(newValue);
  };

  const handleThemeToggle = () => {
    setIsDarkTheme((prev) => {
      const newTheme = !prev;
      applyTheme(newTheme);
      return newTheme;
    });
  };

  const handleBookmarkBrightnessChange = () => {
    setIsDimmed((prev) => {
      const newVal = !prev;
      applyBookmarkDim(newVal);
      return newVal;
    });
  };

  const handleFocusModeToggle = () => {
    setIsFocusMode((prev) => {
      const newVal = !prev;
      applyFocusMode(newVal);
      return newVal;
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
