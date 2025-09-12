// Centralized helpers for applying theme and appearance settings globally

// Background color
export function applyColor(color) {
  document.documentElement.style.setProperty("--flipbook-bg", color);
}

// Page margin
export function applyMargin(isEnabled) {
  const marginValue = isEnabled ? "45px" : "0px";
  document.documentElement.style.setProperty("--flipbook-margin", marginValue);
}

// Brightness
export function applyBrightness(brightness) {
  document.documentElement.style.setProperty("--flipbook-brightness", brightness);
}

// Bookmark dimming
export function applyBookmarkDim(isDimmed) {
  const newActiveValue = isDimmed ? 0.5 : 1;
  const newInactiveValue = isDimmed ? 0.2 : 0.5;

  const activebookmarkOpacity = Math.min(1, Math.max(0.3, newActiveValue));
  const inactivebookmarkOpacity = Math.min(1, Math.max(0.3, newInactiveValue));

  document.documentElement.style.setProperty("--active-bookmark-opacity", activebookmarkOpacity);
  document.documentElement.style.setProperty("--inactive-bookmark-opacity", inactivebookmarkOpacity);
}

// Focus mode
export function applyFocusMode(isFocus) {
  window.dispatchEvent(new Event("closeAllSideButtons"));
  document.documentElement.style.setProperty("--flipbook-bg-opacity", "0.5");
}
