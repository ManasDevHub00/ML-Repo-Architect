import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";
import path from "path";

// Create custom Filesystem MCP server
const server = new Server({
  name: "filesystem-mcp-server",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {}
  }
});

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "write_file",
        description: "Writes content to a file in the local project directory.",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "The name or path of the file to write (e.g. README.md)."
            },
            content: {
              type: "string",
              description: "The text content to write to the file."
            }
          },
          required: ["path", "content"]
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "write_file") {
    const { path: filePath, content } = request.params.arguments;
    try {
      // Resolve file path within the project workspace
      const resolvedPath = path.resolve(process.cwd(), filePath);
      
      // Security check: ensure path is inside the project workspace directory
      if (!resolvedPath.startsWith(process.cwd())) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: "Access denied. Cannot write files outside the workspace." })
            }
          ]
        };
      }
      
      // Write file contents to disk
      await fs.writeFile(resolvedPath, content, "utf-8");
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              filePath: resolvedPath,
              message: `Successfully wrote file to ${filePath}`
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: `Failed to write file: ${error.message}` })
          }
        ]
      };
    }
  }
  
  throw new Error(`Tool not found: ${request.params.name}`);
});

// Start Stdio connection
const transport = new StdioServerTransport();
await server.connect(transport);
