import { test, expect, chromium, BrowserContext, Page } from '@playwright/test';
import { IDEPage } from '../../pages/ide/IDEPage';
import { LandingPage } from '../../pages/landing/LandingPage';
import { localURL } from '../../global.config';
import path from 'path';

let context: BrowserContext;
let page: Page;

/**
 * @description This test suite is used to test the IDE of the application.
 * @important currently we create one context for all tests, so we can reuse the same instance for all tests.
 * @tag slow (starting the instance takes a while)
 */
test.describe('IDE Tests', () => {

  test.beforeAll(async ({}, testInfo) => {
    test.slow();
    const browser = await chromium.launch();
    const authFilePath = path.resolve(__dirname, '../../.auth/user.json');
    context = await browser.newContext({ storageState: authFilePath });
    page = await context.newPage();

    if (testInfo.project.name !== 'local') {
      const landingPage = new LandingPage(page);
      await page.goto('/');
      await landingPage.launchLanguage('C');
    } else {
      await page.goto(`${localURL}/`);
    }

    await page.waitForURL(/.*#\/home\/project/);
  });

  test('Create new File', async () => {
    const idePage = new IDEPage(page);
    const fileName = 'Test1';
    await idePage.createNewFile(fileName);
    await expect(page.getByRole('listitem', { name: `/home/project/${fileName}` })).toBeVisible();
  });

  test.afterAll(async () => {
    await context?.close();
  });
});