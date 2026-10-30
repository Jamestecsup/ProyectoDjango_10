import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HashConfirm from "@impl/HashConfirm";

const HASH = "a1b2c3d4e5f6";
const field = () => screen.getByRole("textbox", { name: /hash/i });
const approve = () => screen.getByRole("button", { name: "Aprobar" });

describe("HashConfirm · la barrera del hash", () => {
  it("pide un hash y ofrece el botón Aprobar", () => {
    render(<HashConfirm hash={HASH} onConfirm={() => {}} />);
    expect(field()).toBeInTheDocument();
    expect(approve()).toBeInTheDocument();
  });

  it("Aprobar empieza deshabilitado", () => {
    render(<HashConfirm hash={HASH} onConfirm={() => {}} />);
    expect(approve()).toBeDisabled();
  });

  it("Aprobar se habilita solo cuando lo escrito es exactamente el hash", async () => {
    const user = userEvent.setup();
    render(<HashConfirm hash={HASH} onConfirm={() => {}} />);
    expect(approve()).toBeDisabled();

    await user.type(field(), "a1b2c3d4e5");
    expect(approve()).toBeDisabled(); // un prefijo no vale

    await user.type(field(), "f6");
    expect(approve()).toBeEnabled();
  });

  it("no se habilita con el hash más texto de sobra", async () => {
    const user = userEvent.setup();
    render(<HashConfirm hash={HASH} onConfirm={() => {}} />);
    await user.type(field(), `${HASH}x`);
    expect(approve()).toBeDisabled();
  });

  it("no se habilita con texto antes del hash", async () => {
    const user = userEvent.setup();
    render(<HashConfirm hash={HASH} onConfirm={() => {}} />);
    await user.type(field(), `ok ${HASH}`);
    expect(approve()).toBeDisabled();
  });

  it("distingue mayúsculas de minúsculas", async () => {
    const user = userEvent.setup();
    render(<HashConfirm hash={HASH} onConfirm={() => {}} />);
    await user.type(field(), HASH.toUpperCase());
    expect(approve()).toBeDisabled();
  });

  it("se vuelve a deshabilitar si se borra una letra", async () => {
    const user = userEvent.setup();
    render(<HashConfirm hash={HASH} onConfirm={() => {}} />);
    await user.type(field(), HASH);
    expect(approve()).toBeEnabled();

    await user.type(field(), "{Backspace}");
    expect(approve()).toBeDisabled();
  });

  it("si cambia el hash recibido, lo escrito deja de valer", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<HashConfirm hash={HASH} onConfirm={() => {}} />);
    await user.type(field(), HASH);
    expect(approve()).toBeEnabled();

    rerender(<HashConfirm hash="999999999999" onConfirm={() => {}} />);
    expect(approve()).toBeDisabled();
  });
});

describe("HashConfirm · entrada controlada y evento", () => {
  it("lo que se escribe aparece en el campo", async () => {
    const user = userEvent.setup();
    render(<HashConfirm hash={HASH} onConfirm={() => {}} />);
    await user.type(field(), "abc");
    expect(field()).toHaveValue("abc");
  });

  it("con el hash exacto, un clic llama a onConfirm una vez", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<HashConfirm hash={HASH} onConfirm={onConfirm} />);
    await user.type(field(), HASH);
    await user.click(approve());
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("no llama a onConfirm al dibujarse ni al escribir", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<HashConfirm hash={HASH} onConfirm={onConfirm} />);
    await user.type(field(), HASH);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("con el hash incorrecto, hacer clic no llama a onConfirm", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<HashConfirm hash={HASH} onConfirm={onConfirm} />);
    await user.type(field(), "nope");
    await user.click(approve());
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
