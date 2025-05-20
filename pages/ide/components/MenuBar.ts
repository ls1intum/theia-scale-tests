import { BaseComponent } from './BaseComponent';

/**
 * Represents the top menu bar of the IDE
 * Handles interactions with File, Edit, View, etc. menus
 */
export class MenuBar extends BaseComponent {

    readonly pagePart = this.page.locator('#theia-top-panel');

    async waitForReady(): Promise<void> {
        await this.page.locator('#theia-top-panel').waitFor();
    }

    async clickFileMenu(): Promise<void> {
        await this.pagePart.getByText('File').click();
    }

    async clickMenuItem(menu: string, item: string): Promise<void> {
        await this.pagePart.getByText(menu).click();
        await this.page.locator('[class*="Menu-content"]').getByText(item).click();
    }

    async openNewFileDialog(): Promise<void> {
        await this.clickMenuItem('File', 'New File...');
    }

    async openNewFolderDialog(): Promise<void> {
        await this.clickMenuItem('File', 'New Folder...');
    }

    async openTerminal(): Promise<void> {
        await this.clickMenuItem('Terminal', 'New Terminal');
    }

    async pressUndo(): Promise<void> {
        await this.clickMenuItem('Edit', 'Undo');
    }

    async pressRedo(): Promise<void> {
        await this.clickMenuItem('Edit', 'Redo');
    }
} 