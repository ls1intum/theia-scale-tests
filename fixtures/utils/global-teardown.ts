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

  const keycloakAuthFilePath = path.resolve(__dirname, '../.auth/keycloak_user.json');
  const artemisAuthFilePath = path.resolve(__dirname, '../.auth/artemis_user.json');
  if (fs.existsSync(keycloakAuthFilePath)) {
    fs.unlinkSync(keycloakAuthFilePath);
  }
  if (fs.existsSync(artemisAuthFilePath)) {
    fs.unlinkSync(artemisAuthFilePath);
  }

  console.log('Global teardown completed.');
}

export default globalTeardown;