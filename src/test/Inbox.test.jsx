import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Inbox from "@impl/Inbox";
import { deepFreeze, makePlans, STORAGE_KEY } from "./fixtures";

// T-01 exams_destroy (R2) · T-02 questions_create (R1) · T-03 questions_destroy (R2) · T-04 questions_create (R1)
const HASHES = { "T-01": "a1b2c3d4e5f6", "T-03": "112233445566" };

const pendingRegion = () => screen.getByRole("region", { name: "Pendientes" });
const decidedRegion = () => screen.getByRole("region", { name: "Decididos" });
const searchBox = () => screen.getByRole("searchbox", { name: /buscar/i });
const cardIn = (region, id) => within(region).queryByRole("article", { name: `Plan ${id}` });
const pendingIds = () =>
  within(pendingRegion())
    .queryAllByRole("article")
    .map((article) => article.getAttribute("aria-label").replace("Plan ", ""));

async function approve(user, id) {
  const card = cardIn(pendingRegion(), id);
  if (id in HASHES) {
    await user.type(within(card).getByRole("textbox", { name: /hash/i }), HASHES[id]);
  }
  await user.click(within(card).getByRole("button", { name: "Aprobar" }));
}

async function reject(user, id) {
  await user.click(within(cardIn(pendingRegion(), id)).getByRole("button", { name: "Rechazar" }));
}

describe("Inbox · punto de partida", () => {
  it("muestra todos los planes como pendientes y ninguno como decidido", () => {
    render(<Inbox plans={makePlans()} />);
    expect(pendingIds()).toEqual(["T-01", "T-02", "T-03", "T-04"]);
    expect(screen.getByText("Pendientes: 4")).toBeInTheDocument();
    expect(screen.getByText("Decididos: 0")).toBeInTheDocument();
    expect(within(decidedRegion()).getByText("Aún no has decidido ningún plan.")).toBeInTheDocument();
  });
});

describe("Inbox · decidir (estado y funciones que suben)", () => {
  it("aprobar un plan R1 lo saca de Pendientes y lo pone en Decididos como Aprobado", async () => {
    const user = userEvent.setup();
    render(<Inbox plans={makePlans()} />);
    await approve(user, "T-02");

    expect(cardIn(pendingRegion(), "T-02")).not.toBeInTheDocument();
    const item = within(decidedRegion()).getByRole("listitem");
    expect(item).toHaveTextContent("Aprobado");
    expect(item).toHaveTextContent("questions_create");
  });

  it("rechazar un plan lo pone en Decididos como Rechazado", async () => {
    const user = userEvent.setup();
    render(<Inbox plans={makePlans()} />);
    await reject(user, "T-04");

    expect(cardIn(pendingRegion(), "T-04")).not.toBeInTheDocument();
    expect(within(decidedRegion()).getByRole("listitem")).toHaveTextContent("Rechazado");
  });

  it("aprobar un plan R2 escribiendo su hash también lo mueve a Decididos", async () => {
    const user = userEvent.setup();
    render(<Inbox plans={makePlans()} />);
    await approve(user, "T-01");

    expect(cardIn(pendingRegion(), "T-01")).not.toBeInTheDocument();
    const item = within(decidedRegion()).getByRole("listitem");
    expect(item).toHaveTextContent("Aprobado");
    expect(item).toHaveTextContent("exams_destroy");
  });

  it("decidir un plan no toca a los demás", async () => {
    const user = userEvent.setup();
    render(<Inbox plans={makePlans()} />);
    await approve(user, "T-02");
    expect(pendingIds()).toEqual(["T-01", "T-03", "T-04"]);
  });

  it("acumula las decisiones: la segunda no borra la primera", async () => {
    const user = userEvent.setup();
    render(<Inbox plans={makePlans()} />);
    await approve(user, "T-02");
    await reject(user, "T-03");
    expect(within(decidedRegion()).getAllByRole("listitem")).toHaveLength(2);
  });
});

describe("Inbox · contadores calculados", () => {
  it("los contadores siguen a las decisiones", async () => {
    const user = userEvent.setup();
    render(<Inbox plans={makePlans()} />);
    await approve(user, "T-02");
    expect(screen.getByText("Pendientes: 3")).toBeInTheDocument();
    expect(screen.getByText("Decididos: 1")).toBeInTheDocument();

    await reject(user, "T-04");
    expect(screen.getByText("Pendientes: 2")).toBeInTheDocument();
    expect(screen.getByText("Decididos: 2")).toBeInTheDocument();
  });

  it("los contadores cuentan todos los pendientes, aunque la búsqueda oculte algunos", async () => {
    const user = userEvent.setup();
    render(<Inbox plans={makePlans()} />);
    await approve(user, "T-02");
    await user.type(searchBox(), "destroy");

    expect(pendingIds()).toEqual(["T-01", "T-03"]);
    expect(screen.getByText("Pendientes: 3")).toBeInTheDocument();
    expect(screen.getByText("Decididos: 1")).toBeInTheDocument();
  });
});

describe("Inbox · búsqueda (entrada controlada)", () => {
  it("filtra los pendientes por operación", async () => {
    const user = userEvent.setup();
    render(<Inbox plans={makePlans()} />);
    await user.type(searchBox(), "destroy");
    expect(pendingIds()).toEqual(["T-01", "T-03"]);
  });

  it("filtra por el texto del destino sin distinguir mayúsculas", async () => {
    const user = userEvent.setup();
    render(<Inbox plans={makePlans()} />);
    await user.type(searchBox(), "PLANTILLA");
    expect(pendingIds()).toEqual(["T-03"]);
  });

  it("filtra por el título del destino", async () => {
    const user = userEvent.setup();
    render(<Inbox plans={makePlans()} />);
    await user.type(searchBox(), "orm");
    expect(pendingIds()).toEqual(["T-01"]);
  });

  it("ignora los espacios al borde del texto", async () => {
    const user = userEvent.setup();
    render(<Inbox plans={makePlans()} />);
    await user.type(searchBox(), "  destroy ");
    expect(pendingIds()).toEqual(["T-01", "T-03"]);
  });

  it("lo que se escribe aparece en el campo y, al borrarlo, vuelven todos los planes", async () => {
    const user = userEvent.setup();
    render(<Inbox plans={makePlans()} />);
    await user.type(searchBox(), "destroy");
    expect(searchBox()).toHaveValue("destroy");
    expect(pendingIds()).toHaveLength(2);

    await user.clear(searchBox());
    expect(pendingIds()).toHaveLength(4);
  });

  it("solo filtra los pendientes: los decididos se siguen viendo", async () => {
    const user = userEvent.setup();
    render(<Inbox plans={makePlans()} />);
    await approve(user, "T-02");
    await user.type(searchBox(), "csrf");

    expect(pendingIds()).toEqual(["T-04"]);
    expect(within(decidedRegion()).getAllByRole("listitem")).toHaveLength(1);
  });
});

describe("Inbox · estados vacíos y botón Limpiar búsqueda", () => {
  it("sin coincidencias dice «No hay planes que coincidan»", async () => {
    const user = userEvent.setup();
    render(<Inbox plans={makePlans()} />);
    await user.type(searchBox(), "zzz");

    expect(screen.getByText("No hay planes que coincidan")).toBeInTheDocument();
    expect(pendingIds()).toEqual([]);
  });

  it("Limpiar búsqueda vacía el campo y devuelve los planes", async () => {
    const user = userEvent.setup();
    render(<Inbox plans={makePlans()} />);
    await user.type(searchBox(), "zzz");
    await user.click(screen.getByRole("button", { name: "Limpiar búsqueda" }));

    expect(searchBox()).toHaveValue("");
    expect(pendingIds()).toHaveLength(4);
    expect(screen.queryByText("No hay planes que coincidan")).not.toBeInTheDocument();
  });

  it("si todo está decidido y no hay búsqueda, avisa de que no quedan pendientes", () => {
    const all = { "T-01": "approved", "T-02": "rejected", "T-03": "rejected", "T-04": "approved" };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    render(<Inbox plans={makePlans()} />);

    expect(screen.getByText("No quedan planes pendientes.")).toBeInTheDocument();
    expect(screen.getByText("Pendientes: 0")).toBeInTheDocument();
    expect(screen.getByText("Decididos: 4")).toBeInTheDocument();
  });
});

describe("Inbox · persistencia en el navegador", () => {
  it("guarda las decisiones en localStorage (clave dae-s10-decisions)", async () => {
    const user = userEvent.setup();
    render(<Inbox plans={makePlans()} />);
    await approve(user, "T-02");
    await reject(user, "T-04");

    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY))).toEqual({
      "T-02": "approved",
      "T-04": "rejected",
    });
  });

  it("al volver a montar la bandeja recupera lo decidido", async () => {
    const user = userEvent.setup();
    const first = render(<Inbox plans={makePlans()} />);
    await approve(user, "T-02");
    first.unmount();

    render(<Inbox plans={makePlans()} />);
    expect(cardIn(pendingRegion(), "T-02")).not.toBeInTheDocument();
    expect(within(decidedRegion()).getByRole("listitem")).toHaveTextContent("questions_create");
  });

  it("empieza desde lo guardado: listas y contadores coinciden", () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ "T-01": "rejected", "T-04": "approved" }));
    render(<Inbox plans={makePlans()} />);

    expect(pendingIds()).toEqual(["T-02", "T-03"]);
    expect(within(decidedRegion()).getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("Pendientes: 2")).toBeInTheDocument();
    expect(screen.getByText("Decididos: 2")).toBeInTheDocument();
  });

  it("ignora lo guardado de planes que ya no existen", () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ "T-01": "approved", "X-99": "approved" }));
    render(<Inbox plans={makePlans()} />);

    expect(screen.getByText("Decididos: 1")).toBeInTheDocument();
    expect(screen.getByText("Pendientes: 3")).toBeInTheDocument();
  });
});

describe("Inbox · no modifica lo que recibe", () => {
  it("buscar y decidir no tocan el arreglo plans ni sus planes", async () => {
    const user = userEvent.setup();
    const plans = makePlans();
    const before = structuredClone(plans);
    deepFreeze(plans); // si el componente intenta mutarlos (sort, push, splice...), lanza un error

    render(<Inbox plans={plans} />);
    await user.type(searchBox(), "destroy");
    await user.clear(searchBox());
    await approve(user, "T-02");
    await reject(user, "T-04");

    expect(plans).toEqual(before);
  });
});
