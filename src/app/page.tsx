export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center px-6 pb-12 pt-20 md:px-8">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Compare Documents
        </span>
      </h1>
      <p className="mt-4 max-w-md text-center text-lg text-zinc-400">
        Upload two documents to see what changed
      </p>

      <div className="mt-12 grid w-full max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex h-48 flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/50 text-zinc-500">
          <span className="text-sm font-medium">Original document</span>
        </div>

        <div className="flex h-48 flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/50 text-zinc-500">
          <span className="text-sm font-medium">Modified document</span>
        </div>
      </div>

      <button
        disabled
        className="mt-8 cursor-not-allowed rounded-lg bg-zinc-800 px-8 py-3 text-sm font-medium text-zinc-500"
      >
        Compare Documents
      </button>
    </main>
  )
}
