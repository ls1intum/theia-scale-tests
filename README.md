# Theia Scale Tests

This repository provides E2E integration tests for the [Theia Cloud IDE](https://theia-cloud.io) regarding scalability.

## Information

- Tests are written using [Playwright](https://playwright.dev)
- Scaled tests run via the Playwright [Artillery](https://artillery.io) Framework (Potentially)

## For Development

- Single User Playwright Tests are run using a Test Account for Keycloak, to change the Test User, change the environment variables in GitHub Secrets \
-> Settings -> Secrets and variables -> Actions -> Secrets -> Repository Secrets \
or [here](https://github.com/ls1intum/theia-scale-tests/settings/secrets/actions)
- To run the tests on the deployed Theia instance, run:

  ```bash
  npx playwright test --project=deployed
  ```
  
- To run tests locally using a Theia Instance on localhost, change the environment variable to the corresponding port and run the tests using:

  ```bash
  npx playwright test --project=local
  ```

- To run every test, simply run:

  ```bash
  npx playwright test
  ```

- Test files that allow local testing (testing without Landing Page and Keycloak) have the following file ending:

  ```none
  *.ide.spec.ts
  ```

- Set the corresponding URLs in the `global.config.ts` file
