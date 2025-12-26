export enum ThreatLevel {
  SAFE = 'SAFE',
  SUSPICIOUS = 'SUSPICIOUS',
  DANGEROUS = 'DANGEROUS',
  UNKNOWN = 'UNKNOWN'
}

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  extension: string;
  magicBytes: string; // First 32 bytes in Hex
  sampleContent?: string; // For text files
}

export interface AnalysisResult {
  threatLevel: ThreatLevel;
  score: number; // 0 to 100 (0 = safe, 100 = critical)
  summary: string;
  technicalDetails: string[];
  recommendation: string;
}

export interface AnalysisState {
  status: 'idle' | 'analyzing' | 'complete' | 'error';
  file: File | null;
  result: AnalysisResult | null;
  error?: string;
}