import { Page, expect } from '@playwright/test';
import { TheiaApp } from './theia-pom/theia-app';
import { TheiaTerminal } from './theia-pom/theia-terminal';

/**
 * Main IDE page class that composes all IDE components
 * Provides high-level operations that may involve multiple components
 */
export class IDEPage {
    page: Page;
    readonly theiaApp: TheiaApp;
    readonly baseURL: string;

    constructor(page: Page, app: TheiaApp, baseURL: string) {
        this.page = page;
        this.theiaApp = app;
        this.baseURL = baseURL;
    }

    /**
     * Custom goto method that appends the base URL to the path
     * @param path The relative path to the IDE URL
     */
    async goto(path: string) {
        await this.page.goto(this.baseURL + path);
    }

    /**
     * Wait for all essential IDE components to be ready
     */
    async waitForReady(): Promise<void> {
        await this.page.locator('.gs-header').waitFor({ state: 'visible' });
        await new Promise( resolve => setTimeout(resolve, 2000) );
    }

    /**
     * Creates a new file with the given name
     * @param fileName Name of the file to create
     */
    async createNewFile(fileName: string = 'Test-1', directory: string = 'project'): Promise<void> {
        await (await this.theiaApp.menuBar.openMenu('File')).clickMenuItem('New File...');
        const quickPick = this.theiaApp.page.getByPlaceholder('Select File Type or Enter');
        // type file name and press enter
        await quickPick.fill(fileName);
        await quickPick.press('Enter');

        // check file dialog is opened and accept with ENTER
        const fileDialog = await this.theiaApp.page.waitForSelector('div[class="dialogBlock"]');
        expect(await fileDialog.isVisible()).toBe(true);
        await this.theiaApp.page.locator('#theia-dialog-shell').press('Enter');
        expect(await fileDialog.isVisible()).toBe(false);
    }

    async createNewFolder(folderPath: string = 'project'): Promise<void> {
        await (await this.theiaApp.menuBar.openMenu('File')).clickMenuItem('New Folder...');

        const fileDialog = await this.theiaApp.page.waitForSelector('div[class="dialogBlock"]');
        expect(await fileDialog.isVisible()).toBe(true);
        await this.theiaApp.page.locator('#theia-dialog-shell').locator('.theia-input').fill(folderPath);
        await this.theiaApp.page.locator('#theia-dialog-shell').press('Enter');
        expect(await fileDialog.isVisible()).toBe(false);
    }

    async createAndOpenWorkspace(workspacePath: string): Promise<void> {
        const terminal = await this.theiaApp.openTerminal(TheiaTerminal);
        await terminal.submit(`mkdir ${workspacePath}`);
        await this.page.goto(this.baseURL + `/#/home/project/${workspacePath}`);
        await this.page.reload();
        await this.waitForReady();
    }

    async openWorkspace(workspacePath: string): Promise<void> {
        await this.page.goto(this.baseURL + `/#/home/project/${workspacePath}`);
        await this.page.reload();   
        await this.waitForReady;
    }

    async directAuthenticateScorpio(): Promise<void> {
        const allowButton = this.page.locator('.dialogBlock').getByRole('button', { name: 'Allow' });
    
        if (await allowButton.isVisible({ timeout: 5000 })) {
            await allowButton.click();
        } else {
            console.log('Scorpio authentication dialog not shown, skipping authentication.');
        }
    }

    setPage(page: Page) {
        this.page = page;
    }
}
