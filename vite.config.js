// Vite + Vitest configuration.
//
// The tests import the components through the alias "@impl". Which folder that alias points to
// depends on the MODE (see the .env.<mode> files and the scripts in package.json):
//
//   team       -> src/components      (your code, with the TODOs)        npm test
//   ai         -> src/ai              (the version "written by an AI")   npm run test:ai
//   solutions  -> teacher/solutions   (only exists in the teacher's copy) npm run test:solutions
//
// `npm run dev` and `npm run build` never use the alias: the app always uses src/components.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

const SOURCES = {
  team: "src/components",
  ai: "src/ai",
  solutions: "teacher/solutions",
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, root, "VITE_");
  const source = env.VITE_SOURCE || "team";
  const folder = SOURCES[source];

  if (!folder) {
    console.error(`VITE_SOURCE desconocido: "${source}". Usa team, ai o solutions.`);
    process.exit(1);
  }
  if (!fs.existsSync(path.join(root, folder))) {
    console.error(
      `El modo "${source}" no está disponible en esta copia: no existe la carpeta ${folder}/.\n` +
        "Las soluciones solo vienen en la copia del docente. Usa npm test o npm run test:ai."
    );
    process.exit(1);
  }

  return {
    plugins: [react()],
    resolve: { alias: { "@impl": path.join(root, folder) } },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/test/setup.js",
      include: ["src/**/*.test.{js,jsx}"],
    },
  };
});
