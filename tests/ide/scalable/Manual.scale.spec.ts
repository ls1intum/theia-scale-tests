import { test } from '@playwright/test';
import { virtualStudent0, virtualStudent1 } from './VirtualStudents';
import path from 'path';
import fs from 'fs';

const numUsers = parseInt(process.env.NUM_INSTANCES!, 10);

// Generate an array of test conditions
const testConditions = Array.from({ length: numUsers }, (_, i) => ({ id: i }));

//IF we need to use differnet users, login here with each user
test.describe.parallel('Scalable Virtual Student Tests', () => {
  for (const condition of testConditions) {
    test(`Virtual student #${condition.id + 1}`, async ({ page }) => {
        const urlPath = path.join(process.cwd(), 'test-data/scale', 'ide-url-' + condition.id + '.txt');
        const ideURL = fs.readFileSync(urlPath, 'utf8');
        await page.goto(ideURL);
        
        // Use the condition (e.g., ID to randomize behavior)
        console.log(`Running test for virtual student ${condition.id}`);
        if (condition.id % 2 === 0) {
            await virtualStudent0(page);
        } else {
            await virtualStudent1(page);
        }
    });
  }
});
