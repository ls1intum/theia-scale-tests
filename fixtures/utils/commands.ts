import { Page } from "@playwright/test";

const isMac = process.platform === 'darwin';
const modifierKey = isMac ? 'Meta' : 'Control';

export const pasteFromString = async (page: Page, text: string) => {
    await page.evaluate((content) => {
        navigator.clipboard.writeText(content);
      }, text);
    await page.keyboard.press(`${modifierKey}+V`);
}