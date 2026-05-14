import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { API_CONFIG } from '@shared/config/api-config'
import { useAuthStore } from '@stores/auth-store'
import { useSchoolStore } from '@stores/school-store'

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token
  const schoolId = useSchoolStore.getState().schoolId

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (schoolId) {
    config.headers['X-School-Id'] = schoolId
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth()
    }
    return Promise.reject(error)
  },
)
