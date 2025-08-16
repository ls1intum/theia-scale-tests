import { Page } from "@playwright/test";

const isMac = process.platform === 'darwin';
const modifierKey = isMac ? 'Meta' : 'Control';

export const pasteFromString = async (page: Page, text: string) => {
    await page.evaluate((content) => {
        navigator.clipboard.writeText(content);
      }, text);
    await page.keyboard.press(`${modifierKey}+V`);
}

export const deleteAll = async (page: Page) => {
    await page.keyboard.press(`${modifierKey}+A`);
    await page.keyboard.press('Delete');
}

export const sleep = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}