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
    }

    /**
     * Creates a new file with the given name
     * @param fileName Name of the file to create
     */
    async createNewFile(fileName: string = 'Test-1'): Promise<void> {
        await this.menuBar.openNewFileDialog();
        await this.page.getByRole('combobox', { name: 'input' }).fill(fileName);
        await this.page.getByRole('option', { name: `Create New File (${fileName}),` }).locator('a').click();
        await this.page.getByRole('button', { name: 'Create File' }).click();
    }

    /**
     * Opens a file from the explorer
     * @param fileName Name of the file to open
     */
    async openFile(fileName: string): Promise<void> {
        await this.sideBar.toggleExplorer();
        await this.sideBar.selectFile(fileName);
        await this.sideBar.toggleExplorer();
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
     * Opens the integrated terminal and executes a command
     * @param command Command to execute
     */
    async executeInTerminal(command: string): Promise<string> {
        await this.terminal.open();
        await this.terminal.executeCommand(command);
        return await this.terminal.getTerminalOutput();
    }

    // Functions that return important locators for testing

    getOpenedFileLocator(fileName: string): Locator {
        return this.page.getByRole('listitem', { name: `/home/project/${fileName}` });
    }

}
