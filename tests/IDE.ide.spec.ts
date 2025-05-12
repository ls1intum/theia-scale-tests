import { test, expect, chromium, BrowserContext, Page } from '@playwright/test';
import { IDEPage } from '../pages/IDEPage';
import { LandingPage } from '../pages/LandingPage';
import { localURL } from '../global.config';
import path from 'path';

let context: BrowserContext;
let page: Page;

test.describe('IDE Tests', () => {

  test.beforeAll(async ({}, testInfo) => {
    test.slow();
    const browser = await chromium.launch();
    const authFilePath = path.resolve(__dirname, '../.auth/user.json');
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
    await idePage.createNewFile();
    await expect(page.getByRole('listitem', { name: /\/Untitled-/ })).toBeVisible();
  });

  test.afterAll(async () => {
    await context?.close();
  });
});