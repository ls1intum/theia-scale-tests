import { test as base, Page } from '@playwright/test';
import { TheiaApp } from '../../pages/theia-example/theia-app';
import { TheiaWorkspace } from '../../pages/theia-example/theia-workspace';
import fs from 'fs';
import path from 'path';

interface TheiaFixtures {
    theiaApp: TheiaApp;
}

export const test = base.extend<TheiaFixtures>({
    theiaApp: async ({ browser }, use) => {
        // Read IDE URL from file
        const urlPath = path.join(process.cwd(), 'test-data', 'ide-url.txt');
        const ideURL = fs.readFileSync(urlPath, 'utf8');
        
        const page = await browser.newPage();
        
        // Create a default workspace (this will create a temp directory)
        const workspace = new TheiaWorkspace();
        //workspace.initialize();

        workspace.setPath("/home/project");

        // Create the app instance
        const theiaApp = new TheiaApp(page, workspace, false);
        
        // Navigate to the IDE with the default workspace
        await page.goto(ideURL);
        
        // Wait for the app to be ready
        await theiaApp.waitForShellAndInitialized();
        
        await use(theiaApp);
        
        await page.close();
    }
});

export { expect } from '@playwright/test'; 