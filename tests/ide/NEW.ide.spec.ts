import { test, expect } from '../fixtures/NEWtheia.fixture';
import { TheiaTextEditor } from '../../theia-example/theia-text-editor';
import { TheiaExplorerView } from '../../theia-example/theia-explorer-view';
import { TheiaTerminal } from '../../theia-example/theia-terminal';

const testPrefix = 'NEWEditor-';

test.describe('Theia IDE Editor Tests', () => {
    test('Create new File', async ({ theiaApp }) => {
        const fileName = testPrefix + 'Test1';
        await (await theiaApp.menuBar.openMenu('File')).clickMenuItem('New File...');
        const quickPick = theiaApp.page.getByPlaceholder('Select File Type or Enter');
        // type file name and press enter
        await quickPick.fill(fileName);
        await quickPick.press('Enter');

        // check file dialog is opened and accept with ENTER
        const fileDialog = await theiaApp.page.waitForSelector('div[class="dialogBlock"]');
        expect(await fileDialog.isVisible()).toBe(true);
        await theiaApp.page.locator('#theia-dialog-shell').press('Enter');
        expect(await fileDialog.isVisible()).toBe(false);

        // check file in workspace exists
        const explorer = await theiaApp.openView(TheiaExplorerView);
        await explorer.refresh();
        //await explorer.waitForVisibleFileNodes();
        expect(await explorer.existsFileNode(fileName)).toBe(true);
    });

    test.afterAll(async ({ theiaApp }) => {
        const terminal = await theiaApp.openTerminal(TheiaTerminal);
        await terminal.write(`rm -rf ${testPrefix}*`);
    });

});
