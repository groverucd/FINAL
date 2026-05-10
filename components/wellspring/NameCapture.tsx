'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ArrowRight, Heart, Sparkles } from 'lucide-react'
import { useUser } from './UserContext'

interface NameCaptureProps {
  onComplete: () => void
}

export function NameCapture({ onComplete }: NameCaptureProps) {
  const { setName } = useUser()
  const [value, setValue] = useState('')
  const [welcoming, setWelcoming] = useState(false)

  function submit(useDefault: boolean) {
    const final = useDefault ? '' : value.trim()
    setName(final)
    setWelcoming(true)
    setTimeout(onComplete, 1100)
  }

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center px-4"
      aria-label="Tell us who is helping today"
    >
      {/* warm gradient + soft floating items */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 60% at 20% 25%, oklch(0.92 0.05 290 / 0.6) 0%, transparent 60%), radial-gradient(50% 50% at 80% 30%, oklch(0.92 0.07 25 / 0.55) 0%, transparent 65%), radial-gradient(60% 60% at 50% 100%, oklch(0.9 0.06 195 / 0.5) 0%, transparent 65%), oklch(0.985 0.01 70)',
        }}
      />

      {/* floating ambient items */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{
            opacity: 0.6,
            scale: 1,
            y: [0, -16, 0],
          }}
          transition={{
            opacity: { delay: 0.3 + i * 0.15, duration: 0.8 },
            scale: { delay: 0.3 + i * 0.15, duration: 0.8 },
            y: { duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 },
          }}
          style={{
            left: `${15 + i * 17}%`,
            top: `${20 + (i % 2) * 50}%`,
          }}
          className="pointer-events-none absolute"
          aria-hidden
        >
          <span className="glass flex h-9 w-9 items-center justify-center rounded-2xl">
            <Heart
              className="h-3.5 w-3.5 text-secondary-foreground"
              fill="currentColor"
              fillOpacity={0.4}
            />
          </span>
        </motion.div>
      ))}

      <AnimatePresence>
        {!welcoming ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong relative w-full max-w-xl rounded-3xl p-7 sm:p-10"
          >
            <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-secondary/60 to-gold/40 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 -bottom-20 h-56 w-56 rounded-full bg-gradient-to-br from-accent/50 to-primary/30 blur-3xl" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                <Sparkles className="h-3 w-3 text-primary" />
                Wellspring Flow
              </span>

              <h1 className="mt-5 font-serif text-3xl leading-tight tracking-tight text-balance sm:text-4xl">
                Care moves because people like you show up.
              </h1>
              <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                Who is helping the flow today?
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  submit(false)
                }}
                className="mt-7"
              >
                <label className="block">
                  <span className="sr-only">Your name</span>
                  <input
                    autoFocus
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-2xl border border-input bg-card/70 px-5 py-4 text-base outline-none transition-all placeholder:text-muted-foreground/70 focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/15"
                  />
                </label>

                <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => submit(true)}
                    className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    Continue as Friend of Wellspring
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={!value.trim()}
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background shadow-lg shadow-foreground/15 transition-shadow hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-lg"
                  >
                    Begin the Flow
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-accent shadow-xl"
            >
              <Heart
                className="h-9 w-9 text-primary-foreground"
                fill="currentColor"
                fillOpacity={0.3}
              />
            </motion.div>
            <p className="mt-6 font-serif text-3xl tracking-tight">
              Welcome to the flow.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
