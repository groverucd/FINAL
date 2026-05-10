'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HandHeart, Minus, Plus, ShieldCheck } from 'lucide-react'
import { useToast } from '../Toast'
import { useUser } from '../UserContext'
import { ImpactReceipt, type ImpactReceiptData } from '../ImpactReceipt'
import { createOutbound, getCategories, getOutbound } from '@/lib/api'

export function DistributionTab() {
  const { displayName } = useUser()
  const { toast } = useToast()

  const [categoryKey, setCategoryKey] = useState('hygiene')
  const [categories, setCategories] = useState<Array<{ name: string; display_name: string }>>([])
  const [distributionTrail, setDistributionTrail] = useState<
    Array<{ id: string; label: string; target: string; staff: string; time: string }>
  >([])
  const [item, setItem] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [recipient, setRecipient] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<{ item?: string }>({})
  const [submitting, setSubmitting] = useState(false)
  const [receipt, setReceipt] = useState<ImpactReceiptData | null>(null)

  useEffect(() => {
    let active = true
    async function loadData() {
      try {
        const [categoryRows, outboundRows] = await Promise.all([getCategories(), getOutbound(10)])
        if (!active) return
        setCategories(categoryRows)
        if (categoryRows.length > 0) {
          setCategoryKey((prev) =>
            categoryRows.some((category) => category.name === prev) ? prev : categoryRows[0].name,
          )
        }
        setDistributionTrail(
          (outboundRows as Array<Record<string, unknown>>).map((row) => ({
            id: String(row.id),
            label: `${row.quantity as number} ${String(row.item_name ?? row.display_name ?? 'items')}`,
            target: String(row.recipient_id ?? 'Community support'),
            staff: String(row.outbound_person ?? 'Demo User'),
            time: 'recently',
          })),
        )
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to load distribution data.'
        toast(message, 'error')
      }
    }
    void loadData()
    return () => {
      active = false
    }
  }, [toast])

  const selectedCategory = useMemo(
    () => categories.find((category) => category.name === categoryKey) ?? categories[0],
    [categories, categoryKey],
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const nextErrors: typeof errors = {}
    if (!item.trim()) nextErrors.item = 'Add a short item label.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      await createOutbound({
        category: categoryKey,
        item_name: item.trim(),
        quantity,
        recipient_id: recipient.trim() || undefined,
        outbound_person: displayName || 'Demo User',
        notes: notes.trim() || undefined,
      })
      setReceipt({
        id: String(Date.now()),
        category: selectedCategory?.display_name ?? 'Category',
        item: item.trim(),
        quantity,
        loggedBy: displayName,
      })
      toast('Distribution recorded with care.', 'sparkle')
      const outboundRows = await getOutbound(10)
      setDistributionTrail(
        (outboundRows as Array<Record<string, unknown>>).map((row) => ({
          id: String(row.id),
          label: `${row.quantity as number} ${String(row.item_name ?? row.display_name ?? 'items')}`,
          target: String(row.recipient_id ?? 'Community support'),
          staff: String(row.outbound_person ?? 'Demo User'),
          time: 'recently',
        })),
      )
      setItem('')
      setQuantity(1)
      setRecipient('')
      setNotes('')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save distribution.'
      toast(message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <form
        onSubmit={handleSubmit}
        className="glass-strong relative flex flex-col gap-5 overflow-hidden rounded-3xl p-5 sm:p-6 lg:col-span-2"
        noValidate
      >
        <header>
          <h3 className="text-lg font-semibold text-foreground">
            Record distribution
          </h3>
          <p className="text-sm text-muted-foreground">
            Track items as they leave inventory and reach the community.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Category</label>
            <div className="relative">
              <select
                value={categoryKey}
                onChange={(e) => setCategoryKey(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-border bg-background/70 px-3.5 py-2.5 pr-9 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/40"
              >
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.display_name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Item */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Item</label>
            <input
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="What is going out?"
              className="w-full rounded-2xl border border-border bg-background/70 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
            {errors.item && (
              <span className="text-[11px] text-destructive">{errors.item}</span>
            )}
          </div>

          {/* Quantity stepper */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Quantity</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="glass flex h-10 w-10 items-center justify-center rounded-2xl text-foreground transition active:scale-95"
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="glass flex h-10 flex-1 items-center justify-center rounded-2xl text-base font-semibold tabular-nums text-foreground">
                {quantity}
              </div>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="glass flex h-10 w-10 items-center justify-center rounded-2xl text-foreground transition active:scale-95"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Recipient */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">
              Recipient / Case ID
            </label>
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Optional"
              className="w-full rounded-2xl border border-border bg-background/70 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3 w-3" />
              Recipient identifiers can stay anonymous.
            </span>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-xs font-medium text-foreground">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Anything important for the team?"
              className="w-full resize-none rounded-2xl border border-border bg-background/70 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
        </div>

        <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-muted-foreground">
            Distributed by{' '}
            <span className="font-medium text-foreground">{displayName}</span>
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-70"
          >
            <HandHeart className="h-4 w-4" />
            Record Distribution
          </button>
        </div>
      </form>

      {/* side: trail or receipt */}
      <aside className="flex flex-col gap-4">
        <AnimatePresence mode="wait">
          {receipt && (
            <motion.div
              key={receipt.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <ImpactReceipt data={receipt} />
            </motion.div>
          )}
        </AnimatePresence>

        <section className="glass-strong relative flex flex-col overflow-hidden rounded-3xl p-5">
          <header className="mb-3">
            <h3 className="text-base font-semibold text-foreground">
              Distribution Trail
            </h3>
            <p className="text-xs text-muted-foreground">
              Recent items that reached the community.
            </p>
          </header>

          <ul className="flex flex-col gap-2.5">
            {distributionTrail.map((d, i) => (
              <motion.li
                key={d.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.06, duration: 0.4 }}
                className="flex items-start justify-between gap-3 rounded-2xl bg-background/40 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {d.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {d.label.split(' ').slice(-1)[0] === 'coats'
                      ? '\u2192'
                      : '\u2192'}{' '}
                    {d.target} &middot; {d.staff}
                  </p>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {d.time}
                </span>
              </motion.li>
            ))}
          </ul>
        </section>
      </aside>
    </div>
  )
}
