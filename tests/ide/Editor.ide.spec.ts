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
test.describe('IDE Editor Tests', () => {

  test.beforeAll(async ({}, testInfo) => {
    test.slow();
    const browser = await chromium.launch();

    if (testInfo.project.name !== 'local') {
      const authFilePath = path.resolve(__dirname, '../../.auth/user.json');
      context = await browser.newContext({ storageState: authFilePath });
    } else {
      context = await browser.newContext();
    }
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

  /**
   * @description This test creates a new file and checks if it is visible in the editor
   */
  test('Create new File', async () => {
    const idePage = new IDEPage(page);
    const fileName = 'Test1';
    await idePage.createNewFile(fileName);
    await expect(idePage.getOpenedFileLocator(fileName)).toBeVisible();
  });

  /**
   * @description This test creates a new file with content and checks if it and its content is visible in the editor
   */
  test('Create File with content', async () => {
    const idePage = new IDEPage(page);
    const fileName = 'Test2';
    await idePage.createFileWithContent(fileName, 'Hello World');
    await expect(idePage.getOpenedFileLocator(fileName)).toBeVisible();
    await expect(page.getByText('Hello World')).toBeVisible();
  });

  /**
   * @description This test opens the terminal and deletes all files in the project
   */
  test.afterAll(async () => {
    const idePage = new IDEPage(page);
    await idePage.terminal.open();
    await idePage.terminal.executeCommand('rm -r *');
    await idePage.terminal.close();
    await context?.close();
  });
});