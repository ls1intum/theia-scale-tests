import { test, expect } from '../../../fixtures/theia.fixture';
import { pasteFromString } from '../../../fixtures/utils/commands';
import { TheiaExplorerView } from '../../../pages/ide/theia-pom/theia-explorer-view';
import { TheiaTerminal } from '../../../pages/ide/theia-pom/theia-terminal';
import { TheiaTextEditor } from '../../../pages/ide/theia-pom/theia-text-editor';

const testPrefix = 'Editor-';

/**
 * We use a different app for each test to avoid race conditions with file creation.
 */

test.describe('Theia IDE Editor Tests', () => {
    test.describe.configure({ mode: 'serial' });

    test.use({
        permissions: ['clipboard-write', 'clipboard-read']
    })
    
    test('Create new File', async ({ cApp }) => {
        const fileName = testPrefix + 'Test1';
        await cApp.createNewFile(fileName);
        const explorer = await cApp.theiaApp.openView(TheiaExplorerView);
        await explorer.refresh();
        expect(await explorer.existsFileNode(fileName)).toBe(true);
        await cApp.theiaApp.page.locator('#theia\\:menubar .p-MenuBar-itemLabel').locator('text=File')
    });

    test('Create File with content', async ({ cApp }) => {
        const fileName = testPrefix + 'Test2';
        await cApp.createNewFile(fileName);
        const editor = await cApp.theiaApp.openEditor(fileName, TheiaTextEditor);
        await editor.activate();
        await editor.addTextToNewLineAfterLineByLineNumber(1, 'Hello World');
        expect(await editor.textContentOfLineByLineNumber(2)).toContain('Hello World');
    });

    test('Undo and Redo text in file', async ({ cApp }) => {
        const fileName = testPrefix + 'Test3';
        const text = 'undoredo';
        await cApp.createNewFile(fileName);
        const editor = await cApp.theiaApp.openEditor(fileName, TheiaTextEditor);
        await editor.activate(); 
        await editor.addTextToNewLineAfterLineByLineNumber(1, text);
        await (await cApp.theiaApp.menuBar.openMenu('Edit')).clickMenuItem('Undo');
        expect(await editor.numberOfLines()).toBe(1);
        await (await cApp.theiaApp.menuBar.openMenu('Edit')).clickMenuItem('Redo');
        expect(await editor.textContentOfLineByLineNumber(2)).toContain(text);
    });

    test('Delete File', async ({ cApp }) => {
        const fileName = testPrefix + 'Test4';
        await cApp.createNewFile(fileName);
        const editor = await cApp.theiaApp.openEditor(fileName, TheiaTextEditor);
        await editor.activate();
        await editor.save();
        const explorer = await cApp.theiaApp.openView(TheiaExplorerView);
        const oldNodes = (await explorer.visibleFileStatNodes()).length;
        expect(await explorer.existsFileNode(fileName)).toBe(true);
        await explorer.deleteNode(fileName);
        await explorer.waitForFileNodesToDecrease(oldNodes);
        const newNodes = (await explorer.visibleFileStatNodes()).length;
        expect(oldNodes).toBe(newNodes + 1);
    });

    test('Create new File in folder', async ({ cApp }) => {
        const fileName = testPrefix + 'Test5';
        const folderPath = testPrefix + 'Folder-1';
        await cApp.createNewFolder(folderPath);
        await cApp.createNewFile(folderPath + '/' + fileName);
        const explorer = await cApp.theiaApp.openView(TheiaExplorerView);
        expect(await explorer.existsDirectoryNode(folderPath)).toBe(true);
        //expect(await explorer.existsFileNode(fileName)).toBe(true);
    });

    test('Test copy from String', async ({ cApp }) => {
        const text = 'Hello World';
        const fileName = testPrefix + 'Test6';
        await cApp.createNewFile(fileName);
        const editor = await cApp.theiaApp.openEditor(fileName, TheiaTextEditor);
        await editor.activate();
        await pasteFromString(cApp.page, text);
        expect(await editor.textContentOfLineContainingText(text)).toBeDefined();
    });

    test.afterAll(async ({ cApp }) => {
        const terminal = await cApp.theiaApp.openTerminal(TheiaTerminal);
        await terminal.submit('rm -rf ${testPrefix}*');
    });

});
