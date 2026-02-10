import type { DocumentFile } from './document'

/** Categorizes a line-level change in a diff comparison. */
export type ChangeType = 'added' | 'removed' | 'modified' | 'unchanged'

/** Represents a single line-level change between two documents. */
export interface Change {
  /** The kind of change detected on this line. */
  type: ChangeType
  /** Line number in the original document. Null if the line was added. */
  originalLineNumber: number | null
  /** Line number in the modified document. Null if the line was removed. */
  modifiedLineNumber: number | null
  /** Text from the original document. Empty string if the line was added. */
  originalText: string
  /** Text from the modified document. Empty string if the line was removed. */
  modifiedText: string
}

/** Aggregate statistics for a diff comparison. */
export interface DiffSummary {
  /** Total number of changed lines (additions + removals + modifications). */
  totalChanges: number
  /** Number of lines added in the modified document. */
  additions: number
  /** Number of lines removed from the original document. */
  removals: number
  /** Number of lines modified between documents. */
  modifications: number
}

/** The complete result of comparing two documents. */
export interface DiffResult {
  /** The original (left-side) document. */
  original: DocumentFile
  /** The modified (right-side) document. */
  modified: DocumentFile
  /** Ordered list of line-level changes. */
  changes: Change[]
  /** Aggregate change statistics. */
  summary: DiffSummary
  /** Timestamp when this comparison was generated. */
  createdAt: Date
}
