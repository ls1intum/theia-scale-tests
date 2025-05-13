import { BaseComponent } from './BaseComponent';

/**
 * Represents the side bar of the IDE
 * Handles interactions with file explorer, search, git, etc.
 */
export class SideBar extends BaseComponent {
    async waitForReady(): Promise<void> {
        await this.page.locator('#theia-left-content-panel div').waitFor();
    }

    async toggleExplorer(): Promise<void> {
        await this.page.locator('#shell-tab-explorer-view-container').click();
    }

    async openSearch(): Promise<void> {
        await this.page.locator('#shell-tab-search-view-container').click();
    }

    async openGit(): Promise<void> {
        await this.page.locator('#shell-tab-scm-view-container').click();
    }

    async selectFile(fileName: string): Promise<void> {
        await this.page.locator('#theia-left-side-panel').getByTitle(`/home/project/${fileName}`).click();
    }

} 