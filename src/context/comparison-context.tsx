'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react'
import type { ReactNode } from 'react'
import type { DocumentFile, FileSlot } from '@/types'

interface ComparisonContextValue {
  /** The original document (left slot). */
  original: DocumentFile | null
  /** The modified document (right slot). */
  modified: DocumentFile | null
  /** Sets a document for a specific slot. */
  setDocument: (slot: FileSlot, doc: DocumentFile) => void
  /** Clears a specific slot. */
  clearDocument: (slot: FileSlot) => void
  /** Clears both slots. */
  clearAll: () => void
  /** True when both documents are loaded. */
  isReady: boolean
}

const ComparisonContext = createContext<ComparisonContextValue | null>(null)

interface ComparisonProviderProps {
  children: ReactNode
}

/** Provider that manages comparison state across pages. */
export function ComparisonProvider({ children }: ComparisonProviderProps) {
  const [original, setOriginal] = useState<DocumentFile | null>(null)
  const [modified, setModified] = useState<DocumentFile | null>(null)

  const setDocument = useCallback((slot: FileSlot, doc: DocumentFile) => {
    if (slot === 'original') {
      setOriginal(doc)
    } else {
      setModified(doc)
    }
  }, [])

  const clearDocument = useCallback((slot: FileSlot) => {
    if (slot === 'original') {
      setOriginal(null)
    } else {
      setModified(null)
    }
  }, [])

  const clearAll = useCallback(() => {
    setOriginal(null)
    setModified(null)
  }, [])

  const isReady = original !== null && modified !== null

  return (
    <ComparisonContext.Provider
      value={{
        original,
        modified,
        setDocument,
        clearDocument,
        clearAll,
        isReady,
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

  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider')
  }

  return context
}
