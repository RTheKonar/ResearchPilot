/**
 * Shared Type Definitions for ResearchPilot
 */

export interface AgentLog {
  timestamp: string;
  agent: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  event_id?: string;
  session_id?: string;
  user_id_hash?: string;
  action_type?: string;
  severity?: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  status?: 'SUCCESS' | 'FAILED' | 'BLOCKED' | 'RETRY';
  payload?: any;
  duration_ms?: number;
  log_signature?: string;
}

export interface ResearchTask {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  description: string;
  agent: string;
}

export interface ResearchPlan {
  tasks: ResearchTask[];
}

export interface PaperDetails {
  problemStatement: string;
  methodology: string;
  model: string;
  dataset: string;
  evaluationMetrics: string;
  keyResults: string;
  limitations: string;
  futureWork: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  citationCount: number;
  url: string;
  pdfUrl?: string;
  details?: PaperDetails;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  estReadingTime?: number;
}

export interface PaperComparison {
  paperId: string;
  title: string;
  method: string;
  dataset: string;
  strengths: string;
  weaknesses: string;
  novelContributions: string;
}

export interface GapAnalysis {
  openProblems: string[];
  researchGaps: string[];
  commonLimitations: string[];
  conflictingResults: string[];
  futureDirections: string[];
}

export interface GlossaryItem {
  term: string;
  definition: string;
}

export interface SecurityCheck {
  component: string;
  status: 'passed' | 'warning' | 'blocked';
  details: string;
}

export interface DefenseAudit {
  overallVerdict: 'safe' | 'threat_blocked';
  scannedAt: string;
  checks: SecurityCheck[];
  sanitizedQuery: string;
  poisonedPayloadBlockedCount: number;
}

export interface ResearchReport {
  objective: string;
  executiveSummary: string;
  topPapers: string[];
  methodologicalTrends: string;
  suggestedReadingOrder: string[];
  futureResearchDirections: string[];
  glossary: GlossaryItem[];
  bibliography: string;
  rawMarkdown: string;
}

export interface ResearchProject {
  id: string;
  name: string;
  query: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  logs: AgentLog[];
  plan: ResearchPlan | null;
  papers: ResearchPaper[];
  comparison: PaperComparison[];
  gapAnalysis: GapAnalysis | null;
  report: ResearchReport | null;
  defenseAudit?: DefenseAudit;
  timestamp: string;
}
