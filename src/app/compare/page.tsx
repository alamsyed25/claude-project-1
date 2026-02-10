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

/** Spinner component for loading state. */
function Spinner() {
  return (
    <div className="inline-block animate-spin">
      <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full" />
    </div>
  )
}

export default function ComparePage() {
  const router = useRouter()
  const { original, modified, diffResult, diffState, diffError, computeDiff } =
    useComparison()

  // Redirect if no files
  useEffect(() => {
    if (!original || !modified) {
      router.push('/')
    }
  }, [original, modified, router])

  // Auto-compute diff when files are ready
  useEffect(() => {
    if (original && modified && diffState === 'idle') {
      computeDiff()
    }
  }, [original, modified, diffState, computeDiff])

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

      {/* Diff result section */}
      {diffState === 'computing' && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center">
          <div className="flex items-center justify-center gap-3">
            <Spinner />
            <p className="text-white/60">Computing differences...</p>
          </div>
        </div>
      )}

      {diffState === 'ready' && diffResult && (
        <>
          {diffResult.summary.totalChanges === 0 ? (
            <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-8 text-center">
              <p className="text-green-400">✓ Files are identical</p>
            </div>
          ) : (
            <div className="rounded-lg border border-white/10 bg-white/5 p-6">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Diff Summary
              </h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded bg-white/5 p-3">
                  <p className="text-sm text-white/60">Total Changes</p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {diffResult.summary.totalChanges}
                  </p>
                </div>
                <div className="rounded bg-green-500/10 p-3">
                  <p className="text-sm text-green-400">Additions</p>
                  <p className="mt-1 text-2xl font-bold text-green-400">
                    {diffResult.summary.additions}
                  </p>
                </div>
                <div className="rounded bg-red-500/10 p-3">
                  <p className="text-sm text-red-400">Removals</p>
                  <p className="mt-1 text-2xl font-bold text-red-400">
                    {diffResult.summary.removals}
                  </p>
                </div>
                <div className="rounded bg-yellow-500/10 p-3">
                  <p className="text-sm text-yellow-400">Modifications</p>
                  <p className="mt-1 text-2xl font-bold text-yellow-400">
                    {diffResult.summary.modifications}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/60">
                {diffResult.changes.length} total lines analyzed
              </p>
            </div>
          )}
        </>
      )}

      {diffState === 'error' && diffError && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-6">
          <p className="text-red-400">Error: {diffError.message}</p>
          <button
            onClick={computeDiff}
            className="mt-4 rounded bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  )
}
