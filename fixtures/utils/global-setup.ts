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

  const isLocal = config.projects.some(project => project.name === 'local');
  
  if (isLocal) {
    const testDataDir = path.join(process.cwd(), 'test-data/functional');
    if (!fs.existsSync(testDataDir)) {
      fs.mkdirSync(testDataDir, { recursive: true });
    }
    fs.writeFileSync(path.join(testDataDir, 'ide-url-c.txt'), process.env.LOCAL_URL_C || '');
    fs.writeFileSync(path.join(testDataDir, 'ide-url-java.txt'), process.env.LOCAL_URL_JAVA || '');
    fs.writeFileSync(path.join(testDataDir, 'ide-url-python.txt'), process.env.LOCAL_URL_PYTHON || '');
    fs.writeFileSync(path.join(testDataDir, 'ide-url-ocaml.txt'), process.env.LOCAL_URL_OCAML || '');
    fs.writeFileSync(path.join(testDataDir, 'ide-url-rust.txt'), process.env.LOCAL_URL_RUST || '');
    fs.writeFileSync(path.join(testDataDir, 'ide-url-javascript.txt'), process.env.LOCAL_URL_JS || '');

  } else {
    if (!process.env.LANDINGPAGE_URL) {
      throw new Error('LANDINGPAGE_URL environment variable is not set, please set the base URL for the Theiea instance to be tested against');
    }
    if (!process.env.ARTEMIS_URL) {
      throw new Error('ARTEMIS_URL environment variable is not set, please set the URL for the instance to be tested against');
    }
    if (!process.env.ARTEMIS_USER || !process.env.ARTEMIS_PWD) {
      throw new Error('ARTEMIS_USER or ARTEMIS_PWD environment variable is not set, please set the privileged Artemis User');
    }
  }

  const isScale = config.projects.some(project => project.name === 'scale');

  if (isScale) {
    if (!process.env.NUM_INSTANCES) {
      throw new Error('NUM_INSTANCES environment variable is not set');
    }
    const testDataDir = path.join(process.cwd(), 'test-data/scale');
    if (!fs.existsSync(testDataDir)) {
      fs.mkdirSync(testDataDir, { recursive: true });
    }
  }

  console.log('Global setup completed.');
}

export default globalSetup; 