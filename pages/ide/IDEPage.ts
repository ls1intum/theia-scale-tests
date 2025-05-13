import { Page } from '@playwright/test';

/**
 * A class which encapsulates the landing page of Theia with UI selectors.
 */
export class IDEPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async createNewFile(fileName: string) {
        await this.page.getByText('File', { exact: true }).click();
        await this.page.getByText('New File...').nth(1).click();
        await this.page.getByRole('combobox', { name: 'input' }).fill(fileName);
        await this.page.getByRole('option', { name: `Create New File (${fileName}),` }).locator('a').click();
        await this.page.getByRole('button', { name: 'Create File' }).click();
    }
}
