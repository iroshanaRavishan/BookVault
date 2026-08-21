import { createContext, useContext, useState } from "react";

const FlipBookContext = createContext(null);

// Custom hook (cleaner usage)
export const useFlipBook = () => {
  const context = useContext(FlipBookContext);
  if (!context) {
    throw new Error("useFlipBook must be used inside FlipBookProvider");
  }
  return context;
};

export const FlipBookProvider = ({ children }) => {
  const [currentPageInfo, setCurrentPageInfo] = useState({
    left: 0,
    right: 1,
    total: 0
  });

  return (
    <FlipBookContext.Provider
      value={{
        currentPageInfo,
        setCurrentPageInfo
      }}
    >
      {children}
    </FlipBookContext.Provider>
  );
};
