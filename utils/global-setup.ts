import { chromium } from '@playwright/test';
import { LandingPage } from '../pages/landing/LandingPage';
import fs from 'fs';
import path from 'path';

/**
 * Global setup for Playwright tests.
 * Checks for env variables and sets the IDE URL incase of local tests.
 */
async function globalSetup(config: { projects: { name: string }[] }) {
  console.log('Running global setup...');

  if (!process.env.KEYCLOAK_USER || !process.env.KEYCLOAK_PWD) {
    throw new Error('USERNAME, or PASSWORD environment variable is not set');
  }
  // Check if we're running local or deployed tests
  const isLocal = config.projects.some(project => project.name === 'local');
  
  if (isLocal) {
    const testDataDir = path.join(process.cwd(), 'test-data');
    if (!fs.existsSync(testDataDir)) {
      fs.mkdirSync(testDataDir, { recursive: true });
    }
    fs.writeFileSync(path.join(testDataDir, 'ide-url.txt'), process.env.LOCAL_URL || '');
  }

  console.log('Global setup completed.');
}

export default globalSetup; 