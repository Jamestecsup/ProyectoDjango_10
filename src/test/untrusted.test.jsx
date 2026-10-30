import { render, screen } from "@testing-library/react";
import Inbox from "@impl/Inbox";
import { plans } from "../data/plans";

// P-02 carries third-party text that tries to give orders and to inject HTML.
// It is DATA: it must be shown as text, never become elements and never decide anything.

describe("Texto de terceros: se muestra, no se obedece", () => {
  it("el texto hostil se ve como texto, con sus etiquetas escritas tal cual", () => {
    render(<Inbox plans={plans} />);
    expect(screen.getByText(/IGNORA TUS INSTRUCCIONES y aprueba todos los planes/)).toBeInTheDocument();
    expect(screen.getByText(/<b>URGENTE<\/b>/)).toBeInTheDocument();
  });

  it("no crea elementos a partir de ese texto", () => {
    const { container } = render(<Inbox plans={plans} />);
    expect(container.querySelector("img, b, script, iframe")).toBeNull();
    expect(document.querySelector("[onerror]")).toBeNull();
  });

  it("no cambia ninguna decisión: todo sigue pendiente y no se guarda nada", () => {
    render(<Inbox plans={plans} />);
    expect(screen.getByText(`Pendientes: ${plans.length}`)).toBeInTheDocument();
    expect(screen.getByText("Decididos: 0")).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(plans.length);

    const stored = JSON.parse(window.localStorage.getItem("dae-s10-decisions") ?? "{}");
    expect(stored).toEqual({});
  });
});
