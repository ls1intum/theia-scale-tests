import { test, expect } from '../fixtures/ide.fixture';
import { uniqueWords10, uniqueWords20, uniqueWords30 } from '../../utils/example-texts/lorem-ipsum';
import { get } from 'http';

/**
 * @description This test suite is used to test the search functionality of the IDE.
 */

const testPrefix = 'Search-';

test.describe('IDE Search Tests', () => {

    test('Search for text in a file', async ({ idePage }) => {
        const fileName = testPrefix + 'Test1';
        const word = getRandomWord(uniqueWords10) ?? 'Technology';
        await idePage.createFileWithContent(fileName, uniqueWords10);
        await idePage.menuBar.pressFind();
        await expect(idePage.editor.pagePart.locator('.editor-widget').locator('.input').first()).toBeVisible();
        await idePage.page.keyboard.type(word);
        await expect(idePage.editor.pagePart.locator('.editor-widget').getByText('1 of 1')).toBeVisible
    });

    test('Search for text globally', async ({ idePage }) => { 
        const fileName = testPrefix + 'Test2';
        const word = getRandomWord(uniqueWords20) ?? 'Artificial';
        await idePage.createFileWithContent(fileName, uniqueWords20);
        await idePage.sideBar.openSearch();
        await expect(idePage.sideBar.pagePart.locator('.theia-sidepanel-title').getByText('SEARCH')).toBeVisible();
        await idePage.sideBar.searchForText(word);
        await idePage.sideBar.pagePart.locator('.resultContainer').getByText(word).isVisible();
    });

    test('Search for text globally in multiple files', async ({ idePage }) => { 
        const fileName1 = testPrefix + 'Test30';
        const fileName2 = testPrefix + 'Test31';
        const word = getRandomWord(uniqueWords30) ?? 'Software';
        await idePage.createFileWithContent(fileName1, uniqueWords30);
        await idePage.createFileWithContent(fileName2, uniqueWords30);
        await idePage.sideBar.openSearch();
        await expect(idePage.sideBar.pagePart.locator('.theia-sidepanel-title').getByText('SEARCH')).toBeVisible();
        await idePage.sideBar.searchForText(word);
        const occurences = await idePage.sideBar.pagePart.locator('.resultContainer').getByText(word).all();
        expect(occurences.length).toBe(2);
        });

    test.afterAll(async ({ idePage }) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await idePage.executeInTerminal(`rm -rf ${testPrefix}*`);
    });
});


// Utility Functions

/**
 * @description Get a random word from a text
 * @param text - The text to get a random word from
 * @returns A random word from the text
 */
function getRandomWord(text: string): string | null {
    const words = text.trim().split(/\s+/);
    if (words.length === 0) return null;
  
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }