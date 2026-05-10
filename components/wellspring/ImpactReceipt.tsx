'use client'

import { motion } from 'framer-motion'
import { Check, HandHeart } from 'lucide-react'

export interface ImpactReceiptData {
  id: string
  category: string
  item: string
  quantity: number
  loggedBy: string
}

interface ImpactReceiptProps {
  data: ImpactReceiptData
}

export function ImpactReceipt({ data }: ImpactReceiptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className="glass-strong relative overflow-hidden rounded-3xl p-5"
    >
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, oklch(0.92 0.05 290 / 0.55), transparent 70%)',
        }}
      />

      <header className="relative flex items-center gap-3">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-2xl"
          style={{
            background: 'oklch(0.94 0.05 160 / 0.7)',
            color: 'oklch(0.42 0.08 160)',
          }}
        >
          <Check className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Impact Receipt
          </p>
          <h4 className="text-sm font-semibold text-foreground">
            Distribution recorded with care
          </h4>
        </div>
      </header>

      <dl className="relative mt-4 grid grid-cols-2 gap-y-2 text-sm">
        <Row label="Item" value={data.item} />
        <Row label="Category" value={data.category} />
        <Row label="Quantity" value={String(data.quantity)} />
        <Row label="Logged by" value={data.loggedBy} />
        <Row label="Status" value="Recorded" tone="success" />
        <Row label="Added to" value="Monthly impact" />
      </dl>

      <div className="relative mt-4 flex items-center gap-2 rounded-2xl border border-border/60 bg-background/60 px-3 py-2 text-xs text-muted-foreground">
        <HandHeart className="h-3.5 w-3.5" />
        Care moves faster when information is clear.
      </div>
    </motion.div>
  )
}

function Row({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: 'success'
}) {
  return (
    <>
      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd
        className={`text-right font-medium ${
          tone === 'success' ? 'text-success' : 'text-foreground'
        }`}
      >
        {value}
      </dd>
    </>
  )
}
