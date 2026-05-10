'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Sparkles, Shirt, Baby, Apple, Home, ShieldCheck } from 'lucide-react'
import { type InventoryStatus } from '@/lib/wellspring-data'
import { InventoryCard } from '../InventoryCard'
import { getInventory } from '@/lib/api'
import { useToast } from '../Toast'

const filterChips: Array<{ id: 'all' | InventoryStatus; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'healthy', label: 'Healthy' },
  { id: 'watch', label: 'Watch' },
  { id: 'low', label: 'Low' },
  { id: 'critical', label: 'Critical' },
]

export function InventoryTab() {
  const { toast } = useToast()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | InventoryStatus>('all')
  const [categories, setCategories] = useState<
    Array<{
      key: string
      label: string
      icon: typeof Sparkles
      quantity: number
      threshold: number
      status: InventoryStatus
      trend: string
      recommendation: string
      tone: 'teal' | 'blush' | 'lavender' | 'gold' | 'sage' | 'rose'
    }>
  >([])

  useEffect(() => {
    let active = true
    async function loadInventory() {
      try {
        const rows = await getInventory()
        if (!active) return
        const mapped = rows.map((row) => {
          const ui = UI_BY_CATEGORY[row.category] ?? UI_BY_CATEGORY.hygiene
          return {
            key: row.category,
            label: row.display_name,
            icon: ui.icon,
            quantity: row.quantity,
            threshold: row.threshold,
            status: row.status,
            trend: row.quantity < row.threshold ? 'Demand rising' : 'Stable',
            recommendation:
              row.quantity < row.threshold
                ? `Prioritize ${row.display_name.toLowerCase()} in the next donation drive.`
                : 'Inventory is healthy.',
            tone: ui.tone,
          }
        })
        setCategories(mapped)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to load inventory.'
        toast(message, 'error')
      }
    }
    void loadInventory()
    return () => {
      active = false
    }
  }, [toast])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return categories.filter((c) => {
      const matchesQuery = q === '' || c.label.toLowerCase().includes(q)
      const matchesFilter = filter === 'all' || c.status === filter
      return matchesQuery && matchesFilter
    })
  }, [query, filter])

  return (
    <div className="flex flex-col gap-5">
      {/* controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="glass relative flex items-center rounded-full px-3 py-2 sm:max-w-sm">
          <Search className="mr-2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search inventory..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            aria-label="Search inventory"
          />
        </div>

        <div
          className="flex flex-wrap items-center gap-1.5"
          role="tablist"
          aria-label="Filter by status"
        >
          {filterChips.map((chip) => {
            const active = filter === chip.id
            return (
              <button
                key={chip.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(chip.id)}
                className={`relative rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="filter-active"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  />
                )}
                <span className="relative">{chip.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* grid */}
      {filtered.length === 0 ? (
        <div className="glass rounded-3xl p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No items match this view. Try a different filter or search term.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c, i) => (
            <InventoryCard key={c.key} category={c} delay={i * 0.05} />
          ))}
        </div>
      )}
    </div>
  )
}

const UI_BY_CATEGORY: Record<string, { icon: typeof Sparkles; tone: 'teal' | 'blush' | 'lavender' | 'gold' | 'sage' | 'rose' }> = {
  hygiene: { icon: Sparkles, tone: 'teal' },
  clothing: { icon: Shirt, tone: 'lavender' },
  baby_supplies: { icon: Baby, tone: 'blush' },
  food: { icon: Apple, tone: 'sage' },
  household: { icon: Home, tone: 'gold' },
  emergency_kits: { icon: ShieldCheck, tone: 'rose' },
}
