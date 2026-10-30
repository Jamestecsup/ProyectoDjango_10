import Button from "./Button";
import HashConfirm from "./HashConfirm";

// Already written: this card only SHOWS a plan and tells its parent what the person decided.
// It keeps no state of its own: whether the plan is still pending is the parent's business.
export default function PlanCard({ plan, onDecide }) {
  const isDestructive = plan.risk === "R2";

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

      {isDestructive ? (
        <div className="plan-card-actions">
          <HashConfirm hash={plan.plan_hash} onConfirm={() => onDecide(plan.id, "approved")} />
          <Button variant="ghost" onClick={() => onDecide(plan.id, "rejected")}>
            Rechazar
          </Button>
        </div>
      ) : (
        <div className="plan-card-actions">
          <Button variant="primary" onClick={() => onDecide(plan.id, "approved")}>
            Aprobar
          </Button>
          <Button variant="ghost" onClick={() => onDecide(plan.id, "rejected")}>
            Rechazar
          </Button>
        </div>
      )}
    </article>
  );
}
