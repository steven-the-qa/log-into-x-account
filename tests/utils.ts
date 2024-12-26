import { Page } from '@playwright/test';

/**
 * Wait for a random duration between min and max milliseconds
 * @param page Playwright Page object
 * @param min Minimum delay in milliseconds
 * @param max Maximum delay in milliseconds
 */
export const randomDelay = async (page: Page, min: number, max: number) => {
  const delay = Math.floor(Math.random() * (max - min + 1) + min);
  await page.waitForTimeout(delay);
};

/**
 * Type text with random delays between characters
 * @param page Playwright Page object
 * @param locator Selector for the input element
 * @param text Text to type
 */
export const typeWithDelay = async (page: Page, locator: string, text: string) => {
  for (const char of text) {
    await page.getByPlaceholder(locator).pressSequentially(char, { delay: Math.random() * 100 + 50 });
    await randomDelay(page, 50, 150);
  }
}; 