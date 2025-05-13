import { test as setup, expect } from '@playwright/test';
import { LandingPage } from '../../pages/landing/LandingPage';
import path from 'path';

const authFile = path.join(__dirname, '../../.auth/user.json');

export var currentInstanceURL = "";

/**
 * @remarks
 * This function is used to log in to Keycloak for theia via using the UI.
 * @tag slow (starting the instance takes a while)
 * @description This function automates the login process for the Keycloak UI.
 */
setup('Auth: Authenticate Keycloak', async ({ page }) => {
  setup.slow();
  await page.goto(`/`);
  
  const landingPage = new LandingPage(page);
  await landingPage.login(process.env.KEYCLOAK_USER || '', process.env.KEYCLOAK_PWD || '');

  await page.waitForURL(`/`);

  await page.context().storageState({ path: authFile });
});