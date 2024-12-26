import dotenv from 'dotenv';
import { test, expect } from '@playwright/test';

dotenv.config();

test('Hack X', async ({ page }) => {
  await page.goto('https://www.x.com/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("X. It’s what’s happening / X");
  await page.getByTestId('loginButton').click()
  if (!process.env.EMAIL) throw new Error('EMAIL environment variable is required');
  await page.getByLabel('Phone, email, or username').fill(process.env.EMAIL!)
  await page.getByRole('button', { name: 'Next' }).click();

  if (await page.getByTestId('ocfEnterTextTextInput').isVisible()) {
    await page.waitForTimeout(3000)
    await page.getByTestId('ocfEnterTextTextInput').fill('StevenBoutcher')
    await page.getByRole('button', { name: 'Next' }).click();
  }
  await page.waitForTimeout(3000)
  if (!process.env.PASSWORD) throw new Error('PASSWORD environment variable is required');
  await page.getByLabel('Password', { exact: true }).pressSequentially(process.env.PASSWORD!, { delay: 100 });
  await page.getByLabel('Password', { exact: true }).press('Enter');
  await page.getByTestId('tweetTextarea_0').locator('div').nth(3).click();
  await page.getByTestId('tweetTextarea_0').fill('This was posted by a Playwright script ;)');
  // Post button
  await page.getByTestId('tweetButtonInline').click();
  // 'This tweet was sent' toast 'View' link
  await page.getByTestId('toast').locator('a').click();
  await expect(page.getByText('This was posted by a Playwright script ;)')).toBeVisible()
  // Tweet options
  await page.getByTestId('tweet').getByTestId('caret').click();
  // Delete tweet button
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await page.getByTestId('confirmationSheetConfirm').click();
});
