import { Locator } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

/**
 * Represents the integrated terminal in the IDE
 * Handles interactions with the terminal panel
 */
export class Terminal extends BaseComponent {

    private readonly terminalLocator: Locator = this.page.locator('#theia-bottom-content-panel');

    async waitForReady(): Promise<void> {
        await this.terminalLocator.waitFor();
        await this.page.getByRole('listitem', { name: 'Terminal' }).waitFor();
    }

    async open(): Promise<void> {
        await this.page.locator('#theia-top-panel').getByText('Terminal').click();
        await this.page.locator('[class*="Menu-content"]').getByText('New Terminal').nth(0).click();
        await this.waitForReady();
    }

    async executeCommand(command: string): Promise<void> {
        await this.page.locator('#theia-bottom-content-panel').getByRole('listitem', { name: 'Terminal' }).first().click();
        await this.page.keyboard.type(command);
        await this.page.keyboard.press('Enter');
    }

    async getTerminalOutput(): Promise<string> {
        // Get the last line from terminal
        const output = await this.page.locator('#theia-bottom-content-panel').locator('.xterm').textContent();
        return output || '';
    }

    async clear(): Promise<void> {
        await this.executeCommand('clear');
    }

    async close(): Promise<void> {
        await this.executeCommand('exit');
    }

    async focusTerminal(): Promise<void> {
        await this.terminalLocator.getByRole('listitem', { name: 'Terminal' }).first().click();
    }
} 