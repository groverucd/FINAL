'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, type LucideIcon } from 'lucide-react'

type Tone = 'blush' | 'teal' | 'lavender' | 'gold' | 'sage' | 'rose'

const toneStyles: Record<Tone, { bg: string; ring: string; icon: string }> = {
  blush: {
    bg: 'oklch(0.94 0.05 25 / 0.7)',
    ring: 'oklch(0.78 0.07 25 / 0.5)',
    icon: 'oklch(0.5 0.11 25)',
  },
  teal: {
    bg: 'oklch(0.94 0.05 195 / 0.7)',
    ring: 'oklch(0.78 0.07 195 / 0.5)',
    icon: 'oklch(0.45 0.1 195)',
  },
  lavender: {
    bg: 'oklch(0.94 0.04 290 / 0.7)',
    ring: 'oklch(0.78 0.06 290 / 0.5)',
    icon: 'oklch(0.45 0.09 290)',
  },
  gold: {
    bg: 'oklch(0.95 0.05 70 / 0.7)',
    ring: 'oklch(0.78 0.08 70 / 0.5)',
    icon: 'oklch(0.48 0.1 70)',
  },
  sage: {
    bg: 'oklch(0.94 0.05 160 / 0.7)',
    ring: 'oklch(0.78 0.06 160 / 0.5)',
    icon: 'oklch(0.42 0.08 160)',
  },
  rose: {
    bg: 'oklch(0.94 0.05 20 / 0.7)',
    ring: 'oklch(0.78 0.08 20 / 0.5)',
    icon: 'oklch(0.5 0.12 20)',
  },
}

interface ActionCardProps {
  icon: LucideIcon
  title: string
  description: string
  tone?: Tone
  onClick?: () => void
  delay?: number
}

export function ActionCard({
  icon: Icon,
  title,
  description,
  tone = 'blush',
  onClick,
  delay = 0,
}: ActionCardProps) {
  const t = toneStyles[tone]
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut', delay }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.985 }}
      className="glass-strong group relative flex w-full flex-col items-start gap-4 overflow-hidden rounded-3xl p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-90 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(80% 100% at 0% 0%, ${t.bg}, transparent 60%)`,
        }}
      />
      <div className="relative flex w-full items-center justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl border"
          style={{ background: t.bg, borderColor: t.ring, color: t.icon }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <ArrowUpRight
          className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden
        />
      </div>
      <div className="relative">
        <div className="text-base font-semibold text-foreground">{title}</div>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </motion.button>
  )
}
