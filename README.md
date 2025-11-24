# Theia Scale Tests

[![Playwright Tests](https://github.com/ls1intum/theia-scale-tests/actions/workflows/functional-tests.yml/badge.svg)](https://github.com/ls1intum/theia-scale-tests/actions/workflows/functional-tests.yml)
[![Playwright Tests](https://github.com/ls1intum/theia-scale-tests/actions/workflows/scalable-tests.yml/badge.svg)](https://github.com/ls1intum/theia-scale-tests/actions/workflows/scalable-tests.yml)
[![Playwright Tests](https://github.com/ls1intum/theia-scale-tests/actions/workflows/artillery-tests.yml/badge.svg)](https://github.com/ls1intum/theia-scale-tests/actions/workflows/artemis-integration-tests.yml)
[![Playwright Tests](https://github.com/ls1intum/theia-scale-tests/actions/workflows/artemis-integration-tests.yml/badge.svg)](https://github.com/ls1intum/theia-scale-tests/actions/workflows/artemis-integration-tests.yml)

---

This repository provides E2E integration tests for the [Theia Cloud IDE](https://theia-cloud.io). It uses Playwright to simulate real world usage of Online IDE's in large classroom settings.

## Information

- Tests are written using [Playwright](https://playwright.dev)
- Scaled tests run via the Playwright [Artillery](https://artillery.io) Framework or natively only using Playwright

## Setup

- Setup Envionment Variables
  - Duplicate `playwright.env.template` and rename it to `playwright.env` (make sure this file is gitignored!)
  - Fill in the given variables as described in the file, notice:
    - Keycloak User and Password needs to have access to Theia (does not need to be the same Artemis User as of now)
    - Landing Page URL is the URL of the Theia Deployment to test against (this does not affect the Artemis Integration test, as the target deployment is set by Artemis)
    - The Artemis User needs to have enough priviliges to create a course and exercise on the given test server

- Get the latest Theia IDE image from [here](https://ghcr.io/eclipse-theia/theia-ide/theia-ide:latest) and run it. Put the corresponding URL into the env file

- Install dependencies and playwright browser
  ```bash
  npm install
  ```
  ```bash
  npx playwright install
  ```

## Run Tests

- To run the functional tests on the deployed Theia instance, run:
  ```bash
  npx playwright test --project=functional
  ```
- To run tests locally using a Theia Instance on localhost, change the environment variable to the corresponding port and run the tests using:

  ```bash
  npx playwright test --project=local
  ```

- To run the load tests, run:

  > **_NOTE:_**
  As load tests use a single account, pay attention that the session per user limit is min the amount of instances you want!


  ```bash
  npx playwright test --project=scale
  ```

  Set the amount of instances in the ENV file or pass it like this (ex. 100 instances):

  ```bash
  NUM_INSTANCE=100 npx playwright test --project=scale
  ```

  To run the tests using the Artillery.io framework, run:

  ```bash
  npx artillery run tests/ide/scalable/artillery/Artillery.ts
  ```

- To run the MCP tests, follow the README in the [**MCP**](mcp/README.md) folder

| Project Identifier | Description                                                                                                       | Status                                                                                                                                                                                                                        |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| local              | Runs all **functional** tests on a local instance, provided by the URL in the env file.                           |                                                                                                                                                                                                                               |
| functional         | Runs all **functional** tests on the deployed instance, provided by the URL in the env file.                      | [![Playwright Tests](https://github.com/ls1intum/theia-scale-tests/actions/workflows/functional-tests.yml/badge.svg)](https://github.com/ls1intum/theia-scale-tests/actions/workflows/functional-tests.yml)                   |
| scale              | Runs all **scalability** tests on the deployed instance, provided by the URL in the env file.                     | [![Playwright Tests](https://github.com/ls1intum/theia-scale-tests/actions/workflows/scalable-tests.yml/badge.svg)](https://github.com/ls1intum/theia-scale-tests/actions/workflows/scalable-tests.yml)                       |
| artillery          | Runs the **scalability** test on the deployed instance, using the [Artillery.io](https://artillery.io) framework. | [![Playwright Tests](https://github.com/ls1intum/theia-scale-tests/actions/workflows/artillery-tests.yml/badge.svg)](https://github.com/ls1intum/theia-scale-tests/actions/workflows/artemis-integration-tests.yml)           |
| artemis            | Runs the **integration** test with Artemis, either local or deployed depending on the URLs set in the env file.   | [![Playwright Tests](https://github.com/ls1intum/theia-scale-tests/actions/workflows/artemis-integration-tests.yml/badge.svg)](https://github.com/ls1intum/theia-scale-tests/actions/workflows/artemis-integration-tests.yml) |
| \*-setup           | These are setup projects and not meant to be run on its own. Dependencies are already set.                        |

## Development

- Single User Playwright Tests are run using a Test Account for Keycloak, to change the Test User, change the environment variables in GitHub Secrets \
  -> Settings -> Secrets and variables -> Actions -> Secrets -> Repository Secrets

- All functional tests (that can also be run on a local instance) have the following file format:
  ```none
  *.functional.spec.ts
  ```
- All scalable tests (that can only be run on a scalable supported instance) have the following file format:
  ```none
  *.scale.spec.ts
  ```
- Tests require to have a specific setup files run before them. These are normally already run by requirements of the **playwright.config.ts**
- The tests safe the URL for each instance in a text file under **/test-data** for debugging and to access them in the tests
- Tests are intended to run on the production environment (https://theia.artemis.cit.tum.de)
  - As tests include testing of all available programming languages: local images for each language can be found here: https://github.com/orgs/ls1intum/packages?repo_name=artemis-theia-blueprints

## Info

This repository contains code from:

- Eclipse Theia: https://github.com/eclipse-theia/theia/tree/master/examples/playwright
- Artemis: https://github.com/ls1intum/Artemis/tree/develop/src/test/playwright
- MCP: https://github.com/modelcontextprotocol/quickstart-resources/tree/main/mcp-client-typescript
