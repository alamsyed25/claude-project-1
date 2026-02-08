'use client'

import { useState, useCallback } from 'react'
import type {
  DocumentFile,
  UploadState,
  UploadError,
  FileType,
} from '@/types'
import { parseFile, ParseError } from '@/lib/parsers'
import { generateId, getFileExtension } from '@/lib/utils'
import {
  SUPPORTED_FILE_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} from '@/constants/config'

interface UseFileUploadResult {
  /** The uploaded and parsed document, or null. */
  file: DocumentFile | null
  /** Current state of the upload pipeline. */
  state: UploadState
  /** Error details if state is 'error'. */
  error: UploadError | null
  /** Initiates upload and parsing for a file. */
  handleUpload: (file: File) => Promise<void>
  /** Resets to idle state. */
  reset: () => void
}

/**
 * Hook for managing file upload, validation, and parsing.
 * Provides a complete state machine for a single file slot.
 */
export function useFileUpload(): UseFileUploadResult {
  const [file, setFile] = useState<DocumentFile | null>(null)
  const [state, setState] = useState<UploadState>('idle')
  const [error, setError] = useState<UploadError | null>(null)

  const reset = useCallback(() => {
    setFile(null)
    setState('idle')
    setError(null)
  }, [])

  const handleUpload = useCallback(async (uploadedFile: File) => {
    setError(null)
    setState('uploading')

    try {
      // Validate file type
      const extension = getFileExtension(uploadedFile.name)
      if (
        !SUPPORTED_FILE_TYPES.includes(
          extension as (typeof SUPPORTED_FILE_TYPES)[number],
        )
      ) {
        throw {
          code: 'INVALID_TYPE',
          message: `File type "${extension}" is not supported. Please upload ${SUPPORTED_FILE_TYPES.join(', ')} files.`,
        }
      }

      // Validate file size
      if (uploadedFile.size > MAX_FILE_SIZE_BYTES) {
        throw {
          code: 'FILE_TOO_LARGE',
          message: `File size exceeds the ${MAX_FILE_SIZE_MB} MB limit.`,
        }
      }

      // Parse the file
      setState('parsing')
      const parseResult = await parseFile(uploadedFile)

      // Build DocumentFile
      const documentFile: DocumentFile = {
        id: generateId(),
        name: uploadedFile.name,
        content: parseResult.content,
        fileType: extension.slice(1) as FileType,
        size: uploadedFile.size,
        uploadedAt: new Date(),
        lineCount: parseResult.lineCount,
      }

      setFile(documentFile)
      setState('ready')
    } catch (err: unknown) {
      if (
        err !== null &&
        typeof err === 'object' &&
        'code' in err &&
        'message' in err
      ) {
        setError(err as UploadError)
      } else if (err instanceof ParseError) {
        setError({ code: 'PARSE_ERROR', message: err.message })
      } else {
        setError({
          code: 'UNKNOWN_ERROR',
          message:
            err instanceof Error
              ? err.message
              : 'An unexpected error occurred',
        })
      }
      setState('error')
    }
  }, [])

  return { file, state, error, handleUpload, reset }
}
