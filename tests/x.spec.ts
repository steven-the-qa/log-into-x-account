import dotenv from 'dotenv';
import { test, expect } from '@playwright/test';
import { randomDelay, typeWithDelay } from './utils';

dotenv.config();

test('Post and delete a tweet', async ({ page }) => {
  const tweetText = 'This was posted by me! Testing out some features ;)';
  
  try {
    await test.step('Navigate to X', async () => {
      await page.goto('https://www.x.com/', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      await randomDelay(page, 2000, 4000);
      await page.getByTestId('loginButton').click();
      await randomDelay(page, 1000, 2000);
      
      if (!process.env.EMAIL) throw new Error('EMAIL environment variable is required');
      await typeWithDelay(page, 'Phone, email, or username', process.env.EMAIL);
      
      await randomDelay(page, 1000, 2000);
      await page.getByRole('button', { name: 'Next' }).click();
      await randomDelay(page, 2000, 3000);

      if (!process.env.PASSWORD) throw new Error('PASSWORD environment variable is required');
      await page.getByLabel('Password', { exact: true }).pressSequentially(process.env.PASSWORD!, { 
        delay: Math.random() * 200 + 100 
      });
      
      await randomDelay(page, 1000, 2000);
      await page.getByLabel('Password', { exact: true }).press('Enter');
      await randomDelay(page, 3000, 5000);

      // Wait for login to complete
      await page.waitForURL('https://www.x.com/home');
      await randomDelay(page, 2000, 4000);
    });

    await test.step('Create new tweet', async () => {
      await page.getByTestId('tweetTextarea_0').locator('div').nth(3).click();
      await randomDelay(page, 1000, 2000);
      
      for (const char of tweetText) {
        await page.getByTestId('tweetTextarea_0').type(char, { delay: Math.random() * 100 + 50 });
        await randomDelay(page, 30, 100);
      }
      
      await randomDelay(page, 2000, 3000);
      await page.getByTestId('tweetButtonInline').click();
      await randomDelay(page, 2000, 3000);
    });

    await test.step('Verify tweet was posted', async () => {
      await page.getByTestId('toast').locator('a').click();
      await randomDelay(page, 2000, 3000);
      await expect(page.getByText(tweetText)).toBeVisible();
      await randomDelay(page, 1000, 2000);
    });

    await test.step('Delete tweet', async () => {
      await page.getByTestId('tweet').getByTestId('caret').click();
      await randomDelay(page, 1000, 2000);
      await page.getByRole('menuitem', { name: 'Delete' }).click();
      await randomDelay(page, 1000, 2000);
      await page.getByTestId('confirmationSheetConfirm').click();
      await randomDelay(page, 3000, 5000);
    });

  } catch (error) {
    console.error('Test failed:', error);
    await page.screenshot({ path: 'error-screenshot.png' });
    throw error;
  }
});
