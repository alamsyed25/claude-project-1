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
  const { original, modified, isReady } = useComparison()

  // Redirect to upload page if documents aren't loaded
  useEffect(() => {
    if (!isReady) {
      router.replace('/')
    }
  }, [isReady, router])

  // Show nothing while redirecting
  if (!isReady || !original || !modified) {
    return null
  }

  return (
    <main className="flex flex-1 flex-col px-6 pb-12 pt-10 md:px-8">
      <div className="mx-auto w-full max-w-5xl">
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

        {/* Document Info Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="flex items-center gap-2">
              <FileTypeBadge type={original.fileType} />
              <p className="truncate text-sm font-medium text-zinc-300">
                {original.name}
              </p>
            </div>
            <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500">
              <span>{formatFileSize(original.size)}</span>
              <span>·</span>
              <span>{original.lineCount.toLocaleString()} lines</span>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="flex items-center gap-2">
              <FileTypeBadge type={modified.fileType} />
              <p className="truncate text-sm font-medium text-zinc-300">
                {modified.name}
              </p>
            </div>
            <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500">
              <span>{formatFileSize(modified.size)}</span>
              <span>·</span>
              <span>{modified.lineCount.toLocaleString()} lines</span>
            </div>
          </div>
        </div>

        {/* Diff placeholder — will be built in Phase 3 */}
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center justify-center p-12 text-zinc-500">
            <p className="text-sm">
              Diff engine will be connected in Phase 3
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
