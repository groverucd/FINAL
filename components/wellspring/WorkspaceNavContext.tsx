'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'

export type WorkspaceTabId =
  | 'overview'
  | 'intake'
  | 'inventory'
  | 'distribution'
  | 'reports'

const STORAGE_INTAKE_CATEGORY = 'wellspring_prefill_intake_category'
const STORAGE_INVENTORY_FILTER = 'wellspring_prefill_inventory_filter'

export type WorkspaceNavValue = {
  goToTab: (tab: WorkspaceTabId) => void
  applyRecommendationToIntake: (categorySlug: string) => void
  focusInventoryByStatus: (status: 'low' | 'critical' | 'all') => void
}

const WorkspaceNavContext = createContext<WorkspaceNavValue | null>(null)

export function WorkspaceNavProvider({
  children,
  setActiveTab,
}: {
  children: ReactNode
  setActiveTab: (tab: WorkspaceTabId) => void
}) {
  const goToTab = useCallback(
    (tab: WorkspaceTabId) => {
      setActiveTab(tab)
    },
    [setActiveTab],
  )

  const applyRecommendationToIntake = useCallback(
    (categorySlug: string) => {
      try {
        sessionStorage.setItem(STORAGE_INTAKE_CATEGORY, categorySlug)
      } catch {
        /* ignore quota / private mode */
      }
      setActiveTab('intake')
    },
    [setActiveTab],
  )

  const focusInventoryByStatus = useCallback(
    (status: 'low' | 'critical' | 'all') => {
      try {
        sessionStorage.setItem(STORAGE_INVENTORY_FILTER, status)
      } catch {
        /* ignore */
      }
      setActiveTab('inventory')
    },
    [setActiveTab],
  )

  const value = useMemo(
    (): WorkspaceNavValue => ({
      goToTab,
      applyRecommendationToIntake,
      focusInventoryByStatus,
    }),
    [goToTab, applyRecommendationToIntake, focusInventoryByStatus],
  )

  return (
    <WorkspaceNavContext.Provider value={value}>{children}</WorkspaceNavContext.Provider>
  )
}

export function useWorkspaceNav(): WorkspaceNavValue {
  const ctx = useContext(WorkspaceNavContext)
  return (
    ctx ?? {
      goToTab: () => {},
      applyRecommendationToIntake: () => {},
      focusInventoryByStatus: () => {},
    }
  )
}

export { STORAGE_INTAKE_CATEGORY, STORAGE_INVENTORY_FILTER }
