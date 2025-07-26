import { expect, test } from '../../../fixtures/theia.fixture';
import { TheiaTerminal } from '../../../pages/ide/theia-pom/theia-terminal';
import { TheiaTextEditor } from '../../../pages/ide/theia-pom/theia-text-editor';
import { readFileSync } from 'fs';
import { TheiaExplorerView } from '../../../pages/ide/theia-pom/theia-explorer-view';
import path from 'path';
import { pasteFromString } from '../../../fixtures/utils/commands';

const testPrefix = 'LoopExample';

test.describe('Ocaml Language Test', () => {
    test.describe.configure({ mode: 'serial' });

    test.use({
        permissions: ['clipboard-write', 'clipboard-read']
    })

    const ocamlTemplatePath = path.resolve(__dirname, '../../../fixtures/utils/templates/programming_languages/ocaml.template');
    const ocamlTemplate = readFileSync(ocamlTemplatePath, 'utf8');
    const expectedResultPath = path.resolve(__dirname, '../../../fixtures/utils/templates/programming_languages/expected_result.template');
    const expectedResult = readFileSync(expectedResultPath, 'utf8');
    const fileName = testPrefix + '.ml';

    const workspacePath = 'ocaml-test';

    test.beforeAll(async ({ ocamlApp }) => {
        await ocamlApp.createAndOpenWorkspace(workspacePath);
    });

    test.beforeEach(async ({ ocamlApp }) => {
        await ocamlApp.openWorkspace(workspacePath);
        await ocamlApp.theiaApp.workspace.setPath("/home/project/" + workspacePath);
    });

    test('Ocaml modules installed', async ({ ocamlApp }) => {
        const terminal = await ocamlApp.theiaApp.openTerminal(TheiaTerminal);
        await terminal.submit('ocaml --help');
        await terminal.submit('ocamlc --help');
        const contents = await terminal.contents();
        await expect(contents).toContain('ocaml <options>');
        await expect(contents).toContain('ocamlc <options> <files>');
    });

    test('Create Ocaml file', async ({ ocamlApp }) => {
        await ocamlApp.createNewFile(fileName);
        const editor = await ocamlApp.theiaApp.openEditor(fileName, TheiaTextEditor);
        await editor.activate();
        await editor.focus();
        await pasteFromString(ocamlApp.page, ocamlTemplate);
        await editor.save();
        await expect(await editor.textContentOfLineContainingText("Language is working and loops are running!")).toBeDefined();
    });

    test('Compile Ocaml file', async ({ ocamlApp }) => {
        const terminal = await ocamlApp.theiaApp.openTerminal(TheiaTerminal);
        await terminal.submit(`ocamlc ${fileName}`);
        const explorer = await ocamlApp.theiaApp.openView(TheiaExplorerView);
        await explorer.waitForVisible();
        await expect(await explorer.existsFileNode(`a.out`)).toBeTruthy();
    });

    test('Run Ocaml file', async ({ ocamlApp }) => {
        const terminal = await ocamlApp.theiaApp.openTerminal(TheiaTerminal);
        await terminal.submit(`ocaml ${fileName}`);
        const contents = await terminal.contents();
        await expect(contents).toContain(expectedResult);
    });

    test.afterAll(async ({ ocamlApp }) => {
        await ocamlApp.openWorkspace("");
        const terminal = await ocamlApp.theiaApp.openTerminal(TheiaTerminal);
        await terminal.submit(`rm -rf ${workspacePath}`);
    });
});