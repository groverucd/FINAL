'use client'

import { motion } from 'framer-motion'
import { Sparkles, Baby, Shirt, ShieldCheck, type LucideIcon } from 'lucide-react'
import { impactBreakdown, impactHeadline } from '@/lib/wellspring-data'
import { AnimatedCounter } from './AnimatedCounter'

const iconFor: Record<string, LucideIcon> = {
  hygiene: Sparkles,
  baby: Baby,
  clothing: Shirt,
  emergency: ShieldCheck,
}

const toneFor: Record<string, { bg: string; color: string }> = {
  hygiene: {
    bg: 'oklch(0.94 0.05 195 / 0.7)',
    color: 'oklch(0.45 0.1 195)',
  },
  baby: {
    bg: 'oklch(0.94 0.05 25 / 0.7)',
    color: 'oklch(0.5 0.11 25)',
  },
  clothing: {
    bg: 'oklch(0.94 0.04 290 / 0.7)',
    color: 'oklch(0.45 0.09 290)',
  },
  emergency: {
    bg: 'oklch(0.94 0.05 20 / 0.7)',
    color: 'oklch(0.5 0.12 20)',
  },
}

export function ImpactStrip({ compact = false }: { compact?: boolean }) {
  return (
    <section className="glass-strong relative overflow-hidden rounded-3xl p-5 sm:p-6">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, oklch(0.92 0.05 25 / 0.6), transparent 70%)',
        }}
      />

      <header className="relative">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Community Impact
        </p>
        <h3 className="mt-1 text-balance font-serif text-xl text-foreground sm:text-2xl">
          {impactHeadline}
        </h3>
      </header>

      <div
        className={`relative mt-5 grid gap-3 ${
          compact ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'
        }`}
      >
        {impactBreakdown.map((m, i) => {
          const Icon = iconFor[m.id] ?? Sparkles
          const tone = toneFor[m.id] ?? toneFor.hygiene
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 0.5, delay: 0.05 + i * 0.06 }}
              className="glass relative flex flex-col gap-2 overflow-hidden rounded-2xl p-3"
            >
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-xl"
                  style={{ background: tone.bg, color: tone.color }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-2xl font-semibold tabular-nums text-foreground">
                  <AnimatedCounter value={m.value} duration={1.2} />
                </span>
              </div>
              <p className="text-xs font-medium text-foreground">{m.label}</p>
              {!compact && (
                <p className="text-[11px] leading-snug text-muted-foreground">
                  {m.note}
                </p>
              )}
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
