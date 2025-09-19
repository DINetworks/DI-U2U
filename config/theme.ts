// Custom CSS overrides for darker theme
export const darkThemeOverrides = `
/* Dark theme overrides for HeroUI components */

/* Input fields - darker backgrounds */
[data-theme="dark"] .heroui-input {
  background-color: #1f1f1f !important;
  border-color: #3f3f3f !important;
}

[data-theme="dark"] .heroui-input:hover {
  background-color: #2a2a2a !important;
  border-color: #5a5a5a !important;
}

[data-theme="dark"] .heroui-input:focus-within {
  background-color: #2a2a2a !important;
  border-color: #7a7a7a !important;
  box-shadow: 0 0 0 2px rgba(122, 122, 122, 0.2) !important;
}

[data-theme="dark"] .heroui-input input {
  color: #ffffff !important;
  background-color: transparent !important;
}

[data-theme="dark"] .heroui-input input::placeholder {
  color: #888888 !important;
}

/* Select components - darker backgrounds */
[data-theme="dark"] .heroui-select {
  background-color: #1f1f1f !important;
  border-color: #3f3f3f !important;
}

[data-theme="dark"] .heroui-select:hover {
  background-color: #2a2a2a !important;
  border-color: #5a5a5a !important;
}

[data-theme="dark"] .heroui-select:focus-within {
  background-color: #2a2a2a !important;
  border-color: #7a7a7a !important;
  box-shadow: 0 0 0 2px rgba(122, 122, 122, 0.2) !important;
}

[data-theme="dark"] .heroui-select .heroui-select-trigger {
  background-color: #1f1f1f !important;
  border-color: #3f3f3f !important;
  color: #ffffff !important;
}

[data-theme="dark"] .heroui-select .heroui-select-trigger:hover {
  background-color: #2a2a2a !important;
  border-color: #5a5a5a !important;
}

[data-theme="dark"] .heroui-select .heroui-select-trigger:focus {
  background-color: #2a2a2a !important;
  border-color: #7a7a7a !important;
}

/* Tabs - darker backgrounds */
[data-theme="dark"] .heroui-tabs {
  background-color: #0f0f0f !important;
}

[data-theme="dark"] .heroui-tabs .heroui-tabs-tab {
  background-color: #1a1a1a !important;
  border-color: #3f3f3f !important;
  color: #ffffff !important;
}

[data-theme="dark"] .heroui-tabs .heroui-tabs-tab:hover {
  background-color: #2a2a2a !important;
  border-color: #5a5a5a !important;
}

[data-theme="dark"] .heroui-tabs .heroui-tabs-tab[data-selected="true"] {
  background-color: #3a3a3a !important;
  border-color: #7a7a7a !important;
  color: #ffffff !important;
}

/* Cards - darker backgrounds */
[data-theme="dark"] .heroui-card {
  background-color: #1a1a1a !important;
  border-color: #3f3f3f !important;
}

/* Buttons - darker backgrounds */
[data-theme="dark"] .heroui-button {
  background-color: #2a2a2a !important;
  border-color: #4f4f4f !important;
  color: #ffffff !important;
}

[data-theme="dark"] .heroui-button:hover {
  background-color: #3a3a3a !important;
  border-color: #6f6f6f !important;
}

[data-theme="dark"] .heroui-button:focus {
  background-color: #3a3a3a !important;
  border-color: #8f8f8f !important;
  box-shadow: 0 0 0 2px rgba(143, 143, 143, 0.2) !important;
}

/* Modals - darker backgrounds */
[data-theme="dark"] .heroui-modal {
  background-color: #0f0f0f !important;
  border-color: #3f3f3f !important;
}

[data-theme="dark"] .heroui-modal .heroui-modal-body {
  background-color: #0f0f0f !important;
}

[data-theme="dark"] .heroui-modal .heroui-modal-header {
  background-color: #0f0f0f !important;
}

[data-theme="dark"] .heroui-modal .heroui-modal-footer {
  background-color: #0f0f0f !important;
}

/* Textarea - darker backgrounds */
[data-theme="dark"] textarea {
  background-color: #1f1f1f !important;
  border-color: #3f3f3f !important;
  color: #ffffff !important;
}

[data-theme="dark"] textarea:hover {
  background-color: #2a2a2a !important;
  border-color: #5a5a5a !important;
}

[data-theme="dark"] textarea:focus {
  background-color: #2a2a2a !important;
  border-color: #7a7a7a !important;
  box-shadow: 0 0 0 2px rgba(122, 122, 122, 0.2) !important;
}

[data-theme="dark"] textarea::placeholder {
  color: #888888 !important;
}

/* Dropdown menus - darker backgrounds */
[data-theme="dark"] .heroui-dropdown-menu {
  background-color: #1a1a1a !important;
  border-color: #3f3f3f !important;
}

[data-theme="dark"] .heroui-dropdown-item {
  background-color: #1a1a1a !important;
  color: #ffffff !important;
}

[data-theme="dark"] .heroui-dropdown-item:hover {
  background-color: #2a2a2a !important;
}

/* Popover menus - darker backgrounds */
[data-theme="dark"] .heroui-popover {
  background-color: #1a1a1a !important;
  border-color: #3f3f3f !important;
}

[data-theme="dark"] .heroui-popover-content {
  background-color: #1a1a1a !important;
}

/* Slider components - darker backgrounds */
[data-theme="dark"] .heroui-slider {
  background-color: #1f1f1f !important;
}

[data-theme="dark"] .heroui-slider-track {
  background-color: #3f3f3f !important;
}

[data-theme="dark"] .heroui-slider-thumb {
  background-color: #7a7a7a !important;
}

/* Checkbox and radio - darker backgrounds */
[data-theme="dark"] .heroui-checkbox,
[data-theme="dark"] .heroui-radio {
  background-color: #1f1f1f !important;
  border-color: #3f3f3f !important;
}

[data-theme="dark"] .heroui-checkbox:hover,
[data-theme="dark"] .heroui-radio:hover {
  background-color: #2a2a2a !important;
  border-color: #5a5a5a !important;
}

[data-theme="dark"] .heroui-checkbox[data-selected="true"],
[data-theme="dark"] .heroui-radio[data-selected="true"] {
  background-color: #3a3a3a !important;
  border-color: #7a7a7a !important;
}
`;
