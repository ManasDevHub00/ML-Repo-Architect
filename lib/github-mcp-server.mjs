import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

// Create custom GitHub MCP server
const server = new Server({
  name: "github-mcp-server",
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
        name: "get_repo_structure",
        description: "Fetches the folder directory structure (file tree) of a public GitHub repository.",
        inputSchema: {
          type: "object",
          properties: {
            repoUrl: {
              type: "string",
              description: "The full GitHub repository URL (e.g. https://github.com/octocat/Spoon-Knife)"
            }
          },
          required: ["repoUrl"]
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_repo_structure") {
    const { repoUrl } = request.params.arguments;
    try {
      // Parse GitHub URL
      const match = repoUrl.match(/github\.com[\/:]([^\/]+)\/([^\/\.#\?]+)/);
      if (!match) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: "Invalid GitHub URL format. Use https://github.com/owner/repo" })
            }
          ]
        };
      }
      
      const owner = match[1];
      const repo = match[2];
      
      // Fetch repo details to determine the default branch
      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: { "User-Agent": "ML-Repo-Architect-Agent" }
      });
      
      if (!repoRes.ok) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: `Error fetching repository: ${repoRes.status} ${repoRes.statusText}` })
            }
          ]
        };
      }
      
      const repoData = await repoRes.json();
      const defaultBranch = repoData.default_branch || "main";
      
      // Fetch recursive file tree
      const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`, {
        headers: { "User-Agent": "ML-Repo-Architect-Agent" }
      });
      
      if (!treeRes.ok) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: `Error fetching file tree: ${treeRes.status} ${treeRes.statusText}` })
            }
          ]
        };
      }
      
      const treeData = await treeRes.json();
      const files = (treeData.tree || [])
        .filter(item => item.type === "blob")
        .map(item => item.path);
        
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              owner,
              repo,
              defaultBranch,
              fileTree: files.slice(0, 150) // limit to top 150 files to stay under token limits
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: `Connection failed: ${error.message}` })
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
