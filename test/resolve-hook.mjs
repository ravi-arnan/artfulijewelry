// Node ESM resolution hook for the unit test runner.
//
// Production modules use two conventions the bundler understands but Node's raw
// ESM loader does not:
//   1. The "@/..." path alias (tsconfig `paths`), and
//   2. extensionless relative imports of .ts files.
//
// This hook resolves both so the real source can be unit-tested with
// `node --test` without altering any production import statements.
import { pathToFileURL } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");

// "" tries the specifier untouched (covers bare package specifiers and files
// that already carry an extension); the rest cover extensionless TS imports.
const EXTENSION_CANDIDATES = ["", ".ts", ".tsx", ".mts", "/index.ts"];

export async function resolve(specifier, context, nextResolve) {
  const spec = specifier.startsWith("@/")
    ? pathToFileURL(path.join(projectRoot, specifier.slice(2))).href
    : specifier;

  let lastError;
  for (const ext of EXTENSION_CANDIDATES) {
    try {
      return await nextResolve(spec + ext, context);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}
