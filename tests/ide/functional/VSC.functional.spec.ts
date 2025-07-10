import { test, expect } from '../../../fixtures/theia.fixture';
import { TheiaTerminal } from '../../../pages/ide/theia-pom/theia-terminal';
import { TheiaVSCView } from '../../../pages/ide/custom-pom/theia-vsc';

const testPrefix = 'VSC-';

test.describe('Theia IDE VSC Tests', () => {

    test.use({
        permissions: ['clipboard-write', 'clipboard-read']
    })
    
    test('Commit', async ({ cApp }) => {
        const terminal = await cApp.theiaApp.openTerminal(TheiaTerminal);
        await expect(terminal.page.locator(terminal.viewSelector)).toBeVisible();
        await terminal.submit('git init');
        await terminal.submit('touch ' + testPrefix + 'Test1');
        const vsc = await cApp.theiaApp.openView(TheiaVSCView);
        await vsc.commit('Initial commit');
    });


    test.afterAll(async ({ cApp }) => {
        const terminal = await cApp.theiaApp.openTerminal(TheiaTerminal);
        await terminal.submit('rm -rf ${testPrefix}*');
    });

});
