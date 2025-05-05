import { test, expect } from '@playwright/test';
import { LandingPage } from '../pages/LandingPage';

test.describe('Landing Page', () => {
    let landingPage: LandingPage;

    test.beforeEach(async ({ page }) => {
        landingPage = new LandingPage(page);
        await landingPage.goto();
    });

    test('should display the login button', async ({ page }) => {
        const loginButton = await page.getByRole('button', { name: 'Login' });
        await expect(loginButton).toBeVisible();
    });

    test('should navigate to the login page when clicking the login button', async ({ page }) => {
        await landingPage.clickLoginButton();
        await expect(page).toHaveURL(/https:\/\/keycloak\.ase\.in\.tum\.de\/.*/);
    });
});