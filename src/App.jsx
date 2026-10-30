import Inbox from "./components/Inbox";
import { plans } from "./data/plans";

export default function App() {
  return (
    <main className="app">
      <header className="app-header">
        <h1>Bandeja de aprobaciones</h1>
        <p>
          Un agente de IA propone planes y una persona decide. Lo destructivo (R2) no se aprueba con un clic: hay que
          escribir el hash del plan.
        </p>
        <p className="note">
          Todo es local: esta interfaz no llama a ninguna API y las decisiones quedan en tu navegador. El límite de
          verdad lo impone el servidor (semana 8); aquí solo ayudamos a la persona a decidir bien.
        </p>
      </header>
      <Inbox plans={plans} />
    </main>
  );
}
