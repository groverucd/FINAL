'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Droplet, Heart, Package, Shirt, Apple, Baby, Sparkles } from 'lucide-react'
import { loadingPhrases } from '@/lib/wellspring-data'

interface LoadingScreenProps {
  onComplete: () => void
  /** ms */
  duration?: number
}

const orbitIcons = [Package, Shirt, Baby, Apple, Sparkles, Heart]

export function LoadingScreen({ onComplete, duration = 2600 }: LoadingScreenProps) {
  const [mounted, setMounted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const start = performance.now()
    let raf = 0
    const tick = () => {
      const elapsed = performance.now() - start
      const p = Math.min(1, elapsed / duration)
      setProgress(p)
      if (p < 1) raf = requestAnimationFrame(tick)
      else {
        setExiting(true)
        setTimeout(onComplete, 700)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [duration, mounted, onComplete])

  useEffect(() => {
    if (!mounted) return
    const interval = setInterval(() => {
      setPhraseIdx((i) => (i + 1) % loadingPhrases.length)
    }, 900)
    return () => clearInterval(interval)
  }, [mounted])

  if (!mounted) return null

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(8px)', scale: 1.02 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
          aria-label="Loading Wellspring Flow"
          role="status"
        >
          {/* gradient stage */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                'radial-gradient(60% 60% at 20% 25%, oklch(0.92 0.05 290 / 0.65) 0%, transparent 60%), radial-gradient(50% 50% at 80% 30%, oklch(0.92 0.07 25 / 0.6) 0%, transparent 65%), radial-gradient(60% 60% at 50% 100%, oklch(0.9 0.06 195 / 0.55) 0%, transparent 65%), oklch(0.985 0.01 70)',
            }}
          />

          {/* orbiting icons */}
          <div className="relative h-[280px] w-[280px] sm:h-[340px] sm:w-[340px]">
            {orbitIcons.map((Icon, i) => {
              const angle = (i / orbitIcons.length) * Math.PI * 2
              const r = 130
              const x = Number((Math.cos(angle) * r).toFixed(3))
              const y = Number((Math.sin(angle) * r).toFixed(3))
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.6 }}
                  style={{ left: '50%', top: '50%', x, y }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                >
                  <motion.span
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: 'easeInOut',
                    }}
                    className="glass flex h-11 w-11 items-center justify-center rounded-2xl text-foreground/70 sm:h-12 sm:w-12"
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
                  </motion.span>
                </motion.div>
              )
            })}

            {/* orbit ring */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 340 340"
            >
              <motion.circle
                cx={170}
                cy={170}
                r={130}
                fill="none"
                stroke="oklch(0.55 0.07 195 / 0.25)"
                strokeWidth={1}
                strokeDasharray="3 6"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: '170px 170px' }}
              />
            </svg>

            {/* center logo */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative">
                <motion.span
                  animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -inset-6 -z-10 rounded-full bg-gradient-to-br from-primary/40 via-secondary/40 to-accent/40 blur-2xl"
                />
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-accent shadow-xl">
                  <Droplet
                    className="h-9 w-9 text-primary-foreground"
                    strokeWidth={2.5}
                    fill="currentColor"
                    fillOpacity={0.15}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* copy + progress */}
          <div className="absolute bottom-[18%] left-1/2 w-full max-w-md -translate-x-1/2 px-6 text-center">
            <p className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl">
              Wellspring <span className="italic text-primary">Flow</span>
            </p>

            <div className="mt-5 h-[24px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={phraseIdx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45 }}
                  className="text-sm text-muted-foreground"
                >
                  {loadingPhrases[phraseIdx]}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="mx-auto mt-5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                style={{ width: `${progress * 100}%` }}
                className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-secondary"
              />
            </div>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {Math.round(progress * 100)}%
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
