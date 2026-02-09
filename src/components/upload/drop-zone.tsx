'use client'

import { useRef, useState } from 'react'
import type { DragEvent, ChangeEvent, KeyboardEvent } from 'react'
import type { FileSlot, DocumentFile, UploadState, UploadError } from '@/types'
import { SUPPORTED_FILE_TYPES } from '@/constants/config'
import { formatFileSize } from '@/lib/utils'

interface DropZoneProps {
  /** Which comparison slot this zone represents. */
  slot: FileSlot
  /** The uploaded document, or null if none yet. */
  file: DocumentFile | null
  /** Current upload state. */
  uploadState: UploadState
  /** Error details if uploadState is 'error'. */
  error: UploadError | null
  /** Callback when a file is selected or dropped. */
  onFile: (file: File) => void
  /** Resets the slot back to idle. */
  onReset: () => void
}

/** Slot-specific accent colors for original (blue) vs modified (purple). */
const SLOT_COLORS = {
  original: {
    dragBorder: 'border-blue-500/50',
    dragBg: 'bg-blue-500/5',
    accent: 'text-blue-400',
    badge: 'bg-blue-500/20 text-blue-400',
  },
  modified: {
    dragBorder: 'border-purple-500/50',
    dragBg: 'bg-purple-500/5',
    accent: 'text-purple-400',
    badge: 'bg-purple-500/20 text-purple-400',
  },
} as const

/** Slot-specific labels and descriptions. */
const SLOT_LABELS = {
  original: {
    title: 'Original Document',
    description: 'The base document',
  },
  modified: {
    title: 'Modified Document',
    description: 'The updated document',
  },
} as const

/** Color-coded badge for file type. */
function FileTypeBadge({ type }: { type: string }) {
  const colorMap: Record<string, string> = {
    txt: 'bg-zinc-700 text-zinc-300',
    md: 'bg-blue-500/20 text-blue-400',
    docx: 'bg-indigo-500/20 text-indigo-400',
    pdf: 'bg-red-500/20 text-red-400',
  }

  return (
    <span
      className={`rounded px-2 py-0.5 text-xs font-medium uppercase ${colorMap[type] || colorMap.txt}`}
    >
      {type}
    </span>
  )
}

/** Drag-and-drop file upload zone with click-to-browse fallback. */
export function DropZone({
  slot,
  file,
  uploadState,
  error,
  onFile,
  onReset,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const colors = SLOT_COLORS[slot]
  const labels = SLOT_LABELS[slot]

  const isIdle = uploadState === 'idle'
  const isLoading = uploadState === 'uploading' || uploadState === 'parsing'
  const hasError = uploadState === 'error'
  const isReady = uploadState === 'ready' && file !== null
  const isInteractive = isIdle || hasError

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (isInteractive) setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (!isInteractive) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) onFile(files[0])
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onFile(files[0])
      // Reset input so same file can be re-selected after removal
      e.target.value = ''
    }
  }

  const handleClick = () => {
    if (isInteractive) {
      fileInputRef.current?.click()
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && isInteractive) {
      e.preventDefault()
      fileInputRef.current?.click()
    }
  }

  /** Builds the container className based on current state. */
  const containerClass = (() => {
    const base =
      'relative flex min-h-[300px] flex-col items-center justify-center rounded-lg p-8 transition-all duration-200'

    if (isDragging && isInteractive) {
      return `${base} border-2 border-dashed ${colors.dragBorder} ${colors.dragBg} scale-[1.02]`
    }

    if (isLoading) {
      return `${base} border-2 border-solid border-white/20 cursor-default`
    }

    if (hasError) {
      return `${base} border-2 border-dashed border-red-500/50 bg-red-500/5 cursor-pointer`
    }

    if (isReady) {
      return `${base} border border-solid border-white/10`
    }

    // Idle
    return `${base} border-2 border-dashed border-white/10 cursor-pointer hover:border-white/20`
  })()

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={isInteractive ? 0 : -1}
      role="button"
      aria-label={`Upload ${labels.title.toLowerCase()}`}
      className={containerClass}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={SUPPORTED_FILE_TYPES.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
        aria-hidden="true"
      />

      {/* STATE: Dragging */}
      {isDragging && isInteractive && (
        <div className="flex flex-col items-center gap-3">
          <svg
            className={`h-12 w-12 ${colors.accent}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3-3m0 0l3 3m-3-3v12"
            />
          </svg>
          <p className={`text-sm font-medium ${colors.accent}`}>
            Drop to upload
          </p>
        </div>
      )}

      {/* STATE: Loading (uploading / parsing) */}
      {isLoading && !isDragging && (
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-blue-500" />
          <p className="animate-pulse text-sm font-medium text-zinc-400">
            Processing document...
          </p>
        </div>
      )}

      {/* STATE: Error */}
      {hasError && !isDragging && error && (
        <div className="flex flex-col items-center gap-3 text-center">
          <svg
            className="h-10 w-10 text-red-500"
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
          <p className="max-w-[220px] text-sm font-medium text-red-400">
            {error.message}
          </p>
          <p className="text-xs text-zinc-500">Click to try again</p>
        </div>
      )}

      {/* STATE: Ready (file uploaded) */}
      {isReady && !isDragging && file && (
        <div className="flex w-full flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <FileTypeBadge type={file.fileType} />
            <p className="max-w-[180px] truncate text-sm font-medium text-zinc-300">
              {file.name}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span>{formatFileSize(file.size)}</span>
            <span>·</span>
            <span>{file.lineCount.toLocaleString()} lines</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onReset()
            }}
            className="rounded-md border border-zinc-700 px-4 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-red-500/50 hover:bg-red-500/5 hover:text-red-400"
          >
            Remove
          </button>
        </div>
      )}

      {/* STATE: Idle */}
      {isIdle && !isDragging && (
        <div className="flex flex-col items-center gap-4 text-center">
          <svg
            className="h-12 w-12 text-zinc-600"
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
            <p className="text-sm font-medium text-zinc-300">{labels.title}</p>
            <p className="mt-1 text-xs text-zinc-500">{labels.description}</p>
          </div>
          <p className="text-xs text-zinc-500">
            Drop file here or click to browse
          </p>
          <p className="text-xs text-zinc-600">
            Supports: {SUPPORTED_FILE_TYPES.join(', ')}
          </p>
        </div>
      )}
    </div>
  )
}
