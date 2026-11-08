import { useEffect, useState } from "react";
import PlanCard from "./PlanCard";
import { targetLabel, VERDICT_LABELS } from "../lib/plans";
import { readStoredDecisions, writeStoredDecisions } from "../lib/storage";

// The inbox keeps only what the person did (decisions) and what the person typed in the
// search box (query). Pending, decided, counters and the filtered list are DERIVED on every
// render: one source of truth, so nothing can go out of sync.

export default function Inbox({ plans }) {
  // Lazy initialisation: pass the function, React calls it only on the first render.
  const [decisions, setDecisions] = useState(readStoredDecisions);
  const [query, setQuery] = useState("");

  // Functional update: build a NEW object instead of mutating the current one. React only
  // re-renders when it receives a different reference.
  function decide(id, verdict) {
    setDecisions((current) => ({ ...current, [id]: verdict }));
  }

  // Derived values: computed from plans + decisions + query, never stored in state.
  const pending = plans.filter((plan) => !(plan.id in decisions));
  const decided = plans.filter((plan) => plan.id in decisions);
  const needle = query.trim().toLowerCase();
  const visible = pending.filter(
    (plan) => plan.op.toLowerCase().includes(needle) || targetLabel(plan.target).toLowerCase().includes(needle)
  );

  function clearSearch() {
    setQuery("");
  }

  // Persist every change of decisions. The effect runs after the render that already shows it.
  useEffect(() => {
    writeStoredDecisions(decisions);
  }, [decisions]);

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
