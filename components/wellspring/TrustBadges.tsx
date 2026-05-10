'use client'

import { motion } from 'framer-motion'
import { trustBadges } from '@/lib/wellspring-data'

interface TrustBadgesProps {
  className?: string
}

export function TrustBadges({ className }: TrustBadgesProps) {
  return (
    <div className={['flex flex-wrap gap-2', className].filter(Boolean).join(' ')}>
      {trustBadges.map((badge, i) => (
        <motion.span
          key={badge}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.04, duration: 0.4 }}
          className="glass inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
        >
          {badge}
        </motion.span>
      ))}
    </div>
  )
}
