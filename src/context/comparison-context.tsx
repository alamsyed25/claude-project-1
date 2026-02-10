'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { DocumentFile, DiffResult, UploadError } from '@/types'
import { useDiff, type DiffState } from '@/hooks'

/** Shape of the comparison context value. */
type ComparisonContextValue = {
  /** The original document (left slot). */
  original: DocumentFile | null
  /** The modified document (right slot). */
  modified: DocumentFile | null
  /** Sets the original document. Pass null to clear. */
  setOriginal: (file: DocumentFile | null) => void
  /** Sets the modified document. Pass null to clear. */
  setModified: (file: DocumentFile | null) => void
  /** Clears both document slots. */
  reset: () => void
  /** The computed diff result. */
  diffResult: DiffResult | null
  /** Current state of diff computation. */
  diffState: DiffState
  /** Error from diff computation, if any. */
  diffError: UploadError | null
  /** Trigger diff computation. */
  computeDiff: () => Promise<void>
}

const ComparisonContext = createContext<ComparisonContextValue | undefined>(
  undefined,
)

/** Provider that manages comparison state across pages. */
export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [original, setOriginal] = useState<DocumentFile | null>(null)
  const [modified, setModified] = useState<DocumentFile | null>(null)

  // Use diff hook internally to manage diff state
  const { diffResult, state: diffState, error: diffError, compute } = useDiff(
    original,
    modified
  )

  const reset = () => {
    setOriginal(null)
    setModified(null)
  }

  return (
    <ComparisonContext.Provider
      value={{
        original,
        modified,
        setOriginal,
        setModified,
        reset,
        diffResult,
        diffState,
        diffError,
        computeDiff: compute,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  )
}

/**
 * Hook to access comparison context.
 * Must be used within a ComparisonProvider.
 */
export function useComparison(): ComparisonContextValue {
  const context = useContext(ComparisonContext)

  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider')
  }

  return context
}
