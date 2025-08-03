import { Page } from '@playwright/test';
import { IDEPage } from '../../../../pages/ide/IDEPage';
import { TheiaApp } from '../../../../pages/ide/theia-pom/theia-app';
import { TheiaWorkspace } from '../../../../pages/ide/theia-pom/theia-workspace';
import path from 'path';
import { LandingPage } from '../../../../pages/landing/LandingPage';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../../../../playwright.env') });

const numUsers = parseInt(process.env.NUM_INSTANCES!, 10);
 
export const config = {
  target: process.env.LANDINGPAGE_URL!,
  engines: {
    playwright: {
      defaultNavigationTimeout: 300000,
    }
  },
  phases: [
    { duration: 1, arrivalRate: numUsers }
  ]
};
 
export const scenarios = [{
  engine: 'playwright',
  testFunction: virtualStudent
}];
 
async function virtualStudent(page: Page) {
    await page.goto(process.env.LANDINGPAGE_URL!);
    const landingPage = new LandingPage(page);
    await landingPage.login(process.env.KEYCLOAK_USER!, process.env.KEYCLOAK_PWD!);
    await landingPage.launchLanguage('Python');
    await page.waitForURL(/.*#\/home\/project/);
    const workspace = new TheiaWorkspace();
    workspace.setPath("/home/project");
    const theiaApp = new TheiaApp(page, workspace, false);
    const idePage = new IDEPage(page, theiaApp, page.url());
}
