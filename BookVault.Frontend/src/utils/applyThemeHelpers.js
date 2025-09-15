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
  if (isFocus) {
    window.dispatchEvent(new Event("closeAllSideButtons"));
    document.documentElement.style.setProperty("--flipbook-bg-opacity", "0.5");
  } else {
    document.documentElement.style.setProperty("--flipbook-bg-opacity", "1");
  }
}

// Dark / Light Theme
export function applyTheme(isDark) {
  if (isDark) {
    // Dark theme overrides
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
    document.documentElement.style.setProperty("--note-clear-button-text-disabled-color", "#ffffffff");
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

    document.documentElement.style.setProperty("--appearance-confirm-button-border-color", "#8f8f8fff");
    document.documentElement.style.setProperty("--appearance-confirm-button-text-disabled-color", "#ffffffff");
    document.documentElement.style.setProperty("--appearance-reset-button-border-color", "#8f8f8fff");
  } else {
    // Light theme overrides
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
    document.documentElement.style.setProperty("--note-clear-button-text-disabled-color", "#8f8f8fff");
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

    document.documentElement.style.setProperty("--appearance-confirm-button-border-color", "#bbbbbbff");
    document.documentElement.style.setProperty("--appearance-confirm-button-text-disabled-color", "#8f8f8fff");
    document.documentElement.style.setProperty("--appearance-reset-button-border-color", "#bbbbbbff");
  }
}
