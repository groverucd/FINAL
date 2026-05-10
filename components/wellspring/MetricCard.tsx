'use client'

import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { AnimatedCounter } from './AnimatedCounter'

type Tone = 'blush' | 'teal' | 'lavender' | 'gold' | 'sage' | 'rose'

const toneStyles: Record<Tone, { bg: string; ring: string; icon: string }> = {
  blush: {
    bg: 'oklch(0.94 0.05 25 / 0.6)',
    ring: 'oklch(0.78 0.07 25 / 0.45)',
    icon: 'oklch(0.5 0.11 25)',
  },
  teal: {
    bg: 'oklch(0.94 0.05 195 / 0.6)',
    ring: 'oklch(0.78 0.07 195 / 0.45)',
    icon: 'oklch(0.45 0.1 195)',
  },
  lavender: {
    bg: 'oklch(0.94 0.04 290 / 0.6)',
    ring: 'oklch(0.78 0.06 290 / 0.45)',
    icon: 'oklch(0.45 0.09 290)',
  },
  gold: {
    bg: 'oklch(0.95 0.05 70 / 0.6)',
    ring: 'oklch(0.78 0.08 70 / 0.45)',
    icon: 'oklch(0.48 0.1 70)',
  },
  sage: {
    bg: 'oklch(0.94 0.05 160 / 0.6)',
    ring: 'oklch(0.78 0.06 160 / 0.45)',
    icon: 'oklch(0.42 0.08 160)',
  },
  rose: {
    bg: 'oklch(0.94 0.05 20 / 0.6)',
    ring: 'oklch(0.78 0.08 20 / 0.45)',
    icon: 'oklch(0.5 0.12 20)',
  },
}

interface MetricCardProps {
  label: string
  value: number
  detail?: string
  icon: LucideIcon
  tone?: Tone
  delta?: string
  delay?: number
}

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = 'blush',
  delta,
  delay = 0,
}: MetricCardProps) {
  const t = toneStyles[tone]
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut', delay }}
      whileHover={{ y: -3 }}
      className="glass-strong group relative overflow-hidden rounded-3xl p-5"
    >
      {/* tone wash */}
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background: `radial-gradient(80% 100% at 0% 0%, ${t.bg}, transparent 60%)`,
        }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-semibold tabular-nums text-foreground">
              <AnimatedCounter value={value} duration={1.4} />
            </span>
            {delta && (
              <span className="text-sm font-medium text-success">
                {delta}
              </span>
            )}
          </div>
          {detail && (
            <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
          )}
        </div>
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border"
          style={{
            background: t.bg,
            borderColor: t.ring,
            color: t.icon,
          }}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  )
}
