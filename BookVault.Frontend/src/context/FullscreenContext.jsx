import { createContext, useContext, useState, useEffect } from "react";

// Create the context
const FullscreenContext = createContext();

// Provider component
export const FullscreenProvider = ({ children }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenToggle = () => {
    if (!isFullScreen) {
      document.documentElement.requestFullscreen?.();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullScreen(false);
    }
  };

  // Sync state if user exits fullscreen with ESC or browser UI
  useEffect(() => {
    const onChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

};
