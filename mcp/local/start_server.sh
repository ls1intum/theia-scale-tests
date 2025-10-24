#! /bin/bash

npx tsx mcp/mcp-setup &&
npx @playwright/mcp@latest --config=mcp/local/config.json --storage-state .auth/mcp_auth.json
