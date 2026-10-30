import { render, screen } from "@testing-library/react";
import App from "../App";
import { plans } from "../data/plans";

// Smoke test: the app draws with the real data (six plans, same format as the week 8 gateway).
describe("App · prueba de humo con los datos reales", () => {
  it("dibuja el título y un plan por cada elemento de plans.js", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1, name: "Bandeja de aprobaciones" })).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(plans.length);
    expect(screen.getByText(`Pendientes: ${plans.length}`)).toBeInTheDocument();
  });

  it("los datos tienen el formato del plan de la semana 8", () => {
    for (const plan of plans) {
      expect(plan.plan_hash).toMatch(/^[0-9a-f]{12}$/);
      expect(["R1", "R2"]).toContain(plan.risk);
      expect(plan.proposed_by).toBe("agente");
      expect(plan.op).toMatch(/^(exams|questions)_(create|destroy)$/);
    }
    expect(new Set(plans.map((plan) => plan.id)).size).toBe(plans.length);
  });
});
