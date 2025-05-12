# Theia Scale Tests

This repository provides E2E integration tests for the [Theia Cloud IDE](https://theia-cloud.io) regarding scalability.
## Information:
Tests are written using [Playwright](https://playwright.dev)
Scaled tests run via the Playwright [Artillery](https://artillery.io) Framework (Potentially)
## For Development:
- Single User Playwright Tests are run using a Test Account for Keycloak, to change the Test User, change the environment variables in GitHub Secrets \
-> Settings -> Secrets and variables -> Actions -> Secrets -> Repository Secrets \
or [here](https://github.com/ls1intum/theia-scale-tests/settings/secrets/actions)
