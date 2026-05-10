'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { categories } from '@/lib/wellspring-data'

const statusToTint: Record<
  string,
  { dot: string; ring: string; pulse: boolean; label: string }
> = {
  healthy: {
    dot: 'oklch(0.62 0.1 160)',
    ring: 'oklch(0.78 0.07 160 / 0.4)',
    pulse: false,
    label: 'Healthy',
  },
  watch: {
    dot: 'oklch(0.62 0.1 290)',
    ring: 'oklch(0.78 0.06 290 / 0.4)',
    pulse: false,
    label: 'Watch',
  },
  low: {
    dot: 'oklch(0.66 0.12 60)',
    ring: 'oklch(0.78 0.08 60 / 0.5)',
    pulse: true,
    label: 'Low',
  },
  critical: {
    dot: 'oklch(0.62 0.14 25)',
    ring: 'oklch(0.78 0.09 25 / 0.55)',
    pulse: true,
    label: 'Critical',
  },
}

/**
 * Compact circular "Needs Radar". Categories are placed around an orbit ring,
 * sized by urgency. Critical/low pulse gently. Hover/focus shows the
 * recommendation.
 */
export function NeedRadar() {
  const [active, setActive] = useState<string | null>(null)

  // Sort by urgency descending so high priority dots appear in stable order
  const items = useMemo(
    () => [...categories].sort((a, b) => b.urgencyScore - a.urgencyScore),
    [],
  )

  const radius = 92
  const center = 110

  const activeItem = items.find((i) => i.key === active) ?? null

  return (
    <section className="glass-strong relative flex h-full flex-col overflow-hidden rounded-3xl p-5 sm:p-6">
      <header className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Needs Radar</h3>
          <p className="text-xs text-muted-foreground">
            What needs attention across the shelves.
          </p>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 sm:flex-row sm:items-stretch">
        {/* Radar */}
        <div className="relative" style={{ width: 220, height: 220 }}>
          {/* concentric rings */}
          {[0.55, 0.75, 0.95].map((s, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 rounded-full border"
              style={{
                width: 220 * s,
                height: 220 * s,
                marginLeft: -(220 * s) / 2,
                marginTop: -(220 * s) / 2,
                borderColor: 'oklch(0.85 0.04 290 / 0.4)',
              }}
            />
          ))}

          {/* center wellspring dot */}
          <motion.div
            className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
            style={{
              background:
                'radial-gradient(circle at 30% 30%, oklch(0.96 0.04 25 / 0.95), oklch(0.88 0.06 290 / 0.7))',
              boxShadow:
                '0 6px 18px -6px oklch(0.6 0.08 30 / 0.35), inset 0 1px 0 oklch(1 0 0 / 0.6)',
            }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground/70">
              care
            </span>
          </motion.div>

          {/* category dots */}
          {items.map((c, i) => {
            const angle = (i / items.length) * Math.PI * 2 - Math.PI / 2
            const dist = radius * (0.55 + (c.urgencyScore / 10) * 0.45)
            const x = center + Math.cos(angle) * dist
            const y = center + Math.sin(angle) * dist
            const tint = statusToTint[c.status]
            const isActive = active === c.key
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setActive(isActive ? null : c.key)}
                onMouseEnter={() => setActive(c.key)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(c.key)}
                onBlur={() => setActive(null)}
                aria-label={`${c.label}: ${tint.label} \u00b7 score ${c.urgencyScore}`}
                className="group absolute -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none"
                style={{ left: x, top: y }}
              >
                <span className="relative flex items-center justify-center">
                  {tint.pulse && (
                    <motion.span
                      className="absolute h-9 w-9 rounded-full"
                      style={{ background: tint.dot, opacity: 0.4 }}
                      animate={{ scale: [1, 1.7], opacity: [0.4, 0] }}
                      transition={{ duration: 2, ease: 'easeOut', repeat: Infinity }}
                    />
                  )}
                  <span
                    className="relative h-4 w-4 rounded-full ring-4 transition-transform group-hover:scale-110"
                    style={{
                      background: tint.dot,
                      // ring color via box-shadow (since ringColor uses CSS color)
                      boxShadow: `0 0 0 6px ${tint.ring}`,
                    }}
                  />
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass absolute -top-7 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-medium text-foreground"
                    >
                      {c.label}
                    </motion.span>
                  )}
                </span>
              </button>
            )
          })}
        </div>

        {/* List + active recommendation */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <ul className="grid grid-cols-1 gap-1.5">
            {items.map((c) => {
              const tint = statusToTint[c.status]
              return (
                <li
                  key={c.key}
                  className="flex items-center justify-between gap-3 rounded-xl px-2 py-1.5 hover:bg-muted/40"
                  onMouseEnter={() => setActive(c.key)}
                  onMouseLeave={() => setActive(null)}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: tint.dot }}
                    />
                    <span className="truncate text-xs font-medium text-foreground">
                      {c.label}
                    </span>
                  </div>
                  <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                    {c.urgencyScore.toFixed(1)}
                  </span>
                </li>
              )
            })}
          </ul>

          <div className="glass mt-auto rounded-2xl p-3">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Recommendation
            </p>
            <p className="mt-1 text-xs text-foreground">
              {activeItem
                ? activeItem.recommendation
                : 'Hover a dot to see the recommended next action.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
