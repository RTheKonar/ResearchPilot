# ResearchPilot ✈️

> **An Agentic AI Research Companion for Literature Discovery, Analysis, and Knowledge Synthesis.**

ResearchPilot is an autonomous multi-agent portfolio application built with TypeScript, Node.js (Express), and React (Vite). It uses **Gemini 3.5 Flash** via the `@google/genai` SDK to simulate a robust multi-agent systematic review loop that plans tasks, crawls literature metadata, parses documents virtually, cross-examines methodologies, scans research gaps, meta-reflects on depth, and generates publication-style literature review reports formatted with APA references.

---

## 🗺️ System Architecture

Rather than treating the LLM as a static Q&A chatbot, ResearchPilot implements a state-machine multi-agent framework where each agent has single-responsibility isolation. The orchestration layer, powered by **LangGraph**, controls planning, sequencing, decision gates, and meta-reflection, while all external interactions (data fetching, document processing, database actions) are cleanly decoupled into **Model Context Protocol (MCP)** server tools.

### 🔄 Multi-Agent Orchestration Flow (LangGraph)

```
                      [ User Research Query ]
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │     Planner Agent     │
                     └───────────────────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │     Search Agent      │ ──┐
                     └───────────────────────┘   │
                                 │               │
                                 ▼               │
                     ┌───────────────────────┐   │  (Decoupled Tool Calls via
                     │     Reading Agent     │   │   Model Context Protocol)
                     └───────────────────────┘   │
                                 │               │
                                 ▼               │
                     ┌───────────────────────┐   │
                     │   Comparison Agent    │ <─┘
                     └───────────────────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │  Research Gap Agent   │
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

### 🔌 Tool Decoupling Layer (Model Context Protocol)

To ensure strict separation of concerns, the reasoning agents do not access external APIs or storage directly. Instead, they interact with the environment via specialized MCP servers:

```
                           LangGraph Orchestration
                                      │
     ┌────────────────────────────────┼────────────────────────────────┐
     ▼                                ▼                                ▼
┌─────────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐
│  Academic Search MCP   │      │  Document Intell. MCP   │      │   Research Memory MCP   │
│  - arXiv API Discovery  │      │  - PDF Extraction       │      │  - Semantic Retrieval   │
│  - Semantic Scholar API │      │  - Document Chunking    │      │  - Embeddings & DB      │
│  - Metadata Deduplication│     │  - Section Clean-up     │      │  - Project History      │
└─────────────────────────┘      └─────────────────────────┘      └─────────────────────────┘
```

### Agent Roles & Responsibilities

1. **Planner Agent**: Analyzes the research objective and breaks it into 6 chronological execution objectives, customizing tasks for subsequent agents.
2. **Search Agent**: Connects to the **Academic Search MCP** to discover relevant publications on arXiv and Semantic Scholar, rank relevancies, and deduplicate records.
3. **Reading Agent**: Invokes the **Document Intelligence MCP** to extract structured information from abstracts and available metadata, generating standardized representations of research objectives, methodologies, datasets, evaluation metrics, and reported results.
4. **Comparison Agent**: Analyzes parsed literature side-by-side to formulate a structured comparison matrix comparing strengths, weaknesses, and novel contributions.
5. **Research Gap Agent**: Cross-scans parsed texts to identify unaddressed scientific problems, common limitations, conflicting results, and potential future directions.
6. **Reflection Agent**: Evaluates paper density and depth of coverage against query parameters. It computes a structured quality confidence score (0-100%) by measuring:
   * **Scope Alignment (40%)**: The semantic overlap between the parsed papers' topics and the primary search objective.
   * **Methodological Completeness (30%)**: The presence of explicit methodology, datasets, and evaluation metrics in the paper metadata.
   * **Dataset Volume (30%)**: The quantity of unique, high-citation papers retrieved.
   If this confidence score falls below a set threshold, it triggers an automated recursive secondary literature search to discover higher-quality papers.
7. **Report Generator Agent**: Compiles final synthesis findings to generate publication-style literature review reports formatted with APA references.
8. **Memory Agent**: Interfaces with the **Research Memory MCP** to store completed research sessions, intermediate agent outputs, execution logs, and generated reports to support project continuity.

---

## 💡 Why Model Context Protocol?

ResearchPilot adopts the Model Context Protocol (MCP) to decouple AI reasoning from external tool execution. Rather than allowing the language model to invoke internal application logic directly, all tool interactions are exposed through a standardized protocol. This separation offers several advantages:

* **Modularity** – New tools can be added without modifying the reasoning agents.
* **Extensibility** – Additional academic databases or document processors can be integrated as independent MCP services.
* **Interoperability** – Compatible external LLM clients can interact with ResearchPilot through a common interface.
* **Security** – Only explicitly registered tools are accessible, reducing the attack surface available to the agent.

---

## 🛡️ Security

ResearchPilot follows the principles of secure agent design. Implemented safeguards include:

* **Prompt Injection Detection**: Automatically scans incoming literature abstracts and queries for malicious prompt overrides.
* **User Memory Isolation**: Segregates project files, parameters, and databases to ensure safe execution states.
* **HMAC Integrity Verification**: Uses a cryptographically chained HMAC-SHA256 signature scheme on project activity logs to audit and detect unauthorized tampering.
* **Structured Audit Logs**: Logs every agent transition, message signature, and tool call for full trace transparency.
* **Least-Privilege Tool Exposure**: Minimizes tool permissions, strictly binding input types and isolating capabilities.
* **Secure Environment Variable Management**: Excludes secrets from client bundles, using server-only environment configurations.
* **Citation and Hyperlink Integrity Safeguards**:
  * **Immutable Citation Mapping**: Paper IDs are generated deterministically using a secure MD5 hashing scheme of titles (`paper_[hash]`), ensuring consistent indexing across all agent steps.
  * **Structured JSON Data Intermediates**: The Report Generator outputs key takeaways and reading roadmaps using precise JSON schemas referencing these immutable IDs.
  * **Post-Processing Anchor Compilation**: Compiles internal placeholders like `[citation:paper_hash]` to verified URL anchors by looking up the actual, retrieved paper metadata object, guaranteeing a 1:1 match.
  * **Real-Time Cryptographic Verification Endpoint**: Exposes a specialized API (`/api/projects/:id/verify-citations`) that executes cryptographic URL isolation and identifier integrity audits on bibliography files in real-time, displaying verification status badges inside the frontend dashboard.

---

## 🔌 Model Context Protocol (MCP) Server

ResearchPilot exposes an MCP-compatible server interface that allows external MCP clients to invoke ResearchPilot's research workflows and retrieve project information.

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
