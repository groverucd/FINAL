'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type Tone = 'blush' | 'lavender' | 'teal' | 'gold' | 'sage' | 'rose' | 'none'

const toneClass: Record<Tone, string> = {
  blush: 'from-secondary/55 to-secondary/15',
  lavender: 'from-accent/45 to-accent/10',
  teal: 'from-primary/20 to-primary/5',
  gold: 'from-gold/45 to-gold/10',
  sage: 'from-success/25 to-success/5',
  rose: 'from-secondary/60 to-gold/15',
  none: '',
}

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  strong?: boolean
  tone?: Tone
  hoverable?: boolean
  children?: React.ReactNode
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  function GlassCard(
    { strong, tone = 'none', hoverable = true, className, children, ...rest },
    ref
  ) {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverable ? { y: -4 } : undefined}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        className={cn(
          strong ? 'glass-strong' : 'glass',
          'relative overflow-hidden rounded-3xl',
          className
        )}
        {...rest}
      >
        {tone !== 'none' && (
          <div
            className={cn(
              'pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br opacity-70 blur-3xl',
              toneClass[tone]
            )}
          />
        )}
        <div className="relative">{children}</div>
      </motion.div>
    )
  }
)
