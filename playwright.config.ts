import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://127.0.0.1:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } }
  ],
  webServer: process.env.E2E_EXTERNAL ? undefined : [
    {
      command: isCI ? 'node apps/api/dist/src/main.js' : 'pnpm --filter @cser/api dev',
      url: 'http://127.0.0.1:4000/v1/health/live',
      reuseExistingServer: !isCI,
      stdout: 'pipe',
      stderr: 'pipe'
    },
    {
      command: isCI ? 'pnpm --filter @cser/web preview --host 127.0.0.1 --port 5173' : 'pnpm --filter @cser/web dev --host 127.0.0.1',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: !isCI,
      stdout: 'pipe',
      stderr: 'pipe'
    }
  ]
});
