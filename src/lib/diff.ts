import { diffLines } from 'diff'
import type { DocumentFile, Change, DiffResult, DiffSummary } from '@/types'

/**
 * Computes the differences between two documents.
 * Returns a DiffResult with categorized changes (added, removed, modified, unchanged).
 */
export function computeDiff(original: DocumentFile, modified: DocumentFile): DiffResult {
  // Get raw diff output from diff library
  const rawDiff = diffLines(original.content, modified.content)

  // Parse raw diff into changes with proper line numbering
  const changes = parseRawDiff(rawDiff)

  // Apply smart matching to detect modifications (consecutive remove/add pairs)
  const finalChanges = applySmartMatching(changes)

  // Calculate summary statistics
  const summary = calculateDiffSummary(finalChanges)

  return {
    original,
    modified,
    changes: finalChanges,
    summary,
    createdAt: new Date(),
  }
}

/**
 * Parses raw diff output into Change objects with line numbers.
 * Tracks original and modified line positions independently.
 */
function parseRawDiff(
  rawDiff: Array<{ value: string; added?: boolean; removed?: boolean; count?: number }>
): Change[] {
  const changes: Change[] = []
  let originalLineNum = 1
  let modifiedLineNum = 1

  for (const segment of rawDiff) {
    const lines = segment.value.split('\n')
    // Remove trailing empty string from split if present
    const actualLines = segment.value.endsWith('\n') ? lines.slice(0, -1) : lines

    if (segment.added) {
      for (const line of actualLines) {
        changes.push({
          type: 'added',
          originalLineNumber: null,
          modifiedLineNumber: modifiedLineNum,
          originalText: '',
          modifiedText: line,
        })
        modifiedLineNum++
      }
    } else if (segment.removed) {
      for (const line of actualLines) {
        changes.push({
          type: 'removed',
          originalLineNumber: originalLineNum,
          modifiedLineNumber: null,
          originalText: line,
          modifiedText: '',
        })
        originalLineNum++
      }
    } else {
      for (const line of actualLines) {
        changes.push({
          type: 'unchanged',
          originalLineNumber: originalLineNum,
          modifiedLineNumber: modifiedLineNum,
          originalText: line,
          modifiedText: line,
        })
        originalLineNum++
        modifiedLineNum++
      }
    }
  }

  return changes
}

/**
 * Applies smart matching to detect modifications.
 * Pairs consecutive remove/add sequences into 'modified' changes.
 *
 * When a block of N removals is followed by M additions:
 * - min(N,M) pairs become modifications
 * - Remaining removals or additions stay as-is
 */
function applySmartMatching(changes: Change[]): Change[] {
  const result: Change[] = []
  let i = 0

  while (i < changes.length) {
    if (changes[i].type !== 'removed') {
      result.push(changes[i])
      i++
      continue
    }

    // Collect consecutive removals
    const removals: Change[] = []
    while (i < changes.length && changes[i].type === 'removed') {
      removals.push(changes[i])
      i++
    }

    // Collect consecutive additions immediately following
    const additions: Change[] = []
    while (i < changes.length && changes[i].type === 'added') {
      additions.push(changes[i])
      i++
    }

    // Pair them up: min(removals, additions) become modifications
    const pairCount = Math.min(removals.length, additions.length)

    for (let p = 0; p < pairCount; p++) {
      result.push({
        type: 'modified',
        originalLineNumber: removals[p].originalLineNumber,
        modifiedLineNumber: additions[p].modifiedLineNumber,
        originalText: removals[p].originalText,
        modifiedText: additions[p].modifiedText,
      })
    }

    // Remaining unmatched removals
    for (let p = pairCount; p < removals.length; p++) {
      result.push(removals[p])
    }

    // Remaining unmatched additions
    for (let p = pairCount; p < additions.length; p++) {
      result.push(additions[p])
    }
  }

  return result
}

/**
 * Calculates aggregate statistics from a list of changes.
 */
export function calculateDiffSummary(changes: Change[]): DiffSummary {
  let additions = 0
  let removals = 0
  let modifications = 0

  for (const change of changes) {
    if (change.type === 'added') {
      additions++
    } else if (change.type === 'removed') {
      removals++
    } else if (change.type === 'modified') {
      modifications++
    }
  }

  return {
    totalChanges: additions + removals + modifications,
    additions,
    removals,
    modifications,
  }
}
