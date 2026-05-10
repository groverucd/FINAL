'use client'

import { useEffect, useId, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ImagePlus,
  ChevronDown,
  Sparkles,
  Package,
  Check,
} from 'lucide-react'
import { conditions, type Condition } from '@/lib/wellspring-data'
import { useToast } from '../Toast'
import { useUser } from '../UserContext'
import { createIntake, getCategories, getInventory, type ApiInventoryItem } from '@/lib/api'

interface IntakeTabProps {
  onAdded?: (event: {
    categoryKey: string
    item: string
    quantity: number
  }) => void
}

const trackedFields = [
  'Category',
  'Quantity',
  'Condition',
  'Time logged',
  'Notes',
]

export function IntakeTab({ onAdded }: IntakeTabProps) {
  const { displayName } = useUser()
  const { toast } = useToast()
  const formId = useId()

  const [categoryKey, setCategoryKey] = useState('hygiene')
  const [categories, setCategories] = useState<Array<{ name: string; display_name: string }>>([])
  const [inventory, setInventory] = useState<ApiInventoryItem[]>([])
  const [item, setItem] = useState('')
  const [quantity, setQuantity] = useState('')
  const [condition, setCondition] = useState<Condition>('New')
  const [donor, setDonor] = useState('')
  const [notes, setNotes] = useState('')
  const [photoName, setPhotoName] = useState<string | null>(null)
  const [errors, setErrors] = useState<{ item?: string; quantity?: string }>({})
  const [submitting, setSubmitting] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [loadingMeta, setLoadingMeta] = useState(true)

  useEffect(() => {
    let active = true
    async function loadMeta() {
      try {
        const [categoryRows, inventoryRows] = await Promise.all([getCategories(), getInventory()])
        if (!active) return
        setCategories(categoryRows)
        setInventory(inventoryRows)
        if (categoryRows.length > 0) {
          setCategoryKey((prev) =>
            categoryRows.some((category) => category.name === prev) ? prev : categoryRows[0].name,
          )
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to load intake categories.'
        toast(message, 'error')
      } finally {
        if (active) setLoadingMeta(false)
      }
    }
    void loadMeta()
    return () => {
      active = false
    }
  }, [toast])

  const selectedCategory = useMemo(
    () => categories.find((category) => category.name === categoryKey) ?? categories[0],
    [categories, categoryKey],
  )
  const selectedInventory = useMemo(
    () => inventory.find((item) => item.category === categoryKey),
    [inventory, categoryKey],
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const nextErrors: typeof errors = {}
    if (!item.trim()) nextErrors.item = 'Add a short item name.'
    const qty = parseInt(quantity, 10)
    if (!quantity.trim() || isNaN(qty) || qty <= 0) {
      nextErrors.quantity = 'Enter a quantity of at least 1.'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    setShowParticles(true)
    try {
      await createIntake({
        category: categoryKey,
        item_name: item.trim(),
        quantity: qty,
        condition,
        donor_name: donor.trim() || undefined,
        intake_person: displayName || 'Demo User',
        notes: notes.trim() || undefined,
      })

      onAdded?.({ categoryKey, item: item.trim(), quantity: qty })
      toast('Donation added to the flow.', 'sparkle')
      const inventoryRows = await getInventory()
      setInventory(inventoryRows)
      setItem('')
      setQuantity('')
      setNotes('')
      setDonor('')
      setPhotoName(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save intake.'
      toast(message, 'error')
    } finally {
      setSubmitting(false)
      setTimeout(() => setShowParticles(false), 1200)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      {/* form card */}
      <form
        id={formId}
        onSubmit={handleSubmit}
        className="glass-strong relative flex flex-col gap-5 overflow-hidden rounded-3xl p-5 sm:p-6 lg:col-span-2"
        noValidate
      >
        {/* care particles */}
        <AnimatePresence>
          {showParticles && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute right-6 top-6 z-10"
            >
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{ y: 0, x: 0, opacity: 0, scale: 0.4 }}
                  animate={{
                    y: -50 - i * 8,
                    x: (i - 1.5) * 14,
                    opacity: [0, 1, 0],
                    scale: [0.4, 1, 0.7],
                  }}
                  transition={{ duration: 0.9, delay: i * 0.07, ease: 'easeOut' }}
                >
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-full"
                    style={{
                      background: 'oklch(0.94 0.05 25 / 0.8)',
                      color: 'oklch(0.5 0.11 25)',
                    }}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <header>
          <h3 className="text-lg font-semibold text-foreground">
            Log a donation
          </h3>
          <p className="text-sm text-muted-foreground">
            Capture incoming items before details get lost.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Category */}
          <Field label="Category">
            <NativeSelect
              value={categoryKey}
              onChange={setCategoryKey}
            >
              {categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.display_name}
                </option>
              ))}
            </NativeSelect>
          </Field>

          {/* Item */}
          <Field
            label="Item name"
            error={errors.item}
            hint={'Short label \u2014 e.g. winter coats, hygiene kit'}
          >
            <Input
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="What was donated?"
            />
          </Field>

          {/* Quantity */}
          <Field label="Quantity" error={errors.quantity}>
            <Input
              type="number"
              inputMode="numeric"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
            />
          </Field>

          {/* Condition */}
          <Field label="Condition">
            <NativeSelect
              value={condition}
              onChange={(v) => setCondition(v as Condition)}
            >
              {conditions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </NativeSelect>
          </Field>

          {/* Donor */}
          <Field label="Donor name (optional)" className="sm:col-span-2">
            <Input
              value={donor}
              onChange={(e) => setDonor(e.target.value)}
              placeholder="Who brought this in?"
            />
          </Field>

          {/* Notes */}
          <Field label="Notes (optional)" className="sm:col-span-2">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Anything the team should know?"
              className="w-full resize-none rounded-2xl border border-border bg-background/70 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </Field>

          {/* Photo dropzone (compact) */}
          <Field label="Photo (optional)" className="sm:col-span-2">
            <label className="glass flex cursor-pointer items-center gap-3 rounded-2xl px-3.5 py-3 transition-colors hover:bg-muted/40">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{
                  background: 'oklch(0.94 0.05 195 / 0.6)',
                  color: 'oklch(0.45 0.1 195)',
                }}
              >
                <ImagePlus className="h-4 w-4" />
              </span>
              <span className="flex-1 text-sm">
                {photoName ? (
                  <span className="text-foreground">{photoName}</span>
                ) : (
                  <span className="text-muted-foreground">
                    Add a quick photo
                  </span>
                )}
              </span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) =>
                  setPhotoName(e.target.files?.[0]?.name ?? null)
                }
              />
            </label>
          </Field>
        </div>

        <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-muted-foreground">
            Logged by <span className="font-medium text-foreground">{displayName}</span>
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-70"
          >
            {submitting ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                {'Adding\u2026'}
              </>
            ) : (
              <>
                <Package className="h-4 w-4" />
                Add to Inventory
              </>
            )}
          </button>
        </div>
      </form>

      {/* side card */}
      <aside className="glass-strong relative overflow-hidden rounded-3xl p-5 sm:p-6">
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(closest-side, oklch(0.92 0.06 25 / 0.55), transparent 70%)',
          }}
        />
        <header className="relative">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            What gets tracked
          </p>
          <h4 className="mt-1 text-base font-semibold text-foreground">
            Every entry, every detail
          </h4>
        </header>

        <ul className="relative mt-4 space-y-2">
          {trackedFields.map((f) => (
            <li
              key={f}
              className="flex items-center gap-2 rounded-xl bg-background/40 px-3 py-2 text-sm text-foreground"
            >
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full"
                style={{
                  background: 'oklch(0.94 0.05 160 / 0.7)',
                  color: 'oklch(0.42 0.08 160)',
                }}
              >
                <Check className="h-3 w-3" />
              </span>
              {f}
            </li>
          ))}
        </ul>

        <div className="relative mt-5 rounded-2xl border border-border/60 bg-background/50 p-3">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Logging into
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {selectedCategory?.display_name ?? 'Category'}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {loadingMeta
              ? 'Loading current stock...'
              : `Currently ${selectedInventory?.quantity ?? 0} of ${selectedInventory?.threshold ?? 0} on shelf.`}
          </p>
        </div>
      </aside>
    </div>
  )
}

/* ---- helpers ---- */

function Field({
  label,
  hint,
  error,
  className,
  children,
}: {
  label: string
  hint?: string
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={['flex flex-col gap-1.5', className].filter(Boolean).join(' ')}>
      <label className="text-xs font-medium text-foreground">{label}</label>
      {children}
      {error ? (
        <span className="text-[11px] text-destructive">{error}</span>
      ) : hint ? (
        <span className="text-[11px] text-muted-foreground">{hint}</span>
      ) : null}
    </div>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-2xl border border-border bg-background/70 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/40"
    />
  )
}

function NativeSelect({
  value,
  onChange,
  children,
}: {
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-2xl border border-border bg-background/70 px-3.5 py-2.5 pr-9 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/40"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}
