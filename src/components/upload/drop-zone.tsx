'use client'

import { useRef, useState } from 'react'
import type { DragEvent, ChangeEvent } from 'react'
import type { UploadState, UploadError } from '@/types'
import { SUPPORTED_FILE_TYPES } from '@/constants/config'

interface DropZoneProps {
  /** Current upload state. */
  state: UploadState
  /** Error details if state is 'error'. */
  error: UploadError | null
  /** Callback when a file is selected or dropped. */
  onFileSelect: (file: File) => void
  /** Label for this file slot (e.g., "Original document"). */
  label: string
}

/** Drag-and-drop file upload zone with click-to-browse fallback. */
export function DropZone({ state, error, onFileSelect, label }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isInteractive = state === 'idle' || state === 'error'
  const isLoading = state === 'uploading' || state === 'parsing'
  const hasError = state === 'error'

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (isInteractive) setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    if (!isInteractive) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) onFileSelect(files[0])
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onFileSelect(files[0])
      // Reset input so same file can be re-selected after removal
      e.target.value = ''
    }
  }

  const handleClick = () => {
    if (isInteractive) fileInputRef.current?.click()
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`flex h-48 flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 ${
        isDragOver && isInteractive
          ? 'border-blue-500 bg-blue-500/10'
          : hasError
            ? 'border-red-500/50 bg-red-500/5'
            : 'border-zinc-700 bg-zinc-900/50'
      } ${isInteractive ? 'cursor-pointer hover:border-zinc-600 hover:bg-zinc-900/70' : 'cursor-default'}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={SUPPORTED_FILE_TYPES.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {isLoading ? (
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-blue-500" />
          <p className="text-sm font-medium text-zinc-400">
            {state === 'uploading' ? 'Uploading...' : 'Parsing document...'}
          </p>
        </div>
      ) : hasError && error ? (
        <div className="flex flex-col items-center gap-2 px-6 text-center">
          <svg
            className="h-8 w-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-sm font-medium text-red-400">{error.message}</p>
          <p className="mt-1 text-xs text-zinc-500">Click to try again</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 px-6 text-center">
          <svg
            className="h-10 w-10 text-zinc-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-zinc-300">{label}</p>
            <p className="mt-1 text-xs text-zinc-500">
              Click to browse or drag and drop
            </p>
          </div>
          <p className="text-xs text-zinc-600">
            {SUPPORTED_FILE_TYPES.map((t) => t.replace('.', '').toUpperCase()).join(', ')}
          </p>
        </div>
      )}
    </div>
  )
}
