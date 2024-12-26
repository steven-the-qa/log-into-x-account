import { test as setup } from '@playwright/test';
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

setup('authenticate', async ({ page }) => {
  // Perform login once and save the state
  await page.goto('https://www.x.com/');
  await page.getByTestId('loginButton').click();
  
  if (!process.env.EMAIL) throw new Error('EMAIL environment variable is required');
  await page.getByLabel('Phone, email, or username').fill(process.env.EMAIL!);
  await page.getByRole('button', { name: 'Next' }).click();

  if (!process.env.PASSWORD) throw new Error('PASSWORD environment variable is required');
  await page.getByLabel('Password', { exact: true }).pressSequentially(process.env.PASSWORD!, { delay: 100 });
  await page.getByLabel('Password', { exact: true }).press('Enter');

  // Wait for login to complete
  await page.waitForURL('https://www.x.com/home');

  // Save signed-in state
  await page.context().storageState({ 
    path: path.join(__dirname, '../playwright/.auth/user.json') 
  });
}); 