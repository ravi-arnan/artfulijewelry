import { defineConfig, devices } from "@playwright/test";

// Uses the system-installed Google Chrome (channel: "chrome") so no Playwright
// browser download is required. Reuses an already-running dev server.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  // The dev server compiles routes on demand, so allow a retry and a couple of
  // workers rather than hammering it with the full suite at once.
  retries: 1,
  workers: 2,
  expect: { timeout: 10_000 },
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    navigationTimeout: 30_000,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chrome",
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
