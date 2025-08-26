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

};
