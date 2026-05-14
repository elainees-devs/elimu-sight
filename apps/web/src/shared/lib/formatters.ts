import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function formatDate(date: Date | string, fmt: string = 'PP'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, fmt)
}

export function formatDateTime(date: Date | string): string {
  return formatDate(date, 'PPp')
}

export function timeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatScore(score: number, total: number): string {
  return `${score}/${total}`
}
