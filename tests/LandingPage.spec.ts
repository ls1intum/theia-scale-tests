import { test, expect } from '@playwright/test';
import { LandingPage } from '../pages/LandingPage';
test.describe('Landing Page Tests', () => {

  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    await page.goto(`/`);
  });

  test('LandingPage: Login button should be visible', async ({ page }) => {
    const landingPage = new LandingPage(page);
    const loginButton = await page.getByRole('button', { name: 'Login' });
    await expect(loginButton).toBeVisible();
  });

  test('LandingPage: Login should redirect to Keycloak', async ({ page }) => {
    const landingPage = new LandingPage(page);
    const loginButton = await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/.*keycloak\.ase\.in\.tum\.de.*/);
  });

  test('LandingPage: Login via the UI', async ({ page }) => {
    const landingPage = new LandingPage(page);
    await landingPage.login(process.env.KEYCLOAK_USER || '', process.env.KEYCLOAK_PWD || '');
    const logoutButton = await page.getByRole('link', { name: 'logout' });
    await expect(logoutButton).toBeVisible();
  });


});

test.describe.configure({ mode: 'serial' });

test.describe('LandingPage: Landing Page Setup', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`/`);
  });

  test('LandingPage: User should be logged in', async ({ page }) => {

    const logoutButton = await page.getByRole('link', { name: 'logout' });
    await expect(logoutButton).toBeVisible();
  });

  test('LandingPage: Programming language instances should be visible', async ({ page }) => {
    const languageC = await page.getByRole('button', { name: 'Launch C' })
    await expect(languageC).toBeVisible();
    const languageJava = await page.getByRole('button', { name: 'Launch Java', exact: true })
    await expect(languageJava).toBeVisible();
    const languageJS = await page.getByRole('button', { name: 'Launch Javascript' })
    await expect(languageJS).toBeVisible();
    const languageOcaml = await page.getByRole('button', { name: 'Launch Ocaml' })
    await expect(languageOcaml).toBeVisible();
    const languagePython = await page.getByRole('button', { name: 'Launch Python' })
    await expect(languagePython).toBeVisible();
    const languageRust = await page.getByRole('button', { name: 'Launch Rust' })
    await expect(languageRust).toBeVisible();
  }
  );

  test('LandingPage: Launch C instance', async ({ page }) => {
    test.slow();
    const landingPage = new LandingPage(page);
    await landingPage.launchLanguage('C');
    await page.waitForURL(/.*#\/home\/project/);
    });

});