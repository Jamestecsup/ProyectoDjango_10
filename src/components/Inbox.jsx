import { useEffect, useState } from "react";
import PlanCard from "./PlanCard";
import { targetLabel, VERDICT_LABELS } from "../lib/plans";
import { readStoredDecisions, writeStoredDecisions } from "../lib/storage";

// TODO (Inbox) — completa la bandeja por partes. El JSX de abajo ya está escrito: no lo cambies,
// haz que los datos que usa sean de verdad. Ejecuta `npm test` después de cada parte.
//
// Qué recuerda esta pantalla (y SOLO esto se guarda en estado):
//   · decisions: un objeto { idDelPlan: "approved" | "rejected" }
//   · query: el texto de la búsqueda
// Todo lo demás (pendientes, decididos, contadores, filtrados) se CALCULA en cada dibujado.

export default function Inbox({ plans }) {
  // TODO 1 — Estado. Sustituye cada valor de la derecha por una llamada a useState:
  //   · decisions: empieza con lo que haya guardado (inicialización perezosa: useState(readStoredDecisions),
  //     pasando la FUNCIÓN, sin llamarla).
  //   · query: empieza en "".
  const [decisions, setDecisions] = [{}, () => {}];
  const [query, setQuery] = ["", () => {}];

  // TODO 2 — decide(id, verdict): anota la decisión SIN modificar el objeto actual.
  //   Crea un objeto nuevo con la decisión añadida ({ ...current, [id]: verdict }) y pásalo a setDecisions.
  //   Usa la forma funcional: setDecisions((current) => ...).
  function decide(id, verdict) {}

  // TODO 3 — Derivados. Calcúlalos a partir de plans, decisions y query; NO los guardes en estado.
  //   · pending: los planes cuyo id NO está en decisions.
  //   · decided: los planes cuyo id SÍ está en decisions.
  //   · visible: los pendientes cuyo `op` o cuyo targetLabel(plan.target) contiene `query`
  //     (sin distinguir mayúsculas ni espacios al borde). Con query vacío, todos los pendientes.
  const pending = plans;
  const decided = [];
  const visible = pending;

  // TODO 4 — clearSearch(): vacía la búsqueda.
  function clearSearch() {}

  // TODO 5 — Persistencia. Cada vez que cambie `decisions`, guárdalas con writeStoredDecisions(decisions)
  //   dentro de un useEffect con la dependencia correcta.

  return (
    <section className="inbox" aria-labelledby="inbox-title">
      <h2 id="inbox-title">Planes del agente</h2>

      <p className="counters">
        <span>Pendientes: {pending.length}</span>
        <span>Decididos: {decided.length}</span>
      </p>

      <label className="search">
        Buscar plan
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>

      <section aria-labelledby="pending-title">
        <h3 id="pending-title">Pendientes</h3>
        {visible.length > 0 ? (
          <div className="plan-list">
            {visible.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onDecide={decide} />
            ))}
          </div>
        ) : query.trim() !== "" ? (
          <div className="empty">
            <p>No hay planes que coincidan</p>
            <button type="button" onClick={clearSearch}>
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <p className="empty">No quedan planes pendientes.</p>
        )}
      </section>

      <section aria-labelledby="decided-title">
        <h3 id="decided-title">Decididos</h3>
        {decided.length > 0 ? (
          <ul className="decided-list">
            {decided.map((plan) => (
              <li key={plan.id} className={`decided decided-${decisions[plan.id]}`}>
                <strong>{VERDICT_LABELS[decisions[plan.id]]}</strong> · {plan.op} · {targetLabel(plan.target)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty">Aún no has decidido ningún plan.</p>
        )}
      </section>
    </section>
  );
}
