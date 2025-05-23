import { test, expect } from '../fixtures/ide.fixture';

/**
 * @description This test suite is used to test the IDE of the application.
 */

const testPrefix = 'Editor-';

test.describe('IDE Editor Tests', () => {

  test('Create new File', async ({ idePage }) => {
    const fileName = testPrefix + 'Test1';
    await idePage.createNewFile(fileName);
    await expect(idePage.getEditorOpenedFileLocator(fileName)).toBeVisible();
  });

  test('Create File with content', async ({ idePage }) => {
    const fileName = testPrefix + 'Test2';
    await idePage.createFileWithContent(fileName, 'Hello World');
    await idePage.sideBar.openExplorer();
    await expect(idePage.getEditorOpenedFileLocator(fileName)).toBeVisible();
    await expect(idePage.getExplorerOpenedFileLocator(fileName)).toBeVisible();
    await expect(idePage.page.getByText('Hello World')).toBeVisible();
  });

  test('Undo and Redo text in file', async ({ idePage }) => {
    const fileName = testPrefix + 'Test3';
    const text = 'undoredo';
    await idePage.createFileWithContent(fileName, text);
    await idePage.menuBar.pressUndo();
    await expect(idePage.page.getByText(text)).toBeHidden();
    await idePage.menuBar.pressRedo();
    await expect(idePage.page.getByText(text)).toBeVisible();
  });

  test('Delete existing File', async ({ idePage }) => {
    const fileName = testPrefix + 'Test4';
    await idePage.createNewFile(fileName);
    await expect(idePage.getEditorOpenedFileLocator(fileName)).toBeVisible();
    await idePage.deleteFile(fileName);
    await idePage.sideBar.openExplorer();
    const isHidden = await idePage.getEditorOpenedFileLocator(fileName).isHidden();
    const isRenamed = await idePage.getEditorOpenedFileLocator(fileName + '(Deleted)').isVisible();
    //expect(isHidden || isRenamed).toBeTruthy();
    await expect(idePage.getExplorerOpenedFileLocator(fileName)).toBeHidden();
  });

  test('Create new File in folder', async ({ idePage }) => {
    const fileName = testPrefix + 'Folder-1/SubFolder-1/Test5';
    const folderPath = testPrefix + 'Folder-1/SubFolder-1';
    await idePage.createNewFolder(folderPath);
    await idePage.createNewFile(fileName);
    await idePage.sideBar.openExplorer();
    await idePage.sideBar.openFolderPath(folderPath);
    await expect(idePage.getEditorOpenedFileLocator(fileName)).toBeVisible();
    await expect(idePage.getExplorerOpenedFileLocator(fileName)).toBeVisible();
  });

  test.afterAll(async ({ idePage }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    await idePage.executeInTerminal(`rm -rf ${testPrefix}*`);
  });

});