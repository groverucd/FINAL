'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Info, Sparkles } from 'lucide-react'

type ToastTone = 'success' | 'info' | 'sparkle'

interface ToastItem {
  id: number
  message: string
  tone: ToastTone
}

interface ToastContextValue {
  toast: (message: string, tone?: ToastTone) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const toast = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = Date.now() + Math.random()
    setItems((prev) => [...prev, { id, message, tone }])
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id))
    }, 2800)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[120] flex flex-col items-center gap-2 px-4 sm:bottom-8">
        <AnimatePresence>
          {items.map((t) => {
            const Icon =
              t.tone === 'info' ? Info : t.tone === 'sparkle' ? Sparkles : Check
            const ringClass =
              t.tone === 'info'
                ? 'bg-accent/30 text-accent-foreground'
                : t.tone === 'sparkle'
                  ? 'bg-secondary/40 text-secondary-foreground'
                  : 'bg-success/20 text-success'
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                className="glass-strong pointer-events-auto flex items-center gap-3 rounded-full px-4 py-2.5 shadow-lg"
              >
                <span
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${ringClass}`}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
                <span className="text-sm font-medium text-foreground">{t.message}</span>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    return { toast: () => {} }
  }
  return ctx
}
