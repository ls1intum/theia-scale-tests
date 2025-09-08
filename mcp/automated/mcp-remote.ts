import { Anthropic } from "@anthropic-ai/sdk";
import {
  MessageParam,
  Tool,
} from "@anthropic-ai/sdk/resources/messages/messages.mjs";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { ensureLogin } from "../mcp-setup";

dotenv.config({ path: path.resolve(__dirname, "mcp.env") });

const storageStatePath = path.resolve(".auth/mcp_auth.json");
const prompt = fs.readFileSync(
  path.resolve("mcp/virtualstudent.prompt"),
  "utf8",
);

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not set");

class MCPClient {
  private mcp: Client;
  private anthropic: Anthropic;
  private transport: StdioClientTransport | null = null;
  private tools: Tool[] = [];

  constructor() {
    this.anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
    this.mcp = new Client({ name: "playwright-theia-mcp", version: "1.0.0" });
  }

  async connectToServer() {
    this.transport = new StdioClientTransport({
      command: "npx",
      args: [
        "@playwright/mcp@latest",
        `--storage-state=${storageStatePath}`,
        "--isolated",
      ],
    });

    this.mcp.connect(this.transport);

    const toolsResult = await this.mcp.listTools();
    this.tools = toolsResult.tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      input_schema: tool.inputSchema,
    }));

    console.log(
      "Connected to MCP server with tools:",
      this.tools.map((t) => t.name),
    );
  }

  async processPrompt(prompt: string) {
    const messages: MessageParam[] = [{ role: "user", content: prompt }];
    const finalText: string[] = [];

    // initial LLM call
    let response = await this.anthropic.messages.create({
      model: "claude-opus-4-0",
      max_tokens: 1000,
      messages,
      tools: this.tools,
    });

    let step = 1;

    while (response.content.some((c) => c.type === "tool_use")) {
      // Show LLM thought process
      response.content.forEach((c) => {
        if (c.type === "text") {
          console.log(`Step ${step} - LLM thinks: ${c.text}`);
        } else if (c.type === "tool_use") {
          console.log(
            `Step ${step} - LLM wants to use tool "${c.name}" with args:`,
            c.input,
          );
        }
      });

      // Find the tool call
      const toolContent = response.content.find((c) => c.type === "tool_use");
      if (!toolContent) break;

      const toolName = toolContent.name;
      const toolArgs = toolContent.input as Record<string, unknown> | undefined;

      // Execute the tool
      const toolResult = await this.mcp.callTool({
        name: toolName,
        arguments: toolArgs,
      });
      console.log(`Step ${step} - Tool "${toolName}" executed.`);

      // Add tool result to conversation
      messages.push({ role: "user", content: toolResult.content as string });
      finalText.push(`[Step ${step}] ${toolResult.content as string}`);

      // Get next LLM response
      response = await this.anthropic.messages.create({
        model: "claude-opus-4-0",
        max_tokens: 1000,
        messages,
        tools: this.tools,
      });

      step++;
    }

    this.processPrompt("Continue with the task.");
  }

  async cleanup() {
    await this.mcp.close();
  }
}

(async () => {
  const client = new MCPClient();
  try {
    await ensureLogin();
    await client.connectToServer();
    await client.processPrompt(prompt);
    console.log("=== LLM Finished ===\n");
  } finally {
    await client.cleanup();
    process.exit(0);
  }
})();
