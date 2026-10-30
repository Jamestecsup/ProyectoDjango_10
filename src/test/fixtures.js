// Small, fixed data for the tests. A function, so each test gets its own fresh copy.
export const STORAGE_KEY = "dae-s10-decisions";

export function makePlans() {
  return [
    {
      id: "T-01",
      op: "exams_destroy",
      risk: "R2",
      target: { id: 1, title: "Examen de ORM", question_count: 4 },
      plan_hash: "a1b2c3d4e5f6",
      proposed_by: "agente",
    },
    {
      id: "T-02",
      op: "questions_create",
      risk: "R1",
      target: { exam: 1, text: "¿Qué hace values_list()?" },
      plan_hash: "0f9e8d7c6b5a",
      proposed_by: "agente",
    },
    {
      id: "T-03",
      op: "questions_destroy",
      risk: "R2",
      target: { id: 7, text: "¿Qué es el contexto de una plantilla?" },
      plan_hash: "112233445566",
      proposed_by: "agente",
    },
    {
      id: "T-04",
      op: "questions_create",
      risk: "R1",
      target: { exam: 2, text: "¿Para qué sirve csrf_token?" },
      plan_hash: "99aabbccddee",
      proposed_by: "agente",
    },
  ];
}

export function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    Object.values(value).forEach(deepFreeze);
  }
  return value;
}
