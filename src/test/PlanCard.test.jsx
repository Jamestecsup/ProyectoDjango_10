import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlanCard from "@impl/PlanCard";
import { makePlans } from "./fixtures";

const [r2Plan, r1Plan] = makePlans(); // T-01 (R2, exams_destroy) and T-02 (R1, questions_create)

describe("PlanCard · muestra el plan como texto", () => {
  it("de un plan R2 muestra operación, riesgo, destino, proponente y hash", () => {
    render(<PlanCard plan={r2Plan} onDecide={() => {}} />);
    expect(screen.getByText("exams_destroy")).toBeInTheDocument();
    expect(screen.getByText(/R2/)).toBeInTheDocument();
    expect(screen.getByText(/Examen de ORM/)).toBeInTheDocument();
    expect(screen.getByText("agente")).toBeInTheDocument();
    expect(screen.getByText("a1b2c3d4e5f6")).toBeInTheDocument();
  });

  it("de un plan R1 muestra el riesgo R1 y el texto de la pregunta", () => {
    render(<PlanCard plan={r1Plan} onDecide={() => {}} />);
    expect(screen.getByText(/R1/)).toBeInTheDocument();
    expect(screen.getByText(/values_list/)).toBeInTheDocument();
  });
});

describe("PlanCard · plan R1: decidir con un clic", () => {
  it("ofrece Aprobar y Rechazar, sin pedir ningún hash", () => {
    render(<PlanCard plan={r1Plan} onDecide={() => {}} />);
    expect(screen.getByRole("button", { name: "Aprobar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Rechazar" })).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("no avisa al padre al dibujarse", () => {
    const onDecide = vi.fn();
    render(<PlanCard plan={r1Plan} onDecide={onDecide} />);
    expect(onDecide).not.toHaveBeenCalled();
  });

  it("Aprobar avisa una vez con el id y approved", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn();
    render(<PlanCard plan={r1Plan} onDecide={onDecide} />);
    await user.click(screen.getByRole("button", { name: "Aprobar" }));
    expect(onDecide).toHaveBeenCalledExactlyOnceWith("T-02", "approved");
  });

  it("Rechazar avisa una vez con el id y rejected", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn();
    render(<PlanCard plan={r1Plan} onDecide={onDecide} />);
    await user.click(screen.getByRole("button", { name: "Rechazar" }));
    expect(onDecide).toHaveBeenCalledExactlyOnceWith("T-02", "rejected");
  });
});

describe("PlanCard · plan R2: el hash va por HashConfirm", () => {
  it("muestra un campo para el hash en lugar de un botón Aprobar suelto", () => {
    render(<PlanCard plan={r2Plan} onDecide={() => {}} />);
    expect(screen.getByRole("textbox", { name: /hash/i })).toBeInTheDocument();
  });

  it("escribir el hash del plan y pulsar Aprobar avisa una vez con approved", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn();
    render(<PlanCard plan={r2Plan} onDecide={onDecide} />);
    await user.type(screen.getByRole("textbox", { name: /hash/i }), "a1b2c3d4e5f6");
    await user.click(screen.getByRole("button", { name: "Aprobar" }));
    expect(onDecide).toHaveBeenCalledExactlyOnceWith("T-01", "approved");
  });

  it("Rechazar no necesita hash", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn();
    render(<PlanCard plan={r2Plan} onDecide={onDecide} />);
    await user.click(screen.getByRole("button", { name: "Rechazar" }));
    expect(onDecide).toHaveBeenCalledExactlyOnceWith("T-01", "rejected");
  });
});

describe("PlanCard · es controlada por el padre", () => {
  it("tras decidir no se marca como decidida por su cuenta: solo avisa", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn(); // a parent that does nothing with the decision
    render(<PlanCard plan={r1Plan} onDecide={onDecide} />);
    await user.click(screen.getByRole("button", { name: "Aprobar" }));
    expect(onDecide).toHaveBeenCalledTimes(1);

    expect(screen.queryByText(/decidid/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Aprobar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Rechazar" })).toBeInTheDocument();
  });
});
