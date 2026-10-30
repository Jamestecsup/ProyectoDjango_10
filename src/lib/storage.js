// Browser storage for the decisions (already written). localStorage can throw (private windows,
// blocked storage) and its content can be anything, so both functions are defensive.

export const STORAGE_KEY = "dae-s10-decisions";

/** The saved decisions as an object { planId: "approved" | "rejected" }, or {} if there is nothing usable. */
export function readStoredDecisions() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function writeStoredDecisions(decisions) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
  } catch {
    // Storage is a convenience: if it fails, the app keeps working without it.
  }
}
