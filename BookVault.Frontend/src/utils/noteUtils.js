export const confirmUnsavedChanges = (hasUnsavedChanges) => {
  if (hasUnsavedChanges) {
    const shouldContinue = window.confirm("You have unsaved notes. Do you want to discard them?");
    if (!shouldContinue) return false;
  }

  return true;
};
