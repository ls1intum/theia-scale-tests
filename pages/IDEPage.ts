import { Page } from '@playwright/test';

/**
 * A class which encapsulates the landing page of Theia with UI selectors.
 */
export class IDEPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async createNewFile() {
        await this.page.getByRole('menuitem', { name: 'File' }).click();
        await this.page.getByText('New Text File').click();
    }
}