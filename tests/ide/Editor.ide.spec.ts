import { test, expect, chromium, BrowserContext, Page } from '@playwright/test';
import { IDEPage } from '../../pages/ide/IDEPage';
import { LandingPage } from '../../pages/landing/LandingPage';
import { localURL } from '../../global.config';
import path from 'path';

let context: BrowserContext;
let page: Page;

/**
 * IMPORTANT: Tests depend on each other in this file
 */

/**
 * @description This test suite is used to test the IDE of the application.
 * @important currently we create one context for all tests, so we can reuse the same instance for all tests.
 * @tag slow (starting the instance takes a while)
 */
test.describe('IDE Editor Tests', () => {

  test.describe.configure({ mode: "serial" });

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
    await expect(idePage.getEditorOpenedFileLocator(fileName)).toBeVisible();
  });

  /**
   * @description This test creates a new file with content and checks if it and its content is visible in the editor
   */
  test('Create File with content', async () => {
    const idePage = new IDEPage(page);
    const fileName = 'Test3';
    await idePage.createFileWithContent(fileName, 'Hello World');
    await idePage.sideBar.openExplorer();
    await expect(idePage.getEditorOpenedFileLocator(fileName)).toBeVisible();
    await expect(idePage.getExplorerOpenedFileLocator(fileName)).toBeVisible();
    await expect(page.getByText('Hello World')).toBeVisible();
  });

  /**
   * @description This test checks if undo and redo works
   */
  test('Undo and Redo text in file', async () => {
    const idePage = new IDEPage(page);
    const fileName = 'Test3';
    await idePage.openFile(fileName);
    const text = 'undoredo';
    await idePage.editor.typeText(text);
    await idePage.menuBar.pressUndo();
    await expect(page.getByText(text)).toBeHidden();
    await idePage.menuBar.pressRedo();
    await expect(page.getByText(text)).toBeVisible();
  });


  //TODO Enable again if 
  /**
   * @description This test deletes a file and checks if it is not visible in the editor
   */
  test.skip('Delete existing File', async () => {
    const idePage = new IDEPage(page);
    const fileName = 'Test3';
    await idePage.deleteFile(fileName);
    await idePage.sideBar.openExplorer();

    const isHidden = await idePage.getEditorOpenedFileLocator(fileName).isHidden();
    const isRenamed = await idePage.getEditorOpenedFileLocator(fileName + '(Deleted)').isVisible();

    expect(isHidden || isRenamed).toBeTruthy();

    await expect(idePage.getExplorerOpenedFileLocator(fileName)).toBeHidden();

  });

    /**
   * @description This test creates a new file in a folder and checks if it is visible in the editor
   */
    test('Create new File in folder', async () => {
      const idePage = new IDEPage(page);
      const fileName = 'Folder-1/SubFolder-1/Test2';
      const folderPath = 'Folder-1/SubFolder-1';
      await idePage.createNewFolder(folderPath);
      await idePage.createNewFile(fileName);
      await idePage.sideBar.openExplorer();
      await idePage.sideBar.openFolderPath(folderPath);
      await expect(idePage.getEditorOpenedFileLocator(fileName)).toBeVisible();
      await expect(idePage.getExplorerOpenedFileLocator(fileName)).toBeVisible();
    });

  /**
   * @description This test opens the terminal and deletes all files in the project
   */
  test.afterAll(async () => {
    const idePage = new IDEPage(page);
    await idePage.sideBar.closeExplorer();
    await idePage.terminal.open();
    await idePage.terminal.executeCommand('rm -r *');
    await idePage.terminal.close();
    await context?.close();
  });
});