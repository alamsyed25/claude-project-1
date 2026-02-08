'use client'

import type { DocumentFile } from '@/types'
import { formatFileSize } from '@/lib/utils'

interface FilePreviewProps {
  /** The uploaded document file. */
  file: DocumentFile
  /** Callback when user clicks remove. */
  onRemove: () => void
}

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

/** Displays file metadata and a content preview for an uploaded document. */
export function FilePreview({ file, onRemove }: FilePreviewProps) {
  const previewLines = file.content.split('\n').slice(0, 5)
  const hasMoreLines = file.lineCount > 5

  return (
    <div className="flex h-48 flex-col overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900/50">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-zinc-800 px-3 py-2.5">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <FileTypeBadge type={file.fileType} />
            <p className="truncate text-sm font-medium text-zinc-300">
              {file.name}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span>{formatFileSize(file.size)}</span>
            <span>·</span>
            <span>{file.lineCount.toLocaleString()} lines</span>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
          aria-label="Remove file"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Content Preview */}
      <div className="flex-1 overflow-y-auto p-3">
        <pre className="font-mono text-xs leading-relaxed text-zinc-400">
          {previewLines.map((line, index) => (
            <div key={index}>{line || '\u00A0'}</div>
          ))}
          {hasMoreLines && (
            <div className="mt-1 text-zinc-600">
              ... {(file.lineCount - 5).toLocaleString()} more lines
            </div>
          )}
        </pre>
      </div>
    </div>
  )
}
