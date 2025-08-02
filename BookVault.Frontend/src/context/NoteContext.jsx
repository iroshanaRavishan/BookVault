import { createContext, useContext, useState } from 'react';

// Create the context
const NoteContext = createContext();

// Provider component
export const NoteProvider = ({ children }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  return (
    <NoteContext.Provider value={{ hasUnsavedChanges, setHasUnsavedChanges }}>
      {children}
    </NoteContext.Provider>
  );
};
