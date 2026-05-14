import { Outlet } from '@tanstack/react-router'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto h-10 w-10 rounded-lg bg-blue-600" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">ElimuSight</h1>
          <p className="mt-1 text-sm text-gray-600">AI-Powered School Intelligence</p>
        </div>
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
