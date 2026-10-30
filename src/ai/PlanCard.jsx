import { useState } from "react";
import Button from "./Button";
import HashConfirm from "./HashConfirm";
import { VERDICT_LABELS } from "../lib/plans";

export default function PlanCard({ plan, onDecide }) {
  const [verdict, setVerdict] = useState(null);
  const isDestructive = plan.risk === "R2";

  function handleDecision(value) {
    setVerdict(value);
    onDecide(plan.id, value);
  }

  return (
    <article className={`plan-card plan-card-${plan.risk.toLowerCase()}`} aria-label={`Plan ${plan.id}`}>
      <header className="plan-card-header">
        <h4>{plan.op}</h4>
        <span className="badge">{isDestructive ? "R2 · destructivo" : "R1 · crea datos"}</span>
      </header>

      <dl className="plan-card-fields">
        <dt>Destino</dt>
        <dd>
          <ul className="target">
            {Object.entries(plan.target).map(([key, value]) => (
              <li key={key}>
                <span className="target-key">{key}:</span> {String(value)}
              </li>
            ))}
          </ul>
        </dd>
        <dt>Propone</dt>
        <dd>{plan.proposed_by}</dd>
        <dt>Hash</dt>
        <dd>
          <code>{plan.plan_hash}</code>
        </dd>
      </dl>

      {verdict ? (
        <p className="plan-card-verdict">Decidido: {VERDICT_LABELS[verdict]}</p>
      ) : (
        <div className="plan-card-actions">
          {isDestructive ? (
            <HashConfirm hash={plan.plan_hash} onConfirm={() => handleDecision("approved")} />
          ) : (
            <Button variant="primary" onClick={() => handleDecision("approved")}>
              Aprobar
            </Button>
          )}
          <Button variant="ghost" onClick={() => handleDecision("rejected")}>
            Rechazar
          </Button>
        </div>
      )}
    </article>
  );
}
