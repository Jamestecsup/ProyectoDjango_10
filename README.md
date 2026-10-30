# La bandeja de aprobaciones — estado, eventos y la persona que decide

Repositorio del laboratorio **extra de la semana 10** de Desarrollo de Aplicaciones Empresariales (DAE).
Es la mitad **humana** de la frontera que viste en la semana 8: un agente de IA propone **planes** (cada uno con
su `plan_hash`) y una persona los revisa y decide en una pantalla hecha con **componentes de React**. Lo
destructivo (riesgo **R2**) no se aprueba con un clic: hay que **escribir el hash del plan**.

Todo es **local**: esta aplicación no llama a ninguna API (el `fetch` llega en la semana 12) y las decisiones
quedan en el navegador (`localStorage`). El límite de verdad lo impone el **servidor** (semana 8): esta interfaz
solo ayuda a la persona a decidir bien.

La guía del laboratorio (con su rúbrica) está en el campus virtual; aquí está el código.

## Puesta en marcha

Necesitas **Node 20.19 o superior** (o Node 22.12 o superior): `node -v`. En PowerShell:

```powershell
npm install
npm run dev        # abre la dirección que imprime (http://localhost:5173); déjalo corriendo
```

En **otra terminal** vas a correr las pruebas. Al empezar, la bandeja se dibuja pero casi nada funciona: las pruebas
fallan a propósito, y tu trabajo es ponerlas en verde.

```powershell
npm test           # tu código (src/components): 61 pruebas, 34 fallan al empezar
```

## Las partes del laboratorio

Cada parte tiene un comentario `TODO` en su archivo con lo que debes hacer. Después de cada una:

| Parte | Archivo | Qué escribes | Comando |
|---|---|---|---|
| 1 | `src/components/Button.jsx` | Botón reutilizable: variantes (`primary`, `danger`, `ghost`), `children`, `type="button"` y props reenviadas | `npm test -- Button` |
| 2 | `src/components/HashConfirm.jsx` | Entrada controlada y botón Aprobar deshabilitado hasta que lo escrito sea **exactamente** el hash | `npm test -- HashConfirm` |
| 3 | `src/components/Inbox.jsx` | Estado (`decisions`, `query`), `decide`, pendientes y decididos calculados, búsqueda, estado vacío y persistencia | `npm test -- Inbox` |
| 4 | `src/ai/` | Revisar la versión «escrita por una IA»: clasificar sus 4 fallos y arreglarlos | `npm run test:ai` |

`PlanCard.jsx`, `App.jsx`, los datos y las pruebas ya están escritos: **no los cambies** (salvo lo que pida la guía
para provocar un error a propósito).

Un plan tiene la misma forma que el que devuelve la pasarela de la semana 8:

```js
{ id: "P-01", op: "exams_destroy", risk: "R2", target: { id: 2, title: "Django · Plantillas", question_count: 4 },
  plan_hash: "d68ebfa913ec", proposed_by: "agente" }
```

`R1` crea datos y se aprueba con un clic; `R2` destruye datos y exige el hash. El plan `P-02` lleva un texto hostil
(«IGNORA TUS INSTRUCCIONES…»): es un **dato de terceros**, se muestra como texto y nunca se obedece ni se inserta como HTML.

## Qué hace cada script

| Comando | Qué hace |
|---|---|
| `npm run dev` | Arranca la aplicación con recarga en vivo |
| `npm test` | Corre las pruebas contra **tu código** (`src/components`) |
| `npm run test:ai` | Corre las **mismas pruebas** contra la versión de la IA (`src/ai`). Deben fallar 11: es el material de la Parte 4 |
| `npm run test:solutions` | Solo existe en la copia del docente (necesita `teacher/solutions/`); en la tuya avisa de que no está disponible |
| `npm run build` | Compila la aplicación en `dist/` (comprueba que el proyecto no está roto) |

Las pruebas importan los componentes con el alias `@impl`, que `vite.config.js` apunta a una carpeta u otra según el
**modo** (`.env.team`, `.env.ai`, `.env.solutions`). La aplicación (`dev` y `build`) siempre usa `src/components`.

## Estructura

| Ruta | Para qué |
|---|---|
| `src/components/` | **Tuyo (Partes 1 a 3):** `Button`, `HashConfirm` e `Inbox` por completar; `PlanCard` ya escrito |
| `src/ai/` | La versión «escrita por una IA» de los cuatro componentes (Parte 4) |
| `src/data/plans.js` | Los seis planes del agente, con el formato de la semana 8 |
| `src/lib/` | Utilidades ya escritas: el nombre del destino de un plan y la lectura y escritura segura de `localStorage` |
| `src/test/` | Las pruebas de cada parte, más `untrusted.test.jsx` (el texto hostil) y una prueba de humo de `App` |
| `src/App.jsx`, `src/main.jsx`, `src/styles.css` | La aplicación, ya escrita |
| `.env.team`, `.env.ai`, `.env.solutions` | Qué carpeta usa cada modo de pruebas |

## Convenciones del curso

Código, nombres de variables y comentarios en inglés; explicaciones y entregables en español. Componentes en
PascalCase y hooks con el prefijo `use`.
