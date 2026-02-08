'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFileUpload } from '@/hooks/use-file-upload'
import { useComparison } from '@/context'
import { DropZone } from '@/components/upload/drop-zone'
import { FilePreview } from '@/components/upload/file-preview'

export default function HomePage() {
  const router = useRouter()
  const { setDocument, clearDocument, isReady } = useComparison()

  const original = useFileUpload()
  const modified = useFileUpload()

  // Sync ready files into context
  useEffect(() => {
    if (original.file && original.state === 'ready') {
      setDocument('original', original.file)
    }
  }, [original.file, original.state, setDocument])

  useEffect(() => {
    if (modified.file && modified.state === 'ready') {
      setDocument('modified', modified.file)
    }
  }, [modified.file, modified.state, setDocument])

  const handleOriginalRemove = () => {
    original.reset()
    clearDocument('original')
  }

  const handleModifiedRemove = () => {
    modified.reset()
    clearDocument('modified')
  }

  const handleCompare = () => {
    if (isReady) router.push('/compare')
  }

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
        {/* Original Document Slot */}
        <div>
          {original.state === 'ready' && original.file ? (
            <FilePreview file={original.file} onRemove={handleOriginalRemove} />
          ) : (
            <DropZone
              state={original.state}
              error={original.error}
              onFileSelect={original.handleUpload}
              label="Original document"
            />
          )}
        </div>

        {/* Modified Document Slot */}
        <div>
          {modified.state === 'ready' && modified.file ? (
            <FilePreview file={modified.file} onRemove={handleModifiedRemove} />
          ) : (
            <DropZone
              state={modified.state}
              error={modified.error}
              onFileSelect={modified.handleUpload}
              label="Modified document"
            />
          )}
        </div>
      </div>

      <button
        disabled={!isReady}
        onClick={handleCompare}
        className={`mt-8 rounded-lg px-8 py-3 text-sm font-medium transition-all ${
          isReady
            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600'
            : 'cursor-not-allowed bg-zinc-800 text-zinc-500'
        }`}
      >
        Compare Documents
      </button>
    </main>
  )
}
