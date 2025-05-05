import { Page } from '@playwright/test';

/**
 * A class which encapsulates the landing page of Theia with UI selectors.
 */
export class LandingPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('/');
    }

    async clickLoginButton() {
        return this.page.getByRole('button', { name: 'Login' }).click();
    }

    
}