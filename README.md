# ResearchPilot ✈️

> **An Agentic AI Research Companion for Literature Discovery, Analysis, and Knowledge Synthesis.**

ResearchPilot is an autonomous multi-agent portfolio application built with TypeScript, Node.js (Express), and React (Vite). It uses **Gemini 2.5 Flash** via the `@google/genai` SDK to simulate a robust multi-agent systematic review loop that plans tasks, crawls literature metadata from public APIs, parses documents virtually, cross-examines methodologies, scans research gaps, meta-reflects on depth, and produces complete publishable APA reports.

---

## 🗺️ System Architecture

Rather than treating the LLM as a static Q&A chatbot, ResearchPilot implements a state-machine multi-agent framework where each agent has single-responsibility isolation:

```
                      [ User Research Query ]
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │     Planner Agent     │ <─── Recalls memory context (Memory Agent)
                     └───────────────────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │     Search Agent      │ <─── Crawls arXiv & Semantic Scholar APIs
                     └───────────────────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │     Reading Agent     │ <─── Performs deep extraction on abstract metadata
                     └───────────────────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │   Comparison Agent    │ <─── Compiles multi-column comparison table
                     └───────────────────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │  Research Gap Agent   │ <─── Scans open frontiers and methodological draw-backs
                     └───────────────────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │   Reflection Agent    │
                     └───────────────────────┘
                                 │
             ┌───────────────────┴───────────────────┐
             ▼ (Confidence Low)                      ▼ (Confidence Sufficient)
┌─────────────────────────┐             ┌────────────────────────────────┐
│    Expand Literature    │             │     Report Generator Agent     │
│   (Search & Re-run)     │             └────────────────────────────────┘
└────────────┬────────────┘                              │
             │                                           ▼
             └─────────────────────────────────> [ Final Report Synthesis ]
                                                         │
                                                         ▼
                                                [ Memory Buffer Commit ]
```

### Agent Roles & Responsibilities

1. **Planner Agent**: Analyzes the research objective and breaks it into 6 chronological execution objectives, customizing tasks for subsequent agents.
2. **Search Agent**: Connects directly to **arXiv** and **Semantic Scholar** APIs to discover publications, ranks relevance, and deduplicates records.
3. **Reading Agent**: Extracts core architectural parameters from metadata (Problem statement, methodology, target models, benchmarks, and key results) and rates reading difficulty.
4. **Comparison Agent**: Formulates a structured comparison matrix comparing strengths, weaknesses, and novel scientific contributions side-by-side.
5. **Research Gap Agent**: Cross-scans parsed texts to identify unaddressed scientific problems, common limitations, conflicting results, and potential future directions.
6. **Reflection Agent**: Evaluates coverage and assigns a quality confidence score (0-100%). If coverage is insufficient, triggers an automated secondary literature discovery iteration.
7. **Report Generator Agent**: Compiles findings into a complete, portfolio-quality, publishable academic report.
8. **Memory Agent**: Persists project states, logs, and generated assets in a lightweight database container so researchers can resume or review previous projects.

---

## 🔌 Model Context Protocol (MCP) Server

ResearchPilot features a built-in, fully-compliant **Model Context Protocol (MCP)** server. This allows external LLMs and clients (such as Claude Desktop or custom MCP clients) to seamlessly connect to your ResearchPilot instance and interact with the multi-agent research agent ecosystem.

### 🌐 Connection Endpoints
- **Server-Sent Events (SSE) Target (GET)**: `http://localhost:3000/sse`
- **Client Messaging Route (POST)**: `http://localhost:3000/messages`
- **Metadata Status API (GET)**: `/api/mcp-status`

### 🛠️ Registered MCP Tools

The built-in MCP server exposes standard schema tools, bridging external LLM clients with the systematic multi-agent research loop:

1. **`list_projects`**
   - **Description**: Retrieve a list of all research projects and literature synthesis topics.
   - **Payload**: Returns project names, queries, status, timestamps, and paper counts.

2. **`get_project`**
   - **Description**: Fetch comprehensive details of a specific research project (including papers, comparison matrix, gap analysis, and final report).
   - **Arguments**: `projectId` (string)

3. **`create_research_project`**
   - **Description**: Initialize and launch a systematic multi-agent literature search and synthesis workflow for a scientific query.
   - **Arguments**: `query` (string), `projectId` (optional, to expand/continue existing projects)

4. **`verify_integrity`**
   - **Description**: Performs a cryptographically secure audit of the project logs.
   - **Mechanism**: Re-computes the HMAC-SHA256 signature chain matching the secure logging ledger to verify that research records and agent logs have not been modified or tampered with.

---

## ⚡ Key Features

- **MCP Console Modal & Live Status**: Dedicated user interface to monitor registered schema tools, protocol version, and live Server-Sent Events (SSE) endpoints.
- **Dynamic Interactive Node Graph**: Visualizes live multi-agent execution states in real-time, moving glow vectors across active nodes using smooth spring layouts.
- **Agent Thought Monitor Logs**: Displays real-time, color-coded, cascading console streams from backend agents during literature crawl operations.
- **Interactive Chronological Timeline**: Graphs the historic progression of discoveries with paper summaries and citation indices.
- **Concept Vector Graph**: Renders an interactive SVG-based concept citation network. Click nodes to explore their deep scientific parameters.
- **Bento Gaps Board**: Grid displaying computational open problems, methodological draws, and conflicting results.
- **Domain Technical Glossary**: Auto-compiles key technical terminology with descriptions.
- **APA Bibliography & References**: Generates formatted citations ready for academic papers.
- **Markdown & Print Export**: Download findings instantly or save as PDF via styled browser print panels.

---

## 🛠️ Technology Stack

- **Backend Framework**: Node.js, Express (ES Modules)
- **AI Integration**: `@google/genai` (SDK utilizing the recommended `gemini-3.5-flash` model)
- **Frontend Framework**: React 19 (TypeScript), Vite 6
- **Styling**: Tailwind CSS v4, Lucide Icons
- **Animations**: `motion/react` (Framer Motion v12)
- **APIs Integrated**: arXiv (ATOM XML query), Semantic Scholar (JSON Graph query)

---

## 🚀 Setup & Execution

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone or extract the project directory.
2. Install base dependencies:
   ```bash
   npm install
   ```

3. Set up your Gemini API key in the `.env` file at the root:
   ```env
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
   ```

### Execution

Start the full-stack development workspace on port 3000:
```bash
npm run dev
```

The server will boot the Express routing layers and dynamically compile/serve Vite frontend assets. Open [http://localhost:3000](http://localhost:3000) to access ResearchPilot.

To compile a production build of both the React frontend and server:
```bash
npm run build
npm start
```

---

## 🌌 Future Horizons

- **Real-time PDF Vector Retrieval (RAG)**: Connect vector embeddings for direct, full-length PDF parsing and chunked vector lookup.
- **Zotero / Mendeley Direct Sync**: Integrate user library accounts to pull literature directly from active reference managers.
- **Collaborative Research Rooms**: Support multiple users co-researching, appending notes, and co-writing summaries in real-time.
