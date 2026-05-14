import { LoginForm } from '@features/auth'
import { Link } from '@tanstack/react-router'

export function LoginPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900">Sign in</h2>
      <p className="mt-1 text-sm text-gray-600">
        Welcome back! Sign in to your account.
      </p>
      <div className="mt-6">
        <LoginForm />
      </div>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
          Sign up
        </Link>
      </p>
    </div>
  )
}
