import "@testing-library/jest-dom/vitest";

// Mock do scrollIntoView para jsdom
if (typeof window !== "undefined") {
  window.HTMLElement.prototype.scrollIntoView = function () {};
}
