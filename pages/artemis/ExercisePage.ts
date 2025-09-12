import { Page, expect } from "@playwright/test";

/**
 * Page Object Model for the Exercise Page
 * Partially copied from the Artemis Page Object Model
 */
export class ExercisePage {
    readonly page: Page;
    readonly id: number;

    constructor(page: Page, id: number) {
        this.page = page;
        this.id = id;
    }

    async checkResultScore(expectedResult: string) {
        const resultScore = this.page.locator('#exercise-headers-information').locator('#result-score');
        await resultScore.waitFor({ state: 'visible' });
        await expect(resultScore.getByText(expectedResult)).toBeVisible();
    }

    async startParticipation() {
        const participationButton = await this.page.locator('#start-exercise-' + this.id);
        await participationButton.click();
        await this.getCodeButton().waitFor({ state: 'visible' });
    }

    async openInOnlineIDE() {
        const codeButtonLocator = this.getCodeButton();
        await codeButtonLocator.click();
        const openOnlineIDEButton = this.getOpenOnlineIDEButton();
        await openOnlineIDEButton.click();
    }

    async getCloneUrl() {
        return await this.page.locator('.clone-url').innerText();
    }

    getCodeButton() {
        return this.page.locator('.code-button');
    }

    getOpenOnlineIDEButton() {
        return this.page.getByTestId('openOnlineIDEButton');
    }
}