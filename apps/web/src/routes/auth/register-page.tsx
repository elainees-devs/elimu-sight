import { RegisterForm } from '@features/auth'
import { Link } from '@tanstack/react-router'

export function RegisterPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900">Create an account</h2>
      <p className="mt-1 text-sm text-gray-600">
        Get started with ElimuSight today.
      </p>
      <div className="mt-6">
        <RegisterForm />
      </div>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
          Sign in
        </Link>
      </p>
    </div>
  )
}
