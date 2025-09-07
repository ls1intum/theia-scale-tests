# MCP Playwright Config

## Setup

You need to have the MCP Playwright module installed, as well as npx with tsx to run the Authentication
```bash
npm install
```

## Run Test

#### Using local IDE (VSCode, Cursor, ...)
1. Add Playwright MCP Server manually using a **mcp.json** file in your IDE Config (Examples for VSCode and Cursor are already in this repo)
    ```json
    {
        "mcpServers": {
        "theia-playwright": {
            "url": "http://localhost:8931/mcp"
        }
        }
    }
    ```
2. Run either the Shell Script or these commands after each other (from the project root)
    ```bash
    npx tsx mcp/mcp-setup &&
    npx @playwright/mcp@latest --config=mcp/local/config.json --storage-state .auth/mcp_auth.json
    ```
    The first command logs into keycloak and saves the storageState, the second one starts the Playwright MCP Server with the state on the port given in the config

3. Start using the MCP with the Agent Mode, the LLM should have access to the given features and can simulate a reasonable virtual student. A example prompt is given in **virtualstudent.prompt**

#### Automated / Custom LLM

To run a test more automated and/or within a CI/CD environment, use a custom LLM that connects to the MCP Server programatically. 
1. Add LLM API key in **/mcp/automated/mcp.env**
2. Use Anthropic or setup LLM instance
3. Run test using
    ```bash
    npx tsx mcp/automated/mcp-remote.ts
    ```