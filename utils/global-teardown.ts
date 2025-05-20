import { FullConfig } from '@playwright/test';
import 'dotenv';
import fs from'fs';
import path from 'path';

/**
 * Global teardown for Playwright tests.
 * Deletes the auth file after the tests are run.
 */
async function globalTeardown(config: FullConfig) {
  console.log('Running global teardown...');

  const authFilePath = path.resolve(__dirname, '../.auth/user.json');
  if (fs.existsSync(authFilePath)) {
    fs.unlinkSync(authFilePath);
  }

  console.log('Global teardown completed.');
}

export default globalTeardown;