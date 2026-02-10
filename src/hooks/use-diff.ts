'use client'

import { useState, useCallback, useEffect } from 'react'
import type { DocumentFile, DiffResult, UploadError } from '@/types'
import { computeDiff } from '@/lib/diff'

export type DiffState = 'idle' | 'computing' | 'ready' | 'error'

export interface UseDiffResult {
  diffResult: DiffResult | null
  state: DiffState
  error: UploadError | null
  compute: () => void
  reset: () => void
}

/**
 * Hook for computing diffs between two documents.
 * Manages loading and error state independently.
 * Resets automatically when documents change.
 * Computation is not automatic - call compute() to trigger.
 */
export function useDiff(
  original: DocumentFile | null,
  modified: DocumentFile | null
): UseDiffResult {
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null)
  const [state, setState] = useState<DiffState>('idle')
  const [error, setError] = useState<UploadError | null>(null)

  // Reset diff state when documents change so stale results are never shown
  useEffect(() => {
    setDiffResult(null)
    setState('idle')
    setError(null)
  }, [original?.id, modified?.id])

  const compute = useCallback(() => {
    if (!original || !modified) {
      setError({
        code: 'MISSING_DOCUMENTS',
        message: 'Both original and modified documents are required.',
      })
      setState('error')
      return
    }

    setState('computing')
    setError(null)

    // Yield to the browser before computing so the spinner renders
    requestAnimationFrame(() => {
      try {
        const result = computeDiff(original, modified)
        setDiffResult(result)
        setState('ready')
      } catch (err) {
        setError({
          code: 'DIFF_COMPUTATION_ERROR',
          message:
            err instanceof Error ? err.message : 'Failed to compute differences.',
        })
        setState('error')
        setDiffResult(null)
      }
    })
  }, [original, modified])

  const reset = useCallback(() => {
    setDiffResult(null)
    setState('idle')
    setError(null)
  }, [])

  return {
    diffResult,
    state,
    error,
    compute,
    reset,
  }
}
