import { FullConfig } from '@playwright/test';
import 'dotenv';

/**
 * Global setup for Playwright tests.
 * Initializes the page context by logging in with the provided credentials.
 */
async function globalSetup(config: FullConfig) {
  console.log('Running global setup...');

  if (!process.env.BASE_URL || !process.env.KEYCLOAK_USER || !process.env.KEYCLOAK_PWD) {
    throw new Error('BASE_URL, USERNAME, or PASSWORD environment variable is not set');
  }

  console.log('Global setup completed.');
}

export default globalSetup;