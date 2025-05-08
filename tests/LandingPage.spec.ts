import { test, expect } from '@playwright/test';
import { LandingPage } from '../pages/LandingPage';

test.describe('Landing Page Tests', () => {

  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/`);
  });

  test('Login button should be visible', async ({ page }) => {
    const landingPage = new LandingPage(page);
    const loginButton = await page.getByRole('button', { name: 'Login' });
    await expect(loginButton).toBeVisible();
  });

  test('Login should redirect to Keycloak', async ({ page }) => {
    const landingPage = new LandingPage(page);
    const loginButton = await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/.*keycloak\.ase\.in\.tum\.de.*/);
  });

  test('Login via the UI', async ({ page }) => {
    const landingPage = new LandingPage(page);
    await landingPage.login(process.env.KEYCLOAK_USER || '', process.env.KEYCLOAK_PWD || '');
    const logoutButton = await page.getByRole('link', { name: 'logout' });
    await expect(logoutButton).toBeVisible();
  });


});

test.describe('Landing Page Setup', { tag: '@slow' }, () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/`);
  });

  test('User should be logged in', async ({ page }) => {
    const landingPage = new LandingPage(page);
    const logoutButton = await page.getByRole('link', { name: 'logout' });
    await expect(logoutButton).toBeVisible();
  });

});