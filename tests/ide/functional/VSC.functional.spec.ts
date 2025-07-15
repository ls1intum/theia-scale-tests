import { test, expect } from '../../../fixtures/theia.fixture';
import { TheiaTerminal } from '../../../pages/ide/theia-pom/theia-terminal';
import { TheiaVSCView } from '../../../pages/ide/custom-pom/theia-vsc';

const testPrefix = 'VSC-';

test.describe('Theia IDE VSC Tests', () => {
    test.describe.configure({ mode: 'serial' });

    test.use({
        permissions: ['clipboard-write', 'clipboard-read']
    })

    test.beforeAll(async ({ pythonApp }) => {
        const terminal = await pythonApp.theiaApp.openTerminal(TheiaTerminal);
        await terminal.submit('git init');
        await terminal.submit('git config --global user.email "test@test.com"');
        await terminal.submit('git config --global user.name "Test User"');
        await terminal.submit('git status');
        const contents = await terminal.contents();
        await expect(contents).not.toContain('not a git repository');
    });
    
    test('Commit', async ({ pythonApp }) => {
        const terminal = await pythonApp.theiaApp.openTerminal(TheiaTerminal);
        await expect(terminal.page.locator(terminal.viewSelector)).toBeVisible();
        await terminal.submit('touch ' + testPrefix + 'Test1');
        const vsc = await pythonApp.theiaApp.openView(TheiaVSCView);
        await vsc.commit('Initial commit');
        await terminal.submit('git status');
        const contents = await terminal.contents();
        await expect(contents).not.toContain('No commits yet');
    });

    test.fixme('Push', async ({ pythonApp }) => {
    });

    test.afterAll(async ({ pythonApp }) => {
        const terminal = await pythonApp.theiaApp.openTerminal(TheiaTerminal);
        await terminal.submit('rm -rf ${testPrefix}*');
        await terminal.submit('rm -rf .git');

    });

});
