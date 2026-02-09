'use client'

import { useRouter } from 'next/navigation'
import { useFileUpload } from '@/hooks/use-file-upload'
import { useComparison } from '@/context'
import { DropZone } from '@/components/upload/drop-zone'
import { FilePreview } from '@/components/upload/file-preview'

export default function HomePage() {
  const router = useRouter()
  const { setOriginal, setModified } = useComparison()

  const originalUpload = useFileUpload()
  const modifiedUpload = useFileUpload()

  const bothReady =
    originalUpload.state === 'ready' &&
    modifiedUpload.state === 'ready' &&
    originalUpload.file !== null &&
    modifiedUpload.file !== null

  const handleCompare = () => {
    if (!bothReady || !originalUpload.file || !modifiedUpload.file) return

    setOriginal(originalUpload.file)
    setModified(modifiedUpload.file)
    router.push('/compare')
  }

  return (
    <main className="flex flex-1 flex-col items-center px-6 pb-12 pt-20 md:px-8">
      {/* Hero section */}
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Compare Documents
        </span>
      </h1>
      <p className="mt-4 max-w-md text-center text-lg text-zinc-400">
        Upload two documents to see what changed
      </p>

      {/* Two-column upload grid */}
      <div className="mt-12 grid w-full max-w-4xl grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Original */}
        <div className="space-y-4">
          <DropZone
            slot="original"
            file={originalUpload.file}
            uploadState={originalUpload.state}
            error={originalUpload.error}
            onFile={originalUpload.handleUpload}
            onReset={originalUpload.reset}
          />
          {originalUpload.file && originalUpload.state === 'ready' && (
            <FilePreview file={originalUpload.file} />
          )}
        </div>

        {/* Right: Modified */}
        <div className="space-y-4">
          <DropZone
            slot="modified"
            file={modifiedUpload.file}
            uploadState={modifiedUpload.state}
            error={modifiedUpload.error}
            onFile={modifiedUpload.handleUpload}
            onReset={modifiedUpload.reset}
          />
          {modifiedUpload.file && modifiedUpload.state === 'ready' && (
            <FilePreview file={modifiedUpload.file} />
          )}
        </div>
      </div>

      {/* Compare button */}
      <button
        disabled={!bothReady}
        onClick={handleCompare}
        className={`mx-auto mt-8 block rounded-lg px-8 py-4 text-lg font-semibold transition-all ${
          bothReady
            ? 'cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-purple-500'
            : 'cursor-not-allowed bg-white/5 text-white/40'
        }`}
      >
        Compare Documents
      </button>
    </main>
  )
}
