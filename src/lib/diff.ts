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
      // Lines added in modified version
      for (const line of actualLines) {
        changes.push({
          type: 'added',
          lineNumber: modifiedLineNum,
          originalText: '',
          modifiedText: line,
        })
        modifiedLineNum++
      }
    } else if (segment.removed) {
      // Lines removed from original version
      for (const line of actualLines) {
        changes.push({
          type: 'removed',
          lineNumber: originalLineNum, // Use original line number for removals
          originalText: line,
          modifiedText: '',
        })
        originalLineNum++
      }
    } else {
      // Unchanged lines
      for (const line of actualLines) {
        changes.push({
          type: 'unchanged',
          lineNumber: modifiedLineNum,
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
 * Applies smart position-based matching to detect modifications.
 * Consecutive remove/add pairs within ~5 line distance are classified as 'modified'.
 */
function applySmartMatching(changes: Change[]): Change[] {
  const result: Change[] = []
  const threshold = 5 // Max line distance to consider as modification
  let i = 0

  while (i < changes.length) {
    const change = changes[i]

    // Look for a removal followed by an addition within threshold distance
    if (change.type === 'removed' && i + 1 < changes.length) {
      let j = i + 1
      let foundAddition = false

      // Search within threshold
      while (j < changes.length && j - i <= threshold) {
        if (changes[j].type === 'added') {
          // Found a matching addition - merge into modification
          const modification: Change = {
            type: 'modified',
            lineNumber: changes[j].lineNumber,
            originalText: change.originalText,
            modifiedText: changes[j].modifiedText,
          }
          result.push(modification)
          i = j + 1
          foundAddition = true
          break
        } else if (changes[j].type === 'removed') {
          // Another removal before an addition - skip this one
          j++
        } else {
          // Unchanged line breaks the potential match
          break
        }
      }

      if (!foundAddition) {
        // No matching addition found, keep as removal
        result.push(change)
        i++
      }
    } else {
      // Not a removal or at end of list - keep as is
      result.push(change)
      i++
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
