import { Page } from '@playwright/test';
import { LandingPage } from '../../../../pages/landing/LandingPage';
import { virtualStudent0, virtualStudent1 } from '../VirtualStudents';
import dotenv from 'dotenv';
import path from 'path';

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
  testFunction: runVirtualStudent
}];
 
async function runVirtualStudent(page: Page) {
    await page.goto(process.env.LANDINGPAGE_URL!);
    const landingPage = new LandingPage(page);
    await landingPage.login(process.env.KEYCLOAK_USER!, process.env.KEYCLOAK_PWD!);
    await landingPage.launchLanguage('Python');
    await page.waitForURL(/.*#\/home\/project/);
    const condition = Math.floor(Math.random() * 2);
    if (condition === 0) {
        await virtualStudent0(page);
    } else {
        await virtualStudent1(page);
    }
}
