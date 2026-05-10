'use client'

import { motion } from 'framer-motion'
import type { InventoryStatus } from '@/lib/wellspring-data'

const statusStyles: Record<
  InventoryStatus,
  { label: string; bg: string; border: string; text: string; dot: string; pulse: boolean }
> = {
  healthy: {
    label: 'Healthy',
    bg: 'oklch(0.96 0.04 160 / 0.65)',
    border: 'oklch(0.78 0.06 160 / 0.5)',
    text: 'oklch(0.34 0.07 160)',
    dot: 'oklch(0.62 0.1 160)',
    pulse: false,
  },
  watch: {
    label: 'Watch',
    bg: 'oklch(0.96 0.04 290 / 0.65)',
    border: 'oklch(0.78 0.06 290 / 0.45)',
    text: 'oklch(0.36 0.08 290)',
    dot: 'oklch(0.62 0.1 290)',
    pulse: false,
  },
  low: {
    label: 'Low',
    bg: 'oklch(0.96 0.05 60 / 0.65)',
    border: 'oklch(0.78 0.08 60 / 0.5)',
    text: 'oklch(0.4 0.1 60)',
    dot: 'oklch(0.66 0.12 60)',
    pulse: true,
  },
  critical: {
    label: 'Critical',
    bg: 'oklch(0.96 0.05 25 / 0.7)',
    border: 'oklch(0.78 0.09 25 / 0.5)',
    text: 'oklch(0.42 0.13 25)',
    dot: 'oklch(0.62 0.14 25)',
    pulse: true,
  },
}

interface StatusChipProps {
  status: InventoryStatus
  size?: 'sm' | 'md'
}

export function StatusChip({ status, size = 'md' }: StatusChipProps) {
  const s = statusStyles[status]
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${padding}`}
      style={{
        background: s.bg,
        borderColor: s.border,
        color: s.text,
      }}
    >
      <span className="relative flex h-2 w-2">
        {s.pulse && (
          <motion.span
            className="absolute inline-flex h-full w-full rounded-full"
            style={{ background: s.dot }}
            animate={{ scale: [1, 2.2], opacity: [0.55, 0] }}
            transition={{ duration: 1.8, ease: 'easeOut', repeat: Infinity }}
          />
        )}
        <span
          className="relative inline-flex h-2 w-2 rounded-full"
          style={{ background: s.dot }}
        />
      </span>
      {s.label}
    </span>
  )
}
