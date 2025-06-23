# Theia Scale Tests

[![Playwright Tests](https://github.com/ls1intum/theia-scale-tests/actions/workflows/playwright.yml/badge.svg)](https://github.com/ls1intum/theia-scale-tests/actions/workflows/playwright.yml)

---

This repository provides E2E integration tests for the [Theia Cloud IDE](https://theia-cloud.io). It uses Playwright to simulate real world usage of Online IDE's in large classroom settings.


## Information

- Tests are written using [Playwright](https://playwright.dev)
- Scaled tests (potentially) run via the Playwright [Artillery](https://artillery.io) Framework

## Setup

- Get the latest Theia IDE image from [here](ghcr.io/eclipse-theia/theia-ide/theia-ide:latest) and run it. Put the corresponding URL into the env file

- Install dependencies and playwright
  ```bash
  npm install
  ```
  ```bash
  npx playwright install
  ```
- To run the tests on the deployed Theia instance, run:
  ```bash
  npx playwright test --project=deployed
  ```
  
- To run tests locally using a Theia Instance on localhost, change the environment variable to the corresponding port and run the tests using:
  ```bash
  npx playwright test --project=local
  ```

- To run every test (requires local Theia instance), simply run:
  ```bash
  npx playwright test
  ```



## Development

  - Single User Playwright Tests are run using a Test Account for Keycloak, to change the Test User, change the environment variables in GitHub Secrets \
-> Settings -> Secrets and variables -> Actions -> Secrets -> Repository Secrets \

  - Test files that allow local testing (testing without Landing Page and Keycloak) have the following file ending:
    ```none
    *.ide.spec.ts
    ```
  - Tests are intended to run on the production environment (https://theia.artemis.cit.tum.de)
    - As tests include testing of all available programming languages: local images for each language can be found here: https://github.com/orgs/ls1intum/packages?tab=packages&q=theia
