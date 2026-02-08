import Link from 'next/link'

export default function ComparePage() {
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

        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="space-y-0.5 p-4 font-mono text-sm leading-relaxed">
            <div className="rounded px-3 py-1 text-zinc-400">
              This line is unchanged in both documents.
            </div>
            <div className="rounded bg-diff-removed-bg px-3 py-1 text-diff-removed-text line-through">
              - This line was removed from the original.
            </div>
            <div className="rounded bg-diff-added-bg px-3 py-1 text-diff-added-text">
              + This line was added in the modified version.
            </div>
            <div className="rounded px-3 py-1 text-zinc-400">
              Another unchanged line for context.
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
