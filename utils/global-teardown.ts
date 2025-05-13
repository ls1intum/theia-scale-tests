import { FullConfig } from '@playwright/test';
import 'dotenv';
import fs from'fs';
import path from 'path';

/**
 * Global setup for Playwright tests.
 * Initializes the page context by logging in with the provided credentials.
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