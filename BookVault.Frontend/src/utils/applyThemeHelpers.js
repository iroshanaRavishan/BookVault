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
