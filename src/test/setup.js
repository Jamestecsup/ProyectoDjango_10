import "@testing-library/jest-dom/vitest";

// Every test starts with an empty browser storage: persistence must never leak between tests.
beforeEach(() => {
  window.localStorage.clear();
});
