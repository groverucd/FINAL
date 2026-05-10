'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { InventoryStatus, Tone } from '@/lib/wellspring-data'
import { StatusChip } from './StatusChip'

const toneStyles: Record<
  Tone,
  { bg: string; ring: string; icon: string; bar: string; glow: string }
> = {
  blush: {
    bg: 'oklch(0.94 0.05 25 / 0.7)',
    ring: 'oklch(0.78 0.07 25 / 0.5)',
    icon: 'oklch(0.5 0.11 25)',
    bar: 'oklch(0.7 0.14 25)',
    glow: 'oklch(0.92 0.06 25 / 0.55)',
  },
  teal: {
    bg: 'oklch(0.94 0.05 195 / 0.7)',
    ring: 'oklch(0.78 0.07 195 / 0.5)',
    icon: 'oklch(0.45 0.1 195)',
    bar: 'oklch(0.65 0.12 195)',
    glow: 'oklch(0.92 0.06 195 / 0.5)',
  },
  lavender: {
    bg: 'oklch(0.94 0.04 290 / 0.7)',
    ring: 'oklch(0.78 0.06 290 / 0.5)',
    icon: 'oklch(0.45 0.09 290)',
    bar: 'oklch(0.65 0.1 290)',
    glow: 'oklch(0.92 0.06 290 / 0.5)',
  },
  gold: {
    bg: 'oklch(0.95 0.05 70 / 0.7)',
    ring: 'oklch(0.78 0.08 70 / 0.5)',
    icon: 'oklch(0.48 0.1 70)',
    bar: 'oklch(0.7 0.13 70)',
    glow: 'oklch(0.92 0.06 70 / 0.55)',
  },
  sage: {
    bg: 'oklch(0.94 0.05 160 / 0.7)',
    ring: 'oklch(0.78 0.06 160 / 0.5)',
    icon: 'oklch(0.42 0.08 160)',
    bar: 'oklch(0.62 0.1 160)',
    glow: 'oklch(0.92 0.05 160 / 0.5)',
  },
  rose: {
    bg: 'oklch(0.94 0.05 20 / 0.7)',
    ring: 'oklch(0.78 0.08 20 / 0.5)',
    icon: 'oklch(0.5 0.12 20)',
    bar: 'oklch(0.68 0.14 20)',
    glow: 'oklch(0.92 0.06 20 / 0.55)',
  },
}

interface InventoryCardProps {
  category: {
    key: string
    label: string
    icon: LucideIcon
    quantity: number
    threshold: number
    status: InventoryStatus
    trend: string
    recommendation: string
    tone: Tone
  }
  delay?: number
}

export function InventoryCard({ category, delay = 0 }: InventoryCardProps) {
  const [open, setOpen] = useState(false)
  const t = toneStyles[category.tone]
  const Icon = category.icon
  const pct = Math.min(100, Math.round((category.quantity / category.threshold) * 100))
  const pulses = category.status === 'critical' || category.status === 'low'

  return (
    <motion.button
      type="button"
      onClick={() => setOpen((o) => !o)}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
      whileHover={{ y: -3 }}
      className="glass-strong group relative w-full overflow-hidden rounded-3xl p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
    >
      {/* shelf glow */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(120% 120% at 0% 0%, ${t.glow}, transparent 60%)`,
        }}
        animate={pulses ? { opacity: [0.65, 1, 0.65] } : { opacity: 1 }}
        transition={
          pulses
            ? { duration: 3.5, ease: 'easeInOut', repeat: Infinity }
            : { duration: 0.4 }
        }
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl border"
            style={{ background: t.bg, borderColor: t.ring, color: t.icon }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-semibold text-foreground">
              {category.label}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              {category.trend}
            </div>
          </div>
        </div>
        <StatusChip status={category.status} />
      </div>

      <div className="relative mt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-semibold tabular-nums text-foreground">
            {category.quantity}
          </span>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {pct}% of {category.threshold}
          </span>
        </div>

        {/* shelf fullness bar */}
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted/70">
          <motion.div
            className="h-full rounded-full"
            style={{ background: t.bar }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{
              duration: 1.1,
              delay: delay + 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="rec"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="relative overflow-hidden"
          >
            <div className="mt-4 rounded-2xl border border-border/60 bg-background/50 p-3 backdrop-blur">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Recommendation
              </p>
              <p className="mt-1 text-xs text-foreground">
                {category.recommendation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mt-3 flex items-center justify-end text-[11px] text-muted-foreground">
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </div>
    </motion.button>
  )
}
