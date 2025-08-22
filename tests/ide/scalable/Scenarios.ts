import { expect } from '@playwright/test';
import { TheiaApp } from '../../../pages/ide/theia-pom/theia-app';
import { TheiaTextEditor } from '../../../pages/ide/theia-pom/theia-text-editor';
import { deleteAll, pasteFromString, sleep } from '../../../fixtures/utils/commands';
import { readFileSync } from 'fs';
import path from 'path';
import { TheiaVSCView } from '../../../pages/ide/custom-pom/theia-vsc';
import { TheiaTerminal } from '../../../pages/ide/theia-pom/theia-terminal';

const bubbleSortTemplatePath = path.resolve(__dirname, '../../../fixtures/utils/templates/exercise_solutions/BubbleSort.txt');
const bubbleSortTemplate = readFileSync(bubbleSortTemplatePath, 'utf8');
const mergeSortTemplatePath = path.resolve(__dirname, '../../../fixtures/utils/templates/exercise_solutions/MergeSort.txt');
const mergeSortTemplate = readFileSync(mergeSortTemplatePath, 'utf8');

/**
 * This function is used to edit the BubbleSort.java file.
 * @param theiaApp The TheiaApp instance
 */
export async function editBubbleSort(theiaApp: TheiaApp) {
  const editor = await theiaApp.openEditor(`src/de/BubbleSort.java`, TheiaTextEditor);
  await editor.waitForVisible();
  await editor.focus();
  await deleteAll(theiaApp.page);
  await sleep(1000);
  await pasteFromString(theiaApp.page, bubbleSortTemplate);
}

/**
 * This function is used to edit the MergeSort.java file.
 * @param theiaApp The TheiaApp instance
 */
export async function editMergeSort(theiaApp: TheiaApp) {
  const editor = await theiaApp.openEditor(`src/de/MergeSort.java`, TheiaTextEditor);
  await editor.waitForVisible();
  await editor.focus();
  await deleteAll(theiaApp.page);
  await sleep(1000);
  await pasteFromString(theiaApp.page, mergeSortTemplate);
}

/**
 * This function is used to commit the changes to the repository.
 * @param theiaApp The TheiaApp instance
 */
export async function commit(theiaApp: TheiaApp) {
  const vsc = await theiaApp.openView(TheiaVSCView);
  await vsc.commit("Initial commit from Theia" + Math.random().toString(36).substring(2, 15));
}

/**
 * This function is used to create a new random file.
 * @param theiaApp The TheiaApp instance
 */
export async function createNewRandomFile(theiaApp: TheiaApp) {
  await (await theiaApp.menuBar.openMenu('File')).clickMenuItem('New File...');
  const quickPick = theiaApp.page.getByPlaceholder('Select File Type or Enter');

  await quickPick.fill("src/de/RandomFile" + Math.random().toString(36).substring(2, 15));
  await quickPick.press('Enter');

  const fileDialog = await theiaApp.page.waitForSelector('div[class="dialogBlock"]');
  expect(await fileDialog.isVisible()).toBe(true);
  await theiaApp.page.locator('#theia-dialog-shell').press('Enter');
  expect(await fileDialog.isVisible()).toBe(false);
}

/**
 * This function is used to use the terminal.
 * @param theiaApp The TheiaApp instance  
 */
export async function useTerminal(theiaApp: TheiaApp) {
  const terminal = await theiaApp.openTerminal(TheiaTerminal);
  await terminal.waitForVisible();
  await terminal.focus();
  await terminal.submit('ls');
  await terminal.submit('clear');
  await terminal.submit('pwd');
  await terminal.submit('clear');
  await terminal.submit('cd ..');
  await terminal.submit('clear');
}