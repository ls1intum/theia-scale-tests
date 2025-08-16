import { Page } from '@playwright/test';
import { LandingPage } from '../../../../pages/landing/LandingPage';
import { virtualStudent } from '../VirtualStudents';
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
    await landingPage.launchLanguage('Java');
    await page.waitForURL(/.*#\/home\/project/);
    await virtualStudent(page);
}
