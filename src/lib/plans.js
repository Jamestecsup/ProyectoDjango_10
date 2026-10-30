// Small helpers shared by the components (already written).

/** The human-readable name of what a plan touches: an exam has a title, a question has a text. */
export function targetLabel(target) {
  return String(target.title ?? target.text ?? "");
}

export const VERDICT_LABELS = {
  approved: "Aprobado",
  rejected: "Rechazado",
};
