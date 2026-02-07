import Link from 'next/link'
import { APP_NAME } from '@/constants/config'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold">{APP_NAME}</h1>
      <p className="max-w-md text-center text-lg text-gray-600">
        Upload two documents and visually compare their differences.
      </p>
      <Link
        href="/compare"
        className="rounded-lg bg-foreground px-6 py-3 text-background transition-opacity hover:opacity-90"
      >
        Get Started
      </Link>
    </main>
  )
}
