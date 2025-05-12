import { test as setup, expect } from '@playwright/test';
import { LandingPage } from '../../pages/LandingPage';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');

/**
 * @remarks
 * This function is used to log in to Keycloak for theia via using the UI.
 * @tag slow (starting the instance takes a while)
 * @description This function automates the login process for the Keycloak UI.
 */
setup('Auth: Authenticate and start Instance', { tag: '@slow' }, async ({ page }) => {
  await page.goto(`${process.env.BASE_URL}/`);
  
  const landingPage = new LandingPage(page);
  await landingPage.login(process.env.KEYCLOAK_USER || '', process.env.KEYCLOAK_PWD || '');

  await page.waitForURL(`${process.env.BASE_URL}/`);

  await landingPage.launchLanguage('C');
  
  await page.waitForURL(/.*#\/home\/project/);

  await page.context().storageState({ path: authFile });
});