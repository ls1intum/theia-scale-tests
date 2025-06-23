import { test, expect } from '../../fixtures/theia.fixture';

/**
 * @description This test suite is used to test the unauthenticated landing page of the application.
 * @tag slow (starting the instance takes a while)
 */
test.describe('Landing Page Tests (unauthenticated)', () => {

  test.use({ storageState: { cookies: [], origins: [] } });

  test('LandingPage: Login button should be visible', async ({ landingPage }) => {
    const loginButton = await landingPage.page.getByRole('button', { name: 'Login' });
    await expect(loginButton).toBeVisible();
  });

  test('LandingPage: Login should redirect to Keycloak', async ({ landingPage }) => {
    await landingPage.page.getByRole('button', { name: 'Login' }).click();
    await expect(landingPage.page).toHaveURL(/.*keycloak\.ase\.in\.tum\.de.*/);
  });

  test('LandingPage: Login via the UI', async ({ landingPage }) => {
    await landingPage.login(process.env.KEYCLOAK_USER || '', process.env.KEYCLOAK_PWD || '');
    const logoutButton = await landingPage.page.getByRole('link', { name: 'logout' });
    await expect(logoutButton).toBeVisible();
  });


});

/**
 * @description This test suite is used to test the authenticated landing page of the application.
 */
test.describe('LandingPage: Landing Page Setup', () => {

  test('LandingPage: User should be logged in', async ({ landingPage }) => {
    const logoutButton = await landingPage.page.getByRole('link', { name: 'logout' });
    await expect(logoutButton).toBeVisible();
  });

  test('LandingPage: Programming language instances should be visible', async ({ landingPage }) => {
    const languageLocators = landingPage.retrieveAllLanguageLocators();
    for (const languageLocator of languageLocators) {
      await expect(languageLocator).toBeVisible();
    }
  }
  );

  //TODO: Enable this test once sure of mulitple instance creation does not break the system
  test.skip('LandingPage: Launch C instance', async ({ landingPage }) => {
    test.slow();
    await landingPage.launchLanguage('C');
    await landingPage.page.waitForURL(/.*#\/home\/project/);
    });

});