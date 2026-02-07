/**
 * Core types for the Compare Document Tool.
 * Use these across components so the AI stays consistent.
 */

export type DocumentFileType = 'pdf' | 'docx' | 'txt' | 'md';

export interface DocumentFile {
  id: string;
  name: string;
  content: string;
  type: DocumentFileType;
  uploadedAt: Date;
}

export type ChangeType = 'added' | 'removed' | 'modified';

export interface Change {
  type: ChangeType;
  lineNumber: number;
  originalText?: string;
  modifiedText?: string;
}

export interface DiffSummary {
  additions: number;
  removals: number;
  modifications: number;
  unchanged: number;
}

export interface DiffResult {
  original: DocumentFile;
  modified: DocumentFile;
  changes: Change[];
  summary: DiffSummary;
}
