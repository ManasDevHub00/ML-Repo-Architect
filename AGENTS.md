 # 🤖 Agent Architecture

This document outlines the core AI agent logic powering **ML-Repo-Architect**.

## Core Agent: The Repo Documenter
* **Role:** Autonomous technical documentation generator.
* **Capabilities:** * Ingests local repository structures and file trees.
  * Reads and comprehends source code logic across multiple languages (Next.js, Python, etc.).
  * Synthesizes complex technical information into structured, readable Markdown format.

## Tools & Integrations (Model Context Protocol)
To function safely, the agent relies on custom Model Context Protocol (MCP) servers to interact with the local environment:

1. **`filesystem-mcp-server`**: Grants the agent secure, read-only access to the local directory. This is how the AI reads files like `fibonacci.py` without breaking the system.
2. **`github-mcp-server`**: Connects the agent to version control to understand the broader project context.

## Workflow
1. User requests documentation via the Next.js frontend.
2. The `/api/generate` route triggers the agent.
3. The agent uses MCP tools to scan the codebase.
4. The agent streams the compiled Markdown back to the user interface.
