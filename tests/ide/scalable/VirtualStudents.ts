import { Page, expect } from '@playwright/test';
import { TheiaApp } from '../../../pages/ide/theia-pom/theia-app';
import { TheiaWorkspace } from '../../../pages/ide/theia-pom/theia-workspace';
import { IDEPage } from '../../../pages/ide/IDEPage';
import { TheiaTerminal } from '../../../pages/ide/theia-pom/theia-terminal';
import { loadRepositoryURL, loadRepositoryName } from '../../../fixtures/utils/constants';
import { PreferenceIds, TheiaPreferenceView } from '../../../pages/ide/theia-pom/theia-preference-view';
import { TheiaTextEditor } from '../../../pages/ide/theia-pom/theia-text-editor';
import { TheiaExplorerView } from '../../../pages/ide/theia-pom/theia-explorer-view';
import { pasteFromString, sleep } from '../../../fixtures/utils/commands';
import { readFileSync } from 'fs';
import path from 'path';

const bubbleSortTemplatePath = path.resolve(__dirname, '../../../fixtures/utils/templates/exercise_solutions/BubbleSort.txt');
const bubbleSortTemplate = readFileSync(bubbleSortTemplatePath, 'utf8');

/**
 * This function is used to simulate a virtual student in the IDE for the load tests.
 * @param page The page expects Theia to be loaded and the user to be logged in
 */
export async function virtualStudent(page: Page) {
    const testId = Math.floor(Math.random() * 2);
    await page.waitForURL(/.*#\/home\/project/);
    const workspace = new TheiaWorkspace();
    workspace.setPath("/home/project");
    const theiaApp = new TheiaApp(page, workspace, false);
    const idePage = new IDEPage(page, theiaApp, page.url());

    //Step 1: Clone the repository    
    const terminal = await theiaApp.openTerminal(TheiaTerminal);
    await terminal.submit('git clone ' + loadRepositoryURL);

    const explorer = await theiaApp.openView(TheiaExplorerView);
    await explorer.waitForVisible();
    await explorer.waitForFileNodesToIncrease(0);

    await idePage.openWorkspace(loadRepositoryName);
    await theiaApp.workspace.setPath("/home/project/" + loadRepositoryName);

    //Step 2: Disable compact folder view
    const preferences = await theiaApp.openView(TheiaPreferenceView);
    const preferenceId = PreferenceIds.Explorer.CompactFolder;
    await preferences.setBooleanPreferenceById(preferenceId, false);
    await preferences.waitForModified(preferenceId);

    await runWithTimeout(
        async () => {
            //Step 3: Open the exercise
            const editor = await theiaApp.openEditor(`src/de/BubbleSort.java`, TheiaTextEditor);
            await editor.waitForVisible();
            await editor.focus();
            await pasteFromString(page, bubbleSortTemplate + (testId === 0 ? "" : "typo"));

            //Step 4: Build the project
            await buildProject(terminal);
        },
        parseInt(process.env.LOAD_TIMEOUT!, 10)
      );
    
}

/**
 * This function is used to build the project and wait for the build to finish.
 * @param terminal The terminal to use to build the project
 */
async function buildProject(terminal: TheiaTerminal) {
    await terminal.activate();
    await terminal.focus();
    await terminal.submit('./gradlew build');
    let output = await terminal.contents();
    while (!output.includes('BUILD SUCCESSFUL') && !output.includes('BUILD FAILED')) {
        await sleep(1000);
        output = await terminal.contents();
    }
    await terminal.submit('clear');
}

/**
 * This function is used to run a task until it succeeds or the timeout is reached.
 * @param task The task to run
 * @param timeoutMs The timeout in milliseconds
 * @param intervalMs The interval in milliseconds between iterations
 */
async function runWithTimeout(
    task: () => Promise<void> | void,
    timeoutMs: number,
    intervalMs = 1000
  ): Promise<void> {
    const start = Date.now();
  
    while (Date.now() - start < timeoutMs) {
      await task();
  
      if (intervalMs > 0) {
        await new Promise(res => setTimeout(res, intervalMs));
      }
    }
  
    console.log("Timeout reached, student stopped");
  }
  
  