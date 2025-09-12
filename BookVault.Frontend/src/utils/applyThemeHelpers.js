// Centralized helpers for applying theme and appearance settings globally

// Background color
export function applyColor(color) {
  document.documentElement.style.setProperty("--flipbook-bg", color);
}
