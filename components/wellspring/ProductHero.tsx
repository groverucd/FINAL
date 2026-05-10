'use client'

import { motion } from 'framer-motion'
import { ArrowRight, HandHeart } from 'lucide-react'
import { useUser } from '@/components/wellspring/UserContext'
import { TrustBadges } from '@/components/wellspring/TrustBadges'
import { WellspringOrb } from '@/components/wellspring/WellspringOrb'

interface ProductHeroProps {
  onScrollToWorkspace: () => void
}

export function ProductHero({ onScrollToWorkspace }: ProductHeroProps) {
  const { name } = useUser()
  const greeting = name ? `Welcome, ${name}.` : 'Welcome.'

  return (
    <section className="relative isolate overflow-hidden px-5 pt-28 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-10 pb-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:pb-24">
        {/* Copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-foreground"
          >
            <HandHeart className="h-3.5 w-3.5" aria-hidden />
            <span>Wellspring Flow</span>
            <span className="text-muted-foreground">/ Donation Care Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-balance font-serif text-5xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
          >
            {greeting}
            <br />
            <span className="text-foreground/85">A calmer way to track</span>
            <br />
            <span className="text-foreground">care.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-crimson mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
          >
            Log donations, watch your inventory, record distributions, and see the
            impact your team is creating. Designed for the women&apos;s center, made for
            volunteers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <button
              type="button"
              onClick={onScrollToWorkspace}
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background shadow-sm transition hover:opacity-90"
            >
              Open the workspace
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
            </button>
            <a
              href="#flow-of-care"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-6 py-3 text-sm font-medium text-foreground backdrop-blur transition hover:bg-background"
            >
              Explore the Flow
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="mt-10"
          >
            <TrustBadges />
          </motion.div>
        </div>

        {/* Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center justify-center"
        >
          <WellspringOrb size={420} />
        </motion.div>
      </div>
    </section>
  )
}
