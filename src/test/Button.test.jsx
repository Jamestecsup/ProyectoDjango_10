import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "@impl/Button";

describe("Button · variantes y contenido", () => {
  it("muestra su contenido (children) como texto del botón", () => {
    render(<Button>Guardar</Button>);
    expect(screen.getByRole("button", { name: "Guardar" })).toBeInTheDocument();
  });

  it("acepta elementos como contenido, no solo texto", () => {
    render(
      <Button>
        <strong>Muy</strong> importante
      </Button>
    );
    const button = screen.getByRole("button", { name: "Muy importante" });
    expect(button.querySelector("strong")).toHaveTextContent("Muy");
  });

  it("sin variante es primary", () => {
    render(<Button>Aceptar</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn", "btn-primary");
  });

  it.each(["primary", "danger", "ghost"])("la variante %s se refleja en la clase CSS de la variante", (variant) => {
    render(<Button variant={variant}>Acción</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn", `btn-${variant}`);
  });

  it("una variante no deja la clase de otra", () => {
    render(<Button variant="danger">Borrar</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn-danger");
    expect(screen.getByRole("button")).not.toHaveClass("btn-primary");
  });
});

describe("Button · type y props reenviadas", () => {
  it("no envía un formulario por defecto (type=button)", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button>Pulsar</Button>
      </form>
    );
    await user.click(screen.getByRole("button", { name: "Pulsar" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("quien lo usa puede pedir type=submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button type="submit">Enviar</Button>
      </form>
    );
    await user.click(screen.getByRole("button", { name: "Enviar" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("reenvía el resto de props al botón real (aria-label, data-*)", () => {
    render(
      <Button aria-label="Cerrar panel" data-testid="cerrar">
        x
      </Button>
    );
    expect(screen.getByTestId("cerrar")).toHaveAccessibleName("Cerrar panel");
  });
});

describe("Button · eventos", () => {
  it("llama a onClick una vez por clic y no al dibujarse", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Pulsar</Button>);
    expect(onClick).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Pulsar" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("con disabled no llama a onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Pulsar
      </Button>
    );
    expect(screen.getByRole("button", { name: "Pulsar" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Pulsar" }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
