import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT_TESTS ?? 3101);

/** Tests de bout en bout sur le build de production local (`pnpm build` d'abord). */
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "ordinateur-1440", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "tablette-768", use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 }, hasTouch: true } },
    { name: "mobile-390", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 }, hasTouch: true } },
  ],
  webServer: {
    command: `pnpm start -p ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
