'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { DocumentFile } from '@/types'

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
}

const ComparisonContext = createContext<ComparisonContextValue | undefined>(
  undefined,
)

/** Provider that manages comparison state across pages. */
export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [original, setOriginal] = useState<DocumentFile | null>(null)
  const [modified, setModified] = useState<DocumentFile | null>(null)

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
