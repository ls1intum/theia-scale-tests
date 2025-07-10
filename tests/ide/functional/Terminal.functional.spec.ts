import { test, expect } from '../../../fixtures/theia.fixture';
import { TheiaTerminal } from '../../../pages/ide/theia-pom/theia-terminal';
import { TheiaExplorerView } from '../../../pages/ide/theia-pom/theia-explorer-view';

const testPrefix = 'Terminal-';

test.describe('Theia IDE Terminal Tests', () => {

    test.use({
        permissions: ['clipboard-write', 'clipboard-read']
    })
    
    test('Open Terminal', async ({ cApp }) => {
        const terminal = await cApp.theiaApp.openTerminal(TheiaTerminal);
        await expect(terminal.page.locator(terminal.viewSelector)).toBeVisible();
        expect(await terminal.isTabVisible()).toBe(true);
        expect(await terminal.isDisplayed()).toBe(true);
        expect(await terminal.isActive()).toBe(true);
    });

    test('Terminal command: ls', async ({ cApp }) => {
        const terminal = await cApp.theiaApp.openTerminal(TheiaTerminal);
        await expect(terminal.page.locator(terminal.viewSelector)).toBeVisible();
        const fileName = testPrefix + 'Test1';
        await cApp.createNewFile(fileName);
        await terminal.submit('ls');
        const contents = await terminal.contents();
        expect(contents).toContain(fileName);
    });

    test('Terminal command: touch', async ({ cApp }) => {
        const terminal = await cApp.theiaApp.openTerminal(TheiaTerminal);
        await expect(terminal.page.locator(terminal.viewSelector)).toBeVisible();
        const fileName = testPrefix + 'Test2';
        await terminal.submit('touch ' + fileName);
        await terminal.submit('ls');
        const contents = await terminal.contents();
        expect(contents).toContain(fileName);
        const explorer = await cApp.theiaApp.openView(TheiaExplorerView);
        await explorer.refresh();
        expect(await explorer.existsFileNode(fileName)).toBe(true);
    });

    test('Terminal command: rm', async ({ cApp }) => {
        const terminal = await cApp.theiaApp.openTerminal(TheiaTerminal);
        const fileName = testPrefix + 'Test3';
        await terminal.submit('touch ' + fileName);
        await terminal.submit('rm ' + fileName);
        await terminal.submit('ls');
        const contents = await terminal.contents();
        expect(contents).not.toContain(fileName);
        const explorer = await cApp.theiaApp.openView(TheiaExplorerView);
        await explorer.refresh();
        expect(await explorer.existsFileNode(fileName)).toBe(false);
    });

    test('Terminal multiple tabs', async ({ cApp }) => {
        const terminal1 = await cApp.theiaApp.openTerminal(TheiaTerminal);
        const terminal2 = await cApp.theiaApp.openTerminal(TheiaTerminal);
        expect(await terminal1.isTabVisible()).toBe(true);
        expect(await terminal2.isTabVisible()).toBe(true);
        await terminal1.activate();
        await terminal1.submit('echo "Hello" > ' + testPrefix + 'Test4');
        await terminal2.activate();
        await terminal2.submit('cat ' + testPrefix + 'Test4');
        const contents = await terminal2.contents();
        expect(contents).toContain('Hello');
        await terminal1.close();
        await terminal2.close();
        expect(await terminal1.isTabVisible()).toBe(false);
        expect(await terminal2.isTabVisible()).toBe(false);
    });




    test.afterAll(async ({ cApp }) => {
        const terminal = await cApp.theiaApp.openTerminal(TheiaTerminal);
        await terminal.submit('rm -rf ${testPrefix}*');
    });

});
