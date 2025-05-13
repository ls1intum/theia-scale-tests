import { BaseComponent } from './BaseComponent';

/**
 * Represents the main editor area of the IDE
 * Handles interactions with the code editor
 */
export class Editor extends BaseComponent {
    async waitForReady(): Promise<void> {
        // Wait for the editor area to be visible
        await this.page.locator('#theia-main-content-panel').waitFor();
    }

    async typeText(text: string): Promise<void> {
        await this.page.keyboard.type(text);
    }

    async getCurrentText(): Promise<string> {
        return await this.page.locator('.monaco-editor').textContent() || '';
    }

    async focusOpenedFile(fileName: string): Promise<void> {
        await this.page.locator('.theia-tabBar-tab-row').getByText(fileName).click();
    }

    async selectAll(): Promise<void> {
        // Use OS-specific keyboard shortcuts
        const isMac = process.platform === 'darwin';
        const modifier = isMac ? 'Meta' : 'Control';
        await this.page.keyboard.press(`${modifier}+a`);
    }

    async save(): Promise<void> {
        const isMac = process.platform === 'darwin';
        const modifier = isMac ? 'Meta' : 'Control';
        await this.page.keyboard.press(`${modifier}+s`);
    }

    async undo(): Promise<void> {
        const isMac = process.platform === 'darwin';
        const modifier = isMac ? 'Meta' : 'Control';
        await this.page.keyboard.press(`${modifier}+z`);
    }

    async redo(): Promise<void> {
        const isMac = process.platform === 'darwin';
        const modifier = isMac ? 'Meta' : 'Control';
        const key = isMac ? 'Meta+Shift+z' : 'Control+y';
        await this.page.keyboard.press(key);
    }
} 