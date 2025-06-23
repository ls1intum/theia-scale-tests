import { test, expect } from '../../../fixtures/theia.fixture';
import { TheiaTextEditor } from '../../../pages/ide/theia-pom/theia-text-editor';
import { uniqueWords10, uniqueWords20, uniqueWords30 } from '../../../utils/example-texts/lorem-ipsum';
import { get } from 'http';

/**
 * @description This test suite is used to test the search functionality of the IDE.
 */

const testPrefix = 'Search-';

test.describe('IDE Search Tests', () => {


    test.skip('Search for text in a file', async ({ cApp }) => {
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

    test.afterAll(async ({ cApp }) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
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