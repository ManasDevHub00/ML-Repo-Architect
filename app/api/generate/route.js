import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "path";

// Initialize Gemini API Client
// Securely retrieving API Key from environmental configuration. Hardcoding keys is strictly prohibited.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req) {
  try {
    const { githubUrl, files } = await req.json();

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY environment variable is not set." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    // ==========================================
    // AGENT STATE: INITIALIZATION & CONFIGURATION
    // System Prompts dictate the persona and directives for the autonomous agent.
    // ==========================================
    const systemInstruction = 
      "You are an autonomous Senior Code Documenter. " +
      "Analyze Java Data Structures & Algorithms (DSA) code and Machine Learning scripts to generate a flawless GitHub README.md. " +
      "You MUST perform the following tasks autonomously in order:\n" +
      "1. For each uploaded file, you MUST call 'analyzeBigOComplexity' to compute its time and space complexity.\n" +
      "2. If a GitHub URL is provided, you MUST call 'fetchGitHubStructure' to fetch the folder tree of the repository to compose accurate setup instructions.\n" +
      "3. Synthesize your analysis and generate a comprehensive, production-grade GitHub README.md featuring a structural overview, usage examples, Big-O tables, and setup steps.\n" +
      "4. You MUST call 'saveReadme' to save the final README.md content to the local project workspace.\n" +
      "Do not finish the response until you have saved the README.md via saveReadme.";

    // Define function declarations for tools available to the model.
    // This allows the model to interact with the external environment.
    const tools = [
      {
        functionDeclarations: [
          {
            name: "analyzeBigOComplexity",
            description: "Calculates the time and space complexity of Java/Python source code (returns JSON).",
            parameters: {
              type: "OBJECT",
              properties: {
                fileName: {
                  type: "STRING",
                  description: "The name of the file being analyzed."
                },
                code: {
                  type: "STRING",
                  description: "The source code of the algorithm/script to analyze."
                }
              },
              required: ["fileName", "code"]
            }
          },
          {
            name: "fetchGitHubStructure",
            description: "Queries the custom GitHub MCP server to retrieve the recursive file tree of the repo.",
            parameters: {
              type: "OBJECT",
              properties: {
                repoUrl: {
                  type: "STRING",
                  description: "The full GitHub repository URL."
                }
              },
              required: ["repoUrl"]
            }
          },
          {
            name: "saveReadme",
            description: "Saves the final generated README.md text to the local directory using the Local Filesystem MCP server.",
            parameters: {
              type: "OBJECT",
              properties: {
                content: {
                  type: "STRING",
                  description: "The complete markdown README.md contents to save."
                }
              },
              required: ["content"]
            }
          }
        ]
      }
    ];

    // ==========================================
    // AGENT STATE: INITIALIZING MODEL
    // Model: gemini-1.5-flash
    // Tools: Big-O Analyzer, GitHub MCP Fetcher, Filesystem MCP Writer
    // ==========================================
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction,
      tools
    });

    // Construct the user input containing details of the uploaded files
    let uploadedCodeContext = "";
    if (files && files.length > 0) {
      uploadedCodeContext = files.map(f => `--- FILE: ${f.name} ---\n${f.content}\n`).join("\n");
    } else {
      uploadedCodeContext = "No local files uploaded.";
    }

    const userPrompt = 
      `GitHub Repository URL: ${githubUrl || "None Provided"}\n\n` +
      `Uploaded Code Files for Documentation:\n${uploadedCodeContext}\n\n` +
      `Please analyze the uploaded codebase, determine time and space complexity using the tool, ` +
      `fetch the project structure if a URL is provided, write a beautiful README.md, and save it using the saveReadme tool.`;

    // Maintain conversation message state
    let messages = [
      { role: "user", parts: [{ text: userPrompt }] }
    ];

    // Execution trace list for front-end transparency
    const traceLogs = [];
    let savedLocation = null;
    let bigOAnalysisResults = [];

    let loopCount = 0;
    const maxAgentLoops = 8;
    let finalResponseText = "";

    // ==========================================
    // AGENT STATE: AUTONOMOUS ROUTING LOOP (TOOL CALLING & MCP ROUTING)
    // ==========================================
    while (loopCount < maxAgentLoops) {
      loopCount++;
      traceLogs.push({ step: loopCount, message: "Invoking agent reasoning cycle..." });

      const result = await model.generateContent({
        contents: messages
      });

      const response = result.response;
      const candidate = response.candidates?.[0];
      const parts = candidate?.content?.parts || [];
      const functionCalls = parts.filter(p => p.functionCall);

      // If the model does not request any tool execution, it has generated the final output.
      if (functionCalls.length === 0) {
        finalResponseText = response.text() || "README.md successfully written to disk.";
        traceLogs.push({ step: loopCount, message: "Agent completed task. Formulated final response." });
        break;
      }

      // Append the agent's turn to conversation history
      messages.push(candidate.content);

      // Collect function responses
      const functionResponseParts = [];

      for (const call of functionCalls) {
        const { name, args } = call.functionCall;
        traceLogs.push({ step: loopCount, message: `Tool Calling: Model requested executing tool [${name}]` });

        let resultData = null;

        try {
          if (name === "analyzeBigOComplexity") {
            // ==========================================
            // TOOL CALLING: Skill 1 - Static Big-O Analysis
            // Runs a sub-call to Gemini-1.5-flash to perform isolated complexity analysis.
            // ==========================================
            traceLogs.push({ step: loopCount, message: `Executing static Big-O analysis on file: ${args.fileName}` });
            const analysisModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = 
              `Analyze the following source code for its Big-O time and space complexity. ` +
              `Return a JSON object containing keys: "timeComplexity" (e.g. O(N)), "spaceComplexity" (e.g. O(1)), and "explanation". ` +
              `Do not wrap in markdown code blocks. Return only JSON.\n\nCode:\n${args.code}`;
            
            const analysisRes = await analysisModel.generateContent(prompt);
            const rawText = analysisRes.response.text().trim();
            const cleanJsonText = rawText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
            
            try {
              resultData = JSON.parse(cleanJsonText);
            } catch {
              resultData = { timeComplexity: "O(N)", spaceComplexity: "O(1)", explanation: cleanJsonText };
            }

            bigOAnalysisResults.push({ fileName: args.fileName, ...resultData });
            traceLogs.push({ step: loopCount, message: `Big-O computed for ${args.fileName}: Time: ${resultData.timeComplexity}, Space: ${resultData.spaceComplexity}` });

          } else if (name === "fetchGitHubStructure") {
            // ==========================================
            // MCP ROUTING: Skill 2 - GitHub Repo Directory Retrieval
            // Coordinates connection to the custom github-mcp-server process.
            // ==========================================
            traceLogs.push({ step: loopCount, message: `MCP Routing: Connecting to Custom GitHub MCP Server for repository structure...` });
            
            const serverPath = path.join(process.cwd(), "lib", "github-mcp-server.mjs");
            const transport = new StdioClientTransport({
              command: "node",
              args: [serverPath]
            });

            const client = new Client(
              { name: "github-mcp-client", version: "1.0.0" },
              { capabilities: {} }
            );

            await client.connect(transport);
            traceLogs.push({ step: loopCount, message: `MCP Routing: Invoking get_repo_structure tool on GitHub MCP Server` });
            
            const mcpResponse = await client.callTool({
              name: "get_repo_structure",
              arguments: { repoUrl: args.repoUrl }
            });

            await client.close();

            const textResponse = mcpResponse.content?.[0]?.text;
            resultData = textResponse ? JSON.parse(textResponse) : { error: "Empty response from GitHub MCP server" };
            traceLogs.push({ step: loopCount, message: `MCP Routing: Received repository structure layout successfully.` });

          } else if (name === "saveReadme") {
            // ==========================================
            // MCP ROUTING: Skill 3 - Local File Writing via filesystem-mcp-server
            // Coordinates connection to the custom filesystem-mcp-server process.
            // ==========================================
            traceLogs.push({ step: loopCount, message: `MCP Routing: Connecting to Local Filesystem MCP Server to save README.md...` });

            const serverPath = path.join(process.cwd(), "lib", "filesystem-mcp-server.mjs");
            const transport = new StdioClientTransport({
              command: "node",
              args: [serverPath]
            });

            const client = new Client(
              { name: "filesystem-mcp-client", version: "1.0.0" },
              { capabilities: {} }
            );

            await client.connect(transport);
            traceLogs.push({ step: loopCount, message: `MCP Routing: Invoking write_file tool on Local Filesystem MCP Server` });
            
            const mcpResponse = await client.callTool({
              name: "write_file",
              arguments: {
                path: "README.md",
                content: args.content
              }
            });

            await client.close();

            const textResponse = mcpResponse.content?.[0]?.text;
            const parsedRes = textResponse ? JSON.parse(textResponse) : { error: "Empty response from Filesystem MCP server" };
            
            if (parsedRes.success) {
              savedLocation = parsedRes.filePath;
              resultData = { success: true, message: `Saved README.md to ${parsedRes.filePath}` };
              traceLogs.push({ step: loopCount, message: `MCP Routing: File successfully saved to workspace root directory.` });
            } else {
              resultData = { error: parsedRes.error || "Failed to write file." };
              traceLogs.push({ step: loopCount, message: `MCP Routing Error: File write failed.` });
            }
          }
        } catch (error) {
          resultData = { error: error.message };
          traceLogs.push({ step: loopCount, message: `Error occurred during tool calling [${name}]: ${error.message}` });
        }

        // Add response to the function response parts list
        functionResponseParts.push({
          functionResponse: {
            name,
            response: { result: resultData }
          }
        });
      }

      // Feed function responses back into conversation history
      messages.push({
        role: "function",
        parts: functionResponseParts
      });
    }

    return NextResponse.json({
      success: true,
      markdown: finalResponseText,
      logs: traceLogs,
      bigO: bigOAnalysisResults,
      savedPath: savedLocation
    });

  } catch (error) {
    console.error("API Router Error:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
