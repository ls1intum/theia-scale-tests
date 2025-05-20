import { expect } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

/**
 * Represents the side bar of the IDE
 * Handles interactions with file explorer, search, git, etc.
 */
export class SideBar extends BaseComponent {

    readonly pagePart = this.page.locator('#theia-left-content-panel');

    async waitForReady(): Promise<void> {
        await this.page.locator('#theia-left-content-panel').first().waitFor();
    }

    // Start of Explorer Section

    async toggleExplorer(): Promise<void> {
        await this.pagePart.locator('#shell-tab-explorer-view-container').click();
    }

    async openExplorer(): Promise<void> {
        if (await this.pagePart.locator('.theia-sidepanel-title').getByText('EXPLORER').isHidden()) {
            await this.pagePart.locator('#shell-tab-explorer-view-container').click();
        }
    }

    async closeExplorer(): Promise<void> {
        if (await this.pagePart.locator('.theia-sidepanel-title').getByText('EXPLORER').isVisible()) {
            await this.pagePart.locator('#shell-tab-explorer-view-container').click();
        }
    }

    /**
     * Opens all folders in the given path in the explorer
     * @param folderPath Path of the folder to open in type '/folder1/folder2/folder3/file'
     */
    async openFolderPath(folderPath: string): Promise<void> {
        const segments = folderPath.split("/").filter(Boolean);
        for (const segment of segments) {
            if (await this.page.locator('#theia-left-side-panel').getByTitle(segment).last().locator(`.theia-mod-collapsed`).isVisible()) {
                await this.page.locator('#theia-left-side-panel').getByTitle(segment).last().locator(`.theia-mod-collapsed`).click();
            }
        }
    }

    // End of Explorer Section

    // Start of Search Section

    async openSearch(): Promise<void> {
        await this.pagePart.locator('#shell-tab-search-view-container').click();
    }

    // End of Search Section

    // Start of Git Section

    async openGit(): Promise<void> {
        await this.pagePart.locator('#shell-tab-scm-view-container').click();
    }

    // End of Git Section

    async selectFile(fileName: string): Promise<void> {
        await this.pagePart.locator('#theia-left-side-panel').getByTitle(`/home/project/${fileName}`).dblclick();
    }

    async deleteFile(fileName: string): Promise<void> {
        await expect(async () => {
            await this.pagePart.locator('#theia-left-side-panel').getByTitle(`/home/project/${fileName}`).click({ button: "right" });
            await expect(this.page.locator('[class*="Menu-content"]')).toBeVisible();
          }).toPass();
        await this.page.locator('[class*="Menu-content"]').locator('[class*="Menu-itemLabel"]').getByText('Delete').click();
        await this.page.locator('.dialogBlock').getByText('OK').click();
    }

} 