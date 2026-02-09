'use client'

import type { DocumentFile } from '@/types'
import { formatFileSize } from '@/lib/utils'

interface FilePreviewProps {
  /** The uploaded document file to display. */
  file: DocumentFile
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
      .{type}
    </span>
  )
}

/** Truncates a filename to maxLen characters with ellipsis. */
function truncateFilename(name: string, maxLen: number = 40): string {
  if (name.length <= maxLen) return name

  const extIndex = name.lastIndexOf('.')
  if (extIndex === -1) return `${name.slice(0, maxLen - 3)}...`

  const ext = name.slice(extIndex)
  const base = name.slice(0, extIndex)
  const availableLen = maxLen - ext.length - 3

  if (availableLen <= 0) return `${name.slice(0, maxLen - 3)}...`

  return `${base.slice(0, availableLen)}...${ext}`
}

/**
 * Displays file metadata and a scrollable text preview for an uploaded document.
 * Shows file info (name, type badge, size, line count) and the first 10 lines
 * of content with line numbers in a monospace preview box.
 */
export function FilePreview({ file }: FilePreviewProps) {
  const previewLines = file.content.split('\n').slice(0, 10)

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      {/* Header row: icon, filename, badge */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-white/10 text-sm">
          <svg
            className="h-4 w-4 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
        </div>
        <p className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-300">
          {truncateFilename(file.name)}
        </p>
        <FileTypeBadge type={file.fileType} />
      </div>

      {/* Metadata row */}
      <div className="mt-3 flex items-center gap-2 text-sm text-zinc-500">
        <span>{formatFileSize(file.size)}</span>
        <span>·</span>
        <span>{file.lineCount.toLocaleString()} lines</span>
      </div>

      {/* Text preview section */}
      <div className="mt-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
          Preview
        </p>
        <div className="max-h-[200px] overflow-y-auto rounded bg-black/20 p-3">
          {previewLines.map((line, index) => (
            <div key={index} className="flex font-mono text-xs leading-relaxed">
              <span className="w-8 shrink-0 select-none text-right text-white/40">
                {index + 1}
              </span>
              <span className="ml-3 whitespace-pre-wrap break-all text-zinc-400">
                {line || '\u00A0'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
