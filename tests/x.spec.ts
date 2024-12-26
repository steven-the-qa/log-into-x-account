import dotenv from 'dotenv';
import { test, expect } from '@playwright/test';

dotenv.config();

test('Post and delete a tweet', async ({ page }) => {
  try {
    await test.step('Login to X', async () => {
      await page.goto('https://www.x.com/', { waitUntil: 'commit'});
      await expect(page).toHaveTitle("X. It's what's happening / X");
      await page.getByTestId('loginButton').click();

      if (!process.env.EMAIL) throw new Error('EMAIL environment variable is required');
      await page.getByLabel('Phone, email, or username').fill(process.env.EMAIL!);
      await page.getByRole('button', { name: 'Next' }).click();

      // Handle username verification if required
      if (await page.getByTestId('ocfEnterTextTextInput').isVisible()) {
        await page.waitForTimeout(3000);
        await page.getByTestId('ocfEnterTextTextInput').fill('StevenBoutcher');
        await page.getByRole('button', { name: 'Next' }).click();
      }

      // Enter password
      await page.waitForTimeout(3000);
      if (!process.env.PASSWORD) throw new Error('PASSWORD environment variable is required');
      await page.getByLabel('Password', { exact: true }).pressSequentially(process.env.PASSWORD!, { delay: 100 });
      await page.getByLabel('Password', { exact: true }).press('Enter');
    });

    await test.step('Create new tweet', async () => {
      await page.getByTestId('tweetTextarea_0').locator('div').nth(3).click();
      await page.getByTestId('tweetTextarea_0').fill('This was posted by a Playwright script ;)');
      await page.getByTestId('tweetButtonInline').click();
    });

    await test.step('Verify tweet was posted', async () => {
      await page.getByTestId('toast').locator('a').click();
      await expect(page.getByText('This was posted by a Playwright script ;)')).toBeVisible();
    });

    await test.step('Delete tweet', async () => {
      await page.getByTestId('tweet').getByTestId('caret').click();
      await page.getByRole('menuitem', { name: 'Delete' }).click();
      await page.getByTestId('confirmationSheetConfirm').click();
      await page.waitForTimeout(2000);
    });

  } catch (error) {
    console.error('Test failed:', error);
    await page.screenshot({ path: 'error-screenshot.png' });
    throw error;
  }
});
