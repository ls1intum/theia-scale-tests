import { test, expect } from '../../../fixtures/theia.fixture';
import { TheiaTextEditor } from '../../../pages/ide/theia-pom/theia-text-editor';
import { uniqueWords10 } from '../../../utils/example-texts/lorem-ipsum';
import { TheiaTerminal } from '../../../pages/ide/theia-pom/theia-terminal';
import { TheiaSearchView } from '../../../pages/ide/custom-pom/theia-search';

/**
 * @description This test suite is used to test the search functionality of the IDE.
 */

const testPrefix = 'Search-';

test.describe('IDE Search Tests', () => {


    test('Search for text in the editor', async ({ cApp }) => {
        const fileName = testPrefix + 'Test1';
        await cApp.createNewFile(fileName);
        const editor = await cApp.theiaApp.openEditor(fileName, TheiaTextEditor);
        await editor.activate();
        await editor.addTextToNewLineAfterLineByLineNumber(1, uniqueWords10);
        await editor.save();
        const randomWord = getRandomWord(uniqueWords10);
        expect(randomWord).not.toBeNull();
        const line = await editor.textContentOfLineContainingText(randomWord!);
        expect(line).not.toBeNull();
        expect(line).toContain(randomWord!);
    });

    test('Search for text using menu bar', async ({ cApp }) => {
        const fileName = testPrefix + 'Test2';
        const randomWord = getRandomWord(uniqueWords10);
        expect(randomWord).not.toBeNull();
        await cApp.createNewFile(fileName);
        const editor = await cApp.theiaApp.openEditor(fileName, TheiaTextEditor);
        await editor.activate();
        await editor.addTextToNewLineAfterLineByLineNumber(1, uniqueWords10);
        await editor.save();
        await (await cApp.theiaApp.menuBar.openMenu('Edit')).clickMenuItem('Find');
        await editor.page.keyboard.type(randomWord!);
        await expect(editor.page.locator('.editor-widget').locator('.input').first()).toBeVisible();
        await expect(editor.page.locator('.editor-widget').locator('.input').getByText(randomWord!)).toBeDefined();
    });

    test('Search for text using sidebar', async ({ cApp }) => {
        const fileName = testPrefix + 'Test3';
        const randomWord = getRandomWord(uniqueWords10);
        expect(randomWord).not.toBeNull();
        await cApp.createNewFile(fileName);
        const editor = await cApp.theiaApp.openEditor(fileName, TheiaTextEditor);
        await editor.activate();
        await editor.addTextToNewLineAfterLineByLineNumber(1, uniqueWords10);
        await editor.save();
        const search = await cApp.theiaApp.openView(TheiaSearchView);
        await search.search(randomWord!);
        await expect(search.page.locator(search.viewSelector).locator('.resultContainer').getByText(randomWord!)).toBeVisible();
    });

    test('Search for text using sidebar multiple files', async ({ cApp }) => {
        const fileName = testPrefix + 'Test4';
        const randomWord = getRandomWord(uniqueWords10);
        expect(randomWord).not.toBeNull();
        await cApp.createNewFile(fileName + '1');
        await cApp.createNewFile(fileName + '2');
        const editor1 = await cApp.theiaApp.openEditor(fileName + '1', TheiaTextEditor);
        await editor1.activate();
        await editor1.addTextToNewLineAfterLineByLineNumber(1, uniqueWords10);
        await editor1.save();
        const editor2 = await cApp.theiaApp.openEditor(fileName + '2', TheiaTextEditor);
        await editor2.activate();
        await editor2.addTextToNewLineAfterLineByLineNumber(1, uniqueWords10);
        await editor2.save();
        const search = await cApp.theiaApp.openView(TheiaSearchView);
        await search.search(randomWord!);
        const occurences = await search.page.locator(search.viewSelector).locator('.resultContainer').getByText(randomWord!).all();
        expect(occurences.length).toBe(2);
    });



    test.afterAll(async ({ cApp }) => {
        const terminal = await cApp.theiaApp.openTerminal(TheiaTerminal);
        await terminal.submit('rm -rf ${testPrefix}*');
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