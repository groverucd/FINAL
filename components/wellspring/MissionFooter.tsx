'use client'

import { motion } from 'framer-motion'
import { HandHeart } from 'lucide-react'

export function MissionFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mx-auto mt-10 w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8"
    >
      <div className="glass relative overflow-hidden rounded-3xl px-5 py-5 sm:px-7">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(closest-side, oklch(0.92 0.05 25 / 0.55), transparent 70%)',
          }}
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{
                background: 'oklch(0.94 0.05 25 / 0.7)',
                color: 'oklch(0.5 0.11 25)',
              }}
            >
              <HandHeart className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Built for women&apos;s centers and care teams.
              </p>
              <p className="text-xs text-muted-foreground sm:max-w-md">
                Less time chasing spreadsheets. More time supporting families.
                Every donation gets a clear path.
              </p>
            </div>
          </div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            GoodsFlow &middot; Mock data &middot; v1
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
