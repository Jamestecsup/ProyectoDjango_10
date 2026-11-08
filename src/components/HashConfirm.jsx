import { useState } from "react";
import Button from "./Button";

// Destructive confirmation: the person must type the plan hash, exactly.
// The comparison is strict (===): a prefix, extra text or different case is not enough.
export default function HashConfirm({ hash, onConfirm }) {
  const [typed, setTyped] = useState("");
  const isValid = typed === hash;

  return (
    <div className="hash-confirm">
      <label>
        Hash del plan
        <input
          type="text"
          autoComplete="off"
          spellCheck={false}
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
        />
      </label>
      <Button variant="danger" disabled={!isValid} onClick={() => onConfirm()}>
        Aprobar
      </Button>
    </div>
  );
}
