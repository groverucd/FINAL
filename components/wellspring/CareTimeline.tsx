'use client'

import { motion } from 'framer-motion'
import {
  Package,
  HandHeart,
  Boxes,
  CircleAlert,
  ChartNoAxesCombined,
} from 'lucide-react'
import { careTimeline, type CareEvent } from '@/lib/wellspring-data'

const typeMap: Record<
  CareEvent['type'],
  {
    Icon: typeof Package
    bg: string
    color: string
  }
> = {
  donation: {
    Icon: Package,
    bg: 'oklch(0.94 0.05 25 / 0.7)',
    color: 'oklch(0.48 0.1 25)',
  },
  distribution: {
    Icon: HandHeart,
    bg: 'oklch(0.94 0.04 290 / 0.7)',
    color: 'oklch(0.42 0.09 290)',
  },
  inventory: {
    Icon: Boxes,
    bg: 'oklch(0.94 0.05 195 / 0.7)',
    color: 'oklch(0.4 0.09 195)',
  },
  alert: {
    Icon: CircleAlert,
    bg: 'oklch(0.95 0.05 60 / 0.7)',
    color: 'oklch(0.45 0.11 60)',
  },
  report: {
    Icon: ChartNoAxesCombined,
    bg: 'oklch(0.94 0.05 160 / 0.7)',
    color: 'oklch(0.4 0.08 160)',
  },
}

interface CareTimelineProps {
  events?: CareEvent[]
  title?: string
}

export function CareTimeline({
  events = careTimeline,
  title = 'Care Timeline',
}: CareTimelineProps) {
  return (
    <section className="glass-strong relative flex h-full flex-col overflow-hidden rounded-3xl p-5 sm:p-6">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">
            What just happened in the flow of care.
          </p>
        </div>
        <span className="glass inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: 'oklch(0.62 0.1 160)' }}
          />
          Live mock
        </span>
      </header>

      <div className="relative flex-1">
        {/* soft glowing vertical line */}
        <div
          className="absolute left-[1.05rem] top-1 bottom-1 w-px"
          style={{
            background:
              'linear-gradient(to bottom, transparent, oklch(0.85 0.05 290 / 0.7), oklch(0.85 0.05 25 / 0.6), transparent)',
          }}
        />

        <ul className="space-y-3">
          {events.map((e, i) => {
            const cfg = typeMap[e.type]
            const Icon = cfg.Icon
            return (
              <motion.li
                key={e.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.45,
                  delay: 0.05 + i * 0.06,
                  ease: 'easeOut',
                }}
                className="relative flex items-start gap-3 pl-0"
              >
                <div
                  className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/60 backdrop-blur-md"
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium text-foreground">
                      {e.title}
                    </p>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {e.time}
                    </span>
                  </div>
                  {e.detail && (
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {e.detail}
                    </p>
                  )}
                </div>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
