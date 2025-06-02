import { test as base, Page } from '@playwright/test';
import { TheiaApp } from '../../theia-example/theia-app';
import { TheiaWorkspace } from '../../theia-example/theia-workspace';
import fs from 'fs';
import path from 'path';

interface TheiaFixtures {
    theiaApp: TheiaApp;
}

export const test = base.extend<TheiaFixtures>({
    theiaApp: async ({ browser }, use) => {
        // Read IDE URL from file, same as your original fixture
        const urlPath = path.join(process.cwd(), 'test-data', 'ide-url.txt');
        const ideURL = fs.readFileSync(urlPath, 'utf8');
        
        const page = await browser.newPage();
        await page.goto(ideURL);
        
        // Initialize Theia POM with the current working directory
        // The POM will handle path normalization internally
        const workspace = new TheiaWorkspace([process.cwd()]);
        workspace.initialize();
        
        const theiaApp = new TheiaApp(page, workspace, false);
        await theiaApp.waitForShellAndInitialized();
        
        await use(theiaApp);
        
        await page.close();
    }
});

export { expect } from '@playwright/test'; 