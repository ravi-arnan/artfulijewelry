// Registers the TS-aware resolution hook used by the unit test runner.
// Loaded via `node --import ./test/register.mjs`.
import { register } from "node:module";

register("./resolve-hook.mjs", import.meta.url);
