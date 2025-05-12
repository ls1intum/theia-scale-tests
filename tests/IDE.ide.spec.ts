import { test, expect, chromium, BrowserContext, Page } from '@playwright/test';
import { IDEPage } from '../pages/IDEPage';
import { LandingPage } from '../pages/LandingPage';

let context: BrowserContext;
let page: Page;

test.describe('IDE Tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(`${process.env.INSTANCE_URL}/`);
        await page.waitForURL(/.*#\/home\/project/);
    });
    
    test('IDE: Create new File', async ( {page} ) => {
        const idePage = new IDEPage(page);
        await idePage.createNewFile();
        await expect(page.getByRole('listitem', { name: '/Untitled-' })).toBeVisible();
      });


})