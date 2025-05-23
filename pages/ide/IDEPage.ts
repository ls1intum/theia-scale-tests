import { Page, Locator } from '@playwright/test';
import { MenuBar } from './components/MenuBar';
import { Editor } from './components/Editor';
import { SideBar } from './components/SideBar';
import { Terminal } from './components/Terminal';

/**
 * Main IDE page class that composes all IDE components
 * Provides high-level operations that may involve multiple components
 */
export class IDEPage {
    readonly page: Page;
    readonly menuBar: MenuBar;
    readonly editor: Editor;
    readonly sideBar: SideBar;
    readonly terminal: Terminal;

    constructor(page: Page) {
        this.page = page;
        this.menuBar = new MenuBar(page);
        this.editor = new Editor(page);
        this.sideBar = new SideBar(page);
        this.terminal = new Terminal(page);
    }

    /**
     * Wait for all essential IDE components to be ready
     */
    async waitForReady(): Promise<void> {
        await this.menuBar.waitForReady();
        await this.editor.waitForReady();
        await this.sideBar.waitForReady();
        await this.page.locator('.gs-header').waitFor({ state: 'visible' });
        await new Promise( resolve => setTimeout(resolve, 2000) );
    }

    /**
     * Creates a new file with the given name
     * @param fileName Name of the file to create
     */
    async createNewFile(fileName: string = 'Test-1', directory: string = 'project'): Promise<void> {
        await this.menuBar.openNewFileDialog();
        await this.page.getByRole('combobox', { name: 'input' }).fill(fileName);
        await this.page.getByRole('option', { name: `Create New File (${fileName}),` }).locator('a').click();
        await this.page.getByRole('combobox').selectOption('file:///home/' + directory);
        await this.page.getByRole('button', { name: 'Create File' }).click();
    }

    async createNewFolder(folderName: string = 'Folder-1'): Promise<void> {
        await this.menuBar.openNewFolderDialog();
        await this.page.locator('.dialogBlock').getByRole('textbox', { name: 'Folder Name' }).fill(folderName);
        await this.page.locator('.dialogBlock').getByRole('button', { name: 'OK' }).click();
    }

    /**
     * Opens a file from the explorer
     * @param fileName Name of the file to open
     */
    async openFile(fileName: string): Promise<void> {
        await this.sideBar.openExplorer();
        await this.sideBar.selectFile(fileName);
    }

    /**
     * Creates a new file with content
     * @param fileName Name of the file
     * @param content Content to write in the file
     */
    async createFileWithContent(fileName: string, content: string): Promise<void> {
        await this.createNewFile(fileName);
        await this.editor.focusOpenedFile(fileName);
        await this.editor.typeText(content);
        await this.editor.save();
    }

    /**
     * Deletes a file from the explorer
     * @param fileName Name of the file to delete
     */
    async deleteFile(fileName: string): Promise<void> {
        await this.sideBar.openExplorer();
        await this.sideBar.deleteFile(fileName);
        await this.page.locator('.codicon-info').first().waitFor({ state: 'hidden' });
        await new Promise( resolve => setTimeout(resolve, 2000) );
    }
    

    /**
     * Opens the integrated terminal and executes a command
     * @param command Command to execute
     */
    async executeInTerminal(command: string): Promise<string> {
        await this.terminal.open();
        await this.terminal.executeCommand(command);
        return await this.terminal.getTerminalOutput();
    }

    // Functions that return important locators for testing

    // returns locator for file in the editor
    getEditorOpenedFileLocator(fileName: string): Locator {
        return this.editor.pagePart.getByRole('listitem', { name: `/home/project/${fileName}` });
    }

    // returns locator for file in the file explorer
    getExplorerOpenedFileLocator(fileName: string): Locator {
        return this.sideBar.pagePart.locator(`#explorer-view-container`).getByTitle(`/home/project/${fileName}`);
    }

}
