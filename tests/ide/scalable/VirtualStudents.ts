import { Page, expect } from '@playwright/test';
import { TheiaApp } from '../../../pages/ide/theia-pom/theia-app';
import { TheiaWorkspace } from '../../../pages/ide/theia-pom/theia-workspace';
import { IDEPage } from '../../../pages/ide/IDEPage';
import { TheiaTerminal } from '../../../pages/ide/theia-pom/theia-terminal';
import { loadRepositoryURL, loadRepositoryName } from '../../../fixtures/utils/constants';
import { PreferenceIds, TheiaPreferenceView } from '../../../pages/ide/theia-pom/theia-preference-view';
import { TheiaTextEditor } from '../../../pages/ide/theia-pom/theia-text-editor';
import { TheiaExplorerView } from '../../../pages/ide/theia-pom/theia-explorer-view';


/**
 * This function is used to simulate a virtual student in the IDE for the load tests.
 * 0: This student will clone the repository and open the exercise, then edit the exercise incorrectly and build the project.
 * @param page The page expects Theia to be loaded and the user to be logged in
 */
export async function virtualStudent0(page: Page) {
    await page.waitForURL(/.*#\/home\/project/);
    const workspace = new TheiaWorkspace();
    workspace.setPath("/home/project");
    const theiaApp = new TheiaApp(page, workspace, false);
    const idePage = new IDEPage(page, theiaApp, page.url());

    //Step 1: Clone the repository    
    const terminal = await theiaApp.openTerminal(TheiaTerminal);
    await terminal.submit('git clone ' + loadRepositoryURL);
    
    /*
    await expect(async () => {
        await expect(await terminal.contents).toContain('Receiving objects: 100%');
    }).toPass( { timeout: 10000, intervals: [1000, 2000, 5000, 10000] });
    */

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

    //Step 3: Open the exercise
    const editor = await theiaApp.openEditor(`src/main/java/com/student/Calculator.java`, TheiaTextEditor);
}

/**
 * This function is used to simulate a virtual student in the IDE for the load tests.
 * 1: This student will clone the repository and open the exercise, then edit the exercise correctly and build the project.
 * @param page The page expects Theia to be loaded and the user to be logged in
 */
export async function virtualStudent1(page: Page) {
    await page.waitForURL(/.*#\/home\/project/);
    const workspace = new TheiaWorkspace();
    workspace.setPath("/home/project");
    const theiaApp = new TheiaApp(page, workspace, false);
    const idePage = new IDEPage(page, theiaApp, page.url());

    //Step 1: Clone the repository    
    const terminal = await theiaApp.openTerminal(TheiaTerminal);
    await terminal.submit('git clone ' + loadRepositoryURL);
    
    /*
    await expect(async () => {
        await expect(await terminal.contents).toContain('Receiving objects: 100%');
    }).toPass( { timeout: 10000, intervals: [1000, 2000, 5000, 10000] });
    */

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

    //Step 3: Open the exercise
    const editor = await theiaApp.openEditor(`src/main/java/com/student/Calculator.java`, TheiaTextEditor);
}