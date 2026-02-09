'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useComparison } from '@/context'
import { formatFileSize } from '@/lib/utils'

/** Badge showing file type with color coding. */
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

export default function ComparePage() {
  const router = useRouter()
  const { original, modified } = useComparison()

  // Redirect if no files
  useEffect(() => {
    if (!original || !modified) {
      router.push('/')
    }
  }, [original, modified, router])

  if (!original || !modified) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with back link */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Comparison Result
        </h1>
        <Link
          href="/"
          className="text-sm font-medium text-zinc-400 transition-colors hover:text-foreground"
        >
          &larr; Back to Upload
        </Link>
      </div>

      {/* File info grid */}
      <div className="mb-8 mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <h3 className="mb-2 text-sm font-semibold text-white/60">
            Original
          </h3>
          <div className="flex items-center gap-2">
            <FileTypeBadge type={original.fileType} />
            <p className="truncate font-medium text-white">{original.name}</p>
          </div>
          <p className="mt-1 text-sm text-white/60">
            {formatFileSize(original.size)} · {original.lineCount.toLocaleString()} lines
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <h3 className="mb-2 text-sm font-semibold text-white/60">
            Modified
          </h3>
          <div className="flex items-center gap-2">
            <FileTypeBadge type={modified.fileType} />
            <p className="truncate font-medium text-white">{modified.name}</p>
          </div>
          <p className="mt-1 text-sm text-white/60">
            {formatFileSize(modified.size)} · {modified.lineCount.toLocaleString()} lines
          </p>
        </div>
      </div>

      {/* Placeholder for diff */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-white/60">
          Diff engine will be implemented in Phase 3
        </p>
      </div>
    </div>
  )
}
