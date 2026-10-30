import { useState } from "react";
import PlanCard from "./PlanCard";
import { targetLabel, VERDICT_LABELS } from "../lib/plans";
import { readStoredDecisions, writeStoredDecisions } from "../lib/storage";

export default function Inbox({ plans }) {
  const [decisions, setDecisions] = useState(() => readStoredDecisions());
  const [query, setQuery] = useState("");

  const decide = (id, verdict) => {
    decisions[id] = verdict;
    setDecisions(decisions);
    writeStoredDecisions(decisions);
  };

  const clearSearch = () => setQuery("");

  const pending = plans.filter((plan) => !(plan.id in decisions));
  const decided = plans.filter((plan) => plan.id in decisions);
  const needle = query.trim().toLowerCase();
  const visible = pending.filter(
    (plan) => plan.op.toLowerCase().includes(needle) || targetLabel(plan.target).toLowerCase().includes(needle)
  );

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
            <button type="button" onClick={clearSearch()}>
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
