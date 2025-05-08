import { Page } from '@playwright/test';

/**
 * A class which encapsulates the landing page of Theia with UI selectors.
 */
export class LandingPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async clickLoginButton() {
        return this.page.getByRole('button', { name: 'Login' }).click();
    }

    async login(username: string, password: string) {
        await this.clickLoginButton();
        await this.page.getByRole('textbox', { name: 'Username' }).fill(username);
        await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
        await this.page.getByRole('button', { name: 'Sign in' }).click();
    }
}