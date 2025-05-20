import { test as base, Page } from '@playwright/test';
import { LandingPage } from './../../pages/landing/LandingPage';
import { IDEPage } from '../../pages/ide/IDEPage';
import fs from 'fs';
import path from 'path';

interface IDEFixtures {
  idePage: IDEPage;
  landingPage: LandingPage;
}

export const test = base.extend<IDEFixtures>({
  idePage: async ({ browser }, use) => {
    const urlPath = path.join(process.cwd(), 'test-data', 'ide-url.txt');
    const ideURL = fs.readFileSync(urlPath, 'utf8');
    
    const page = await browser.newPage();
    await page.goto(ideURL);
    
    const idePage = new IDEPage(page);
    await idePage.waitForReady();
    
    await use(idePage);

    await page.close();
  },
  landingPage: async ({ browser }, use) => {
    const page = await browser.newPage();
    await page.goto('/');
    const landingPage = new LandingPage(page);

    await use(landingPage);

    await page.close();
  }
});

export { expect } from '@playwright/test'; 