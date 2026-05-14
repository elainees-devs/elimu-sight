import type { ComponentType } from 'react'

export interface NavItem {
  label: string
  to: string
  icon?: ComponentType<{ className?: string }>
  roles?: string[]
}

export interface NavGroup {
  label: string
  items: NavItem[]
}
