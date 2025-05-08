import { test, expect } from '@playwright/test';
import { LandingPage } from '../pages/LandingPage';

test.describe('Landing Page', () => {
  test('should not display the login button', async ({ page }) => {
    const landingPage = new LandingPage(page);
    const loginButton = await page.getByRole('button', { name: 'Login' });
    await expect(loginButton).toBeHidden();
  });
});