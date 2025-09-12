import { test as setup, chromium } from '@playwright/test';
import { LandingPage } from '../../pages/landing/LandingPage';
import { TestInfo } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * @remarks
 * This function is used to start the instance and get the IDE URL.
 * @tag slow (starting the instance takes a while)
 * @description This function automates the starting process for the LandingPage UI.
 */
const instances = process.env.NUM_INSTANCES ? parseInt(process.env.NUM_INSTANCES) : 1;

//TODO: Remove skip
setup('Start ' + instances + ' instances', async ({ }, testInfo) => {
  setup.slow();
  const setupPromises = Array.from({ length: instances }, (_, i) => {
    return setupIDE("Java", testInfo, i);
  });

  await Promise.all(setupPromises);
}); 


async function setupIDE(language: string, testInfo: TestInfo, identifier: number) {
  const browser = await chromium.launch();
  let context;

  if (testInfo.project.name !== 'local') {
    context = await browser.newContext({ 
      storageState: '.auth/keycloak_user.json'
    });
  } else {
    context = await browser.newContext();
  }

  const page = await context.newPage();

  if (testInfo.project.name !== 'local') {
    const landingPage = new LandingPage(page);
    await page.goto('/');
    await landingPage.launchLanguage(language);
    await page.waitForURL(/.*#\/home\/project/);
  } else {
    await page.goto(`/`);
    await page.waitForURL(/.*#\/home\/project/);
  }

  await page.waitForLoadState('domcontentloaded');
  
  const ideURL = page.url();
  const testDataDir = path.join(process.cwd(), 'test-data/scale');
  if (!fs.existsSync(testDataDir)) {
    fs.mkdirSync(testDataDir, { recursive: true });
  }
  fs.writeFileSync(path.join(testDataDir, 'ide-url-' + identifier + '.txt'), ideURL);

  await context.close();
  await browser.close();
}