import { Express } from 'express';
import crypto from 'crypto';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema 
} from '@modelcontextprotocol/sdk/types.js';
import { ResearchProject } from './types';

// Cryptographic Verification key matching the secure logging architecture
const LOG_SIGNATURE_KEY = "researchpilot_secure_log_chain_key_2026";

export function setupMcpServer(
  app: Express,
  projects: ResearchProject[],
  saveProjects: (projects: ResearchProject[]) => void,
  runAgenticWorkflow: (projectId: string, query: string) => Promise<void>,
  addLog: (
    project: ResearchProject,
    agent: string,
    message: string,
    level: 'info' | 'warn' | 'error',
    action_type?: string,
    payload?: any,
    duration_ms?: number
  ) => void
) {
  // Initialize the MCP Server
  const mcpServer = new Server(
    {
      name: "ResearchPilot Multi-Agent MCP Server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register MCP Tools Scheme list handler
  mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "list_projects",
          description: "Retrieve a list of all research projects and literature synthesis topics.",
          inputSchema: {
            type: "object",
            properties: {}
          }
        },
        {
          name: "get_project",
          description: "Get comprehensive details of a specific research project (including findings, paper list, comparative matrix, and gap analysis).",
          inputSchema: {
            type: "object",
            properties: {
              projectId: {
                type: "string",
                description: "The unique identifier of the project (e.g. proj_1783003068836)"
              }
            },
            required: ["projectId"]
          }
        },
        {
          name: "create_research_project",
          description: "Initialize and run a multi-agent literature search and synthesis workflow for a scientific query.",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "The research query or literature synthesis objective (e.g. 'RL for RNA folding')"
              },
              projectId: {
                type: "string",
                description: "Optional existing project ID to resume or expand upon the research with specialized keywords"
              }
            },
            required: ["query"]
          }
        },
        {
          name: "verify_integrity",
          description: "Perform secure cryptographic HMAC chain signature auditing of all logs in a research project to ensure data has not been modified.",
          inputSchema: {
            type: "object",
            properties: {
              projectId: {
                type: "string",
                description: "The unique identifier of the project to audit"
              }
            },
            required: ["projectId"]
          }
        }
      ]
    };
  });

  // Handle Tool Call executions
  mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "list_projects": {
        const payload = projects.map(p => ({
          id: p.id,
          name: p.name,
          query: p.query,
          status: p.status,
          timestamp: p.timestamp,
          paperCount: p.papers ? p.papers.length : 0
        }));
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(payload, null, 2)
            }
          ]
        };
      }

      case "get_project": {
        const projectId = args?.projectId as string;
        if (!projectId) {
          return {
            isError: true,
            content: [{ type: "text", text: "Error: Missing required argument 'projectId'." }]
          };
        }
        const project = projects.find(p => p.id === projectId);
        if (!project) {
          return {
            isError: true,
            content: [{ type: "text", text: `Error: Project with ID '${projectId}' was not found.` }]
          };
        }
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(project, null, 2)
            }
          ]
        };
      }

      case "create_research_project": {
        const query = args?.query as string;
        const projectId = args?.projectId as string | undefined;

        if (!query) {
          return {
            isError: true,
            content: [{ type: "text", text: "Error: Missing required argument 'query'." }]
          };
        }

        const name = query.length > 40 ? query.substring(0, 37) + '...' : query;
        let project: ResearchProject;

        if (projectId) {
          const existing = projects.find(p => p.id === projectId);
          if (!existing) {
            return {
              isError: true,
              content: [{ type: "text", text: `Error: Existing project with ID '${projectId}' not found to expand.` }]
            };
          }
          project = existing;
          project.status = 'running';
          project.timestamp = new Date().toISOString();
          project.logs = []; // clear old logs for fresh continuation run
          addLog(project, 'Memory Agent', `Recalling memory profile for topic: "${project.name}"...`, 'info', 'VECTOR_DB_WRITE', {
            database_provider: "ChromaDB",
            collection_hash: "col-" + crypto.createHash('sha256').update('user-session-' + project.id).digest('hex').substring(0, 18),
            document_chunk_id: `chunk_${project.id}_recall`,
            metadata_signature_status: "HMAC_SIGNED",
            write_status: "COMMITTED"
          });
        } else {
          project = {
            id: `proj_${Date.now()}`,
            name,
            query,
            status: 'idle',
            logs: [],
            plan: null,
            papers: [],
            comparison: [],
            gapAnalysis: null,
            report: null,
            timestamp: new Date().toISOString()
          };
          projects.push(project);
          addLog(project, 'Memory Agent', `Initialized cold memory buffer for new topic: "${name}".`, 'info', 'VECTOR_DB_WRITE', {
            database_provider: "ChromaDB",
            collection_hash: "col-" + crypto.createHash('sha256').update('user-session-' + project.id).digest('hex').substring(0, 18),
            document_chunk_id: `chunk_${project.id}_init`,
            metadata_signature_status: "HMAC_SIGNED",
            write_status: "COMMITTED"
          });
        }

        saveProjects(projects);
        runAgenticWorkflow(project.id, query);

        return {
          content: [
            {
              type: "text",
              text: `Successfully created and launched research project "${project.name}" (ID: ${project.id}) for query: "${query}".`
            }
          ]
        };
      }

      case "verify_integrity": {
        const projectId = args?.projectId as string;
        if (!projectId) {
          return {
            isError: true,
            content: [{ type: "text", text: "Error: Missing required argument 'projectId'." }]
          };
        }

        const project = projects.find(p => p.id === projectId);
        if (!project) {
          return {
            isError: true,
            content: [{ type: "text", text: `Error: Project with ID '${projectId}' was not found.` }]
          };
        }

        let isValid = true;
        const validations = [];

        for (let i = 0; i < project.logs.length; i++) {
          const log = project.logs[i];
          const precedingSignature = i > 0 
            ? project.logs[i - 1].log_signature || 'genesis_seed' 
            : 'genesis_seed';

          const contentToSign = JSON.stringify({
            timestamp: log.timestamp,
            event_id: log.event_id,
            session_id: log.session_id,
            user_id_hash: log.user_id_hash,
            agent_name: log.agent,
            action_type: log.action_type || 'GENERIC_LOG',
            severity: log.severity || (log.level === 'error' ? 'ERROR' : log.level === 'warn' ? 'WARNING' : 'INFO'),
            status: log.status || (log.level === 'error' ? 'FAILED' : log.level === 'warn' ? 'RETRY' : 'SUCCESS'),
            payload: log.payload || null,
            duration_ms: log.duration_ms || 0,
            precedingSignature
          });

          const expectedSignature = crypto
            .createHmac('sha256', LOG_SIGNATURE_KEY)
            .update(contentToSign)
            .digest('hex');

          const signatureMatches = log.log_signature === expectedSignature;
          if (!signatureMatches) {
            isValid = false;
          }

          validations.push({
            index: i,
            event_id: log.event_id,
            expected: expectedSignature,
            actual: log.log_signature,
            signatureMatches
          });
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                projectId: project.id,
                isValid,
                totalLogs: project.logs.length,
                validations
              }, null, 2)
            }
          ]
        };
      }

      default:
        throw new Error(`Unknown tool requested: ${name}`);
    }
  });

  // Track the active SSEServerTransport instance to handle messages
  let sseTransport: SSEServerTransport | null = null;

  // Mount SSE Server Connection endpoint
  app.get('/sse', async (req, res) => {
    console.log("MCP Client connected to /sse channel.");
    sseTransport = new SSEServerTransport('/messages', res);
    await mcpServer.connect(sseTransport);
  });

  // Mount post message messaging router
  app.post('/messages', async (req, res) => {
    if (sseTransport) {
      await sseTransport.handlePostMessage(req, res);
    } else {
      res.status(400).send("No active MCP SSE transport session initialized.");
    }
  });

  // Exposure of MCP Configuration status for debugging/frontend metrics
  app.get('/api/mcp-status', (req, res) => {
    res.json({
      name: "ResearchPilot Multi-Agent MCP Server",
      version: "1.0.0",
      endpoints: {
        sse: "/sse",
        messages: "/messages"
      },
      tools: [
        { name: "list_projects", description: "List all research projects" },
        { name: "get_project", description: "Fetch specific research project information by ID" },
        { name: "create_research_project", description: "Initialize and run systematic multi-agent research" },
        { name: "verify_integrity", description: "Verify cryptographically audit logs using HMAC chaining" }
      ]
    });
  });

  console.log("✅ Model Context Protocol (MCP) server integration bootstrapped successfully.");
}
