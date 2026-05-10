'use client'

import { forwardRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard,
  Inbox,
  Package,
  HandHeart,
  BarChart3,
} from 'lucide-react'
import { OverviewTab } from '@/components/wellspring/tabs/OverviewTab'
import { IntakeTab } from '@/components/wellspring/tabs/IntakeTab'
import { InventoryTab } from '@/components/wellspring/tabs/InventoryTab'
import { DistributionTab } from '@/components/wellspring/tabs/DistributionTab'
import { ReportsTab } from '@/components/wellspring/tabs/ReportsTab'
import { GlassCard } from '@/components/wellspring/GlassCard'
import {
  WorkspaceNavProvider,
  type WorkspaceTabId,
} from '@/components/wellspring/WorkspaceNavContext'

type TabId = WorkspaceTabId

interface Tab {
  id: TabId
  label: string
  icon: typeof LayoutDashboard
  description: string
}

const TABS: Tab[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    description: 'A calm view of donations, distribution, and impact today.',
  },
  {
    id: 'intake',
    label: 'Intake',
    icon: Inbox,
    description: 'Log new donations as they arrive at the center.',
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: Package,
    description: 'See what is on hand, what is healthy, and what is low.',
  },
  {
    id: 'distribution',
    label: 'Distribution',
    icon: HandHeart,
    description: 'Record items going out to families with respect and clarity.',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    description: 'Weekly summaries and recommended next steps.',
  },
]

export const ProductWorkspace = forwardRef<HTMLDivElement>(function ProductWorkspace(
  _props,
  ref,
) {
  const [active, setActive] = useState<TabId>('overview')
  const activeTab = TABS.find((t) => t.id === active) ?? TABS[0]

  return (
    <section
      ref={ref}
      id="workspace"
      className="relative px-5 pb-24 pt-12 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Workspace
            </p>
            <h2 className="mt-1 text-balance font-serif text-3xl font-medium text-foreground sm:text-4xl">
              {activeTab.label}
            </h2>
            <p className="mt-1 max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
              {activeTab.description}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <GlassCard className="mb-6 overflow-hidden p-1.5">
          <div
            role="tablist"
            aria-label="Workspace sections"
            className="flex flex-nowrap gap-1 overflow-x-auto"
          >
            {TABS.map((tab) => {
              const isActive = tab.id === active
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  id={`tab-${tab.id}`}
                  onClick={() => setActive(tab.id)}
                  className="relative inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-tab-pill"
                      className="absolute inset-0 rounded-full bg-foreground"
                      transition={{ type: 'spring', stiffness: 480, damping: 36 }}
                    />
                  )}
                  <span
                    className={`relative z-10 flex items-center gap-2 ${
                      isActive ? 'text-background' : 'text-foreground/75'
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>
        </GlassCard>

        {/* Panel */}
        <WorkspaceNavProvider setActiveTab={(tab) => setActive(tab)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              id={`panel-${active}`}
              role="tabpanel"
              aria-labelledby={`tab-${active}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              {active === 'overview' && <OverviewTab />}
              {active === 'intake' && <IntakeTab />}
              {active === 'inventory' && <InventoryTab />}
              {active === 'distribution' && <DistributionTab />}
              {active === 'reports' && <ReportsTab />}
            </motion.div>
          </AnimatePresence>
        </WorkspaceNavProvider>
      </div>
    </section>
  )
})
