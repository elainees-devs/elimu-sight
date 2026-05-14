import { useRouter } from '@tanstack/react-router'

export function ErrorPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Something went wrong</h1>
        <p className="mt-4 text-gray-600">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={() => router.invalidate()}
          className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
