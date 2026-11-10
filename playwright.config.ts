import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT_TESTS ?? 3101);

/**
 * Tests de bout en bout sur le build de production local (`pnpm build` d'abord).
 * Quatre largeurs du dossier V5 (§ 10) : 390, 834, 1194, 1440 px.
 * ÉMULATION SEULEMENT : moteur Chromium avec viewport, densité, tactile et agent iOS/iPadOS.
 * Ce n'est ni Safari (WebKit) ni un appareil réel.
 */
const iphone = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const ipad = "Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";

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
    {
      name: "ipad-paysage-1194",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1194, height: 834 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: ipad },
    },
    {
      name: "tablette-834",
      use: { ...devices["Desktop Chrome"], viewport: { width: 834, height: 1194 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: ipad },
    },
    {
      name: "mobile-390",
      use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, userAgent: iphone },
    },
  ],
  webServer: {
    command: `pnpm start -p ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: false,
    timeout: 60_000,
    // Mode test du formulaire ; plafond de débit relevé pour les envois répétés des tests (local seulement).
    env: { INTAKE_MODE: "mock", INTAKE_DEBIT_PAR_IP: "10000" },
  },
});
