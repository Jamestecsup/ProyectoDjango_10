import Button from "./Button";

// TODO (HashConfirm) — la confirmación de lo destructivo: escribir el hash del plan.
//
// Qué debe hacer:
//   1. Guardar lo que la persona escribe en un estado `typed` (useState) y mostrarlo en el campo:
//      entrada controlada, con value={typed} y un onChange que actualice el estado.
//   2. El botón «Aprobar» (variante "danger") queda DESHABILITADO hasta que `typed` sea
//      exactamente igual a `hash`: ni un prefijo, ni el hash con texto de más, ni otra mayúscula.
//   3. Al hacer clic en «Aprobar» llama a onConfirm() una sola vez.
//
// Hoy el campo no guarda nada y el botón siempre está activo: no hay ninguna barrera.
export default function HashConfirm({ hash, onConfirm }) {
  return (
    <div className="hash-confirm">
      <label>
        Hash del plan
        <input type="text" autoComplete="off" spellCheck={false} />
      </label>
      <Button variant="danger" onClick={() => onConfirm()}>
        Aprobar
      </Button>
    </div>
  );
}
