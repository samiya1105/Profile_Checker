export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
  UNKNOWN = 'UNKNOWN'
}

export interface SecurityIssue {
  severity: RiskLevel;
  title: string;
  description: string;
}

export interface Source {
  title: string;
  uri: string;
}

export interface AnalysisResult {
  safetyScore: number; // 0 to 100
  overallRisk: RiskLevel;
  summary: string;
  vulnerabilities: SecurityIssue[];
  recommendations: string[];
  positiveFindings: string[];
  sources?: Source[];
}

export interface AnalysisRequest {
  profileUrl: string;
  platform: string;
  additionalContext: string;
}