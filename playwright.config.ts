import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 */
require('dotenv').config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: 1,
  reporter: 'list',
  use: {
    headless: false,
    trace: 'retain-on-failure',
    viewport: { width: 1440, height: 900 },
    contextOptions: {
      userAgent: 'Mozilla/5.0 (Macintosh; Apple Silicon Mac OS X 14_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    launchOptions: {
      slowMo: 100,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
      ],
    },
    navigationTimeout: 30000,
    actionTimeout: 15000,
  },

  projects: [
    {
      name: 'chrome',
      use: { 
        channel: 'chrome',
        browserName: 'chromium',
      },
    },
  ],
});
