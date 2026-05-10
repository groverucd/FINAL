'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from 'recharts'
import { FileDown, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react'
import {
  weeklyDistribution,
} from '@/lib/wellspring-data'
import { GlassCard } from '@/components/wellspring/GlassCard'
import { Reveal } from '@/components/wellspring/Reveal'
import { useToast } from '@/components/wellspring/Toast'
import {
  getInventory,
  getLowInventory,
  getRecommendations,
  getSummary,
  getWeeklySummary,
} from '@/lib/api'

const PALETTE = [
  'oklch(0.78 0.09 195)', // teal
  'oklch(0.84 0.07 25)', // blush
  'oklch(0.82 0.08 290)', // lavender
  'oklch(0.86 0.08 75)', // gold
  'oklch(0.82 0.08 145)', // sage
  'oklch(0.80 0.10 25)', // rose
]

function priorityTone(priority: 'High' | 'Medium' | 'Low') {
  if (priority === 'High') return 'bg-rose/40 text-foreground'
  if (priority === 'Medium') return 'bg-gold/50 text-foreground'
  return 'bg-sage/45 text-foreground'
}

export function ReportsTab() {
  const { toast } = useToast()
  const [weeklySummaryText, setWeeklySummaryText] = useState('Loading weekly summary...')
  const [donationsByCategory, setDonationsByCategory] = useState<Array<{ category: string; value: number }>>([])
  const [lowStockAlerts, setLowStockAlerts] = useState<Array<{ key: string; label: string; status: 'critical' | 'low' }>>([])
  const [recommendations, setRecommendations] = useState<
    Array<{ id: string; category: string; priority: 'High' | 'Medium' | 'Low'; action: string; reason: string }>
  >([])
  const [summaryRows, setSummaryRows] = useState<Array<{ category: string; intake_total: number; outbound_total: number }>>([])

  const totalWeekly = useMemo(
    () =>
      summaryRows.length > 0
        ? summaryRows.reduce((sum, row) => sum + row.outbound_total, 0)
        : weeklyDistribution.reduce((sum, d) => sum + d.items, 0),
    [summaryRows],
  )

  useEffect(() => {
    let active = true
    async function loadReports() {
      try {
        const [weekly, inventoryRows, lowRows, recRows, summary] = await Promise.all([
          getWeeklySummary(),
          getInventory(),
          getLowInventory(),
          getRecommendations(),
          getSummary(7),
        ])
        if (!active) return
        setWeeklySummaryText(weekly.summary)
        setDonationsByCategory(
          inventoryRows.map((row) => ({ category: row.display_name, value: row.quantity })),
        )
        setLowStockAlerts(
          lowRows.map((row) => ({
            key: row.category,
            label: row.display_name,
            status: row.status,
          })),
        )
        setRecommendations(
          recRows.map((row, idx) => ({
            id: `${row.category}-${idx}`,
            category: row.category,
            priority: row.priority === 'high' ? 'High' : row.priority === 'medium' ? 'Medium' : 'Low',
            action: row.action,
            reason: row.reason,
          })),
        )
        setSummaryRows(summary)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to load reports.'
        toast(message, 'error')
      }
    }
    void loadReports()
    return () => {
      active = false
    }
  }, [toast])

  function handleExport() {
    toast('Weekly report exported as PDF.', 'success')
  }

  function handleApply(text: string) {
    toast(`Action queued: ${text}`, 'success')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Weekly Summary + Export */}
      <Reveal className="lg:col-span-3">
        <GlassCard strong className="p-6 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lavender/55 text-foreground">
                <Sparkles className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Weekly summary
                </p>
                <h3 className="mt-1 text-balance font-serif text-2xl font-medium text-foreground">
                  This week in care
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-sm transition hover:opacity-90"
            >
              <FileDown className="h-4 w-4" aria-hidden />
              Export PDF
            </button>
          </div>
          <p className="mt-4 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground">
            {weeklySummaryText}
          </p>
        </GlassCard>
      </Reveal>

      {/* Donations by category */}
      <Reveal className="lg:col-span-2" delay={0.05}>
        <GlassCard strong className="p-6">
          <div className="mb-4 flex items-baseline justify-between">
            <h3 className="font-serif text-xl font-medium text-foreground">
              Donations by category
            </h3>
            <span className="text-xs text-muted-foreground">Current snapshot</span>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={donationsByCategory}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                barCategoryGap={18}
              >
                <CartesianGrid stroke="oklch(0.85 0.02 70 / 0.6)" strokeDasharray="3 4" vertical={false} />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'oklch(0.45 0.02 70)', fontSize: 12 }}
                  interval={0}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'oklch(0.55 0.02 70)', fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ fill: 'oklch(0.92 0.05 290 / 0.35)' }}
                  contentStyle={{
                    background: 'oklch(0.99 0.005 70 / 0.95)',
                    border: '1px solid oklch(0.88 0.02 70)',
                    borderRadius: 14,
                    fontSize: 12,
                    color: 'oklch(0.25 0.02 70)',
                  }}
                />
                <Bar dataKey="value" radius={[10, 10, 6, 6]}>
                  {donationsByCategory.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </Reveal>

      {/* Low-stock alerts */}
      <Reveal delay={0.1}>
        <GlassCard strong className="flex h-full flex-col p-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-foreground" aria-hidden />
            <h3 className="font-serif text-xl font-medium text-foreground">
              Low-stock alerts
            </h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Categories that may need attention this week.
          </p>
          <ul className="mt-4 space-y-3">
            {lowStockAlerts.map((alert) => (
              <li
                key={alert.key}
                className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 px-4 py-3"
              >
                <span className="text-sm font-medium text-foreground">
                  {alert.label}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    alert.status === 'critical'
                      ? 'bg-rose/45 text-foreground'
                      : 'bg-gold/50 text-foreground'
                  }`}
                >
                  {alert.status === 'critical' ? 'Critical' : 'Low'}
                </span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </Reveal>

      {/* Weekly distribution trend */}
      <Reveal className="lg:col-span-2" delay={0.12}>
        <GlassCard strong className="p-6">
          <div className="mb-4 flex items-baseline justify-between">
            <h3 className="font-serif text-xl font-medium text-foreground">
              Distribution this week
            </h3>
            <span className="text-xs text-muted-foreground">
              {totalWeekly} items distributed
            </span>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={weeklyDistribution}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="distArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.78 0.09 195)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="oklch(0.78 0.09 195)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(0.85 0.02 70 / 0.6)" strokeDasharray="3 4" vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'oklch(0.45 0.02 70)', fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'oklch(0.55 0.02 70)', fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ stroke: 'oklch(0.78 0.09 195)', strokeWidth: 1 }}
                  contentStyle={{
                    background: 'oklch(0.99 0.005 70 / 0.95)',
                    border: '1px solid oklch(0.88 0.02 70)',
                    borderRadius: 14,
                    fontSize: 12,
                    color: 'oklch(0.25 0.02 70)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="items"
                  stroke="oklch(0.55 0.1 195)"
                  strokeWidth={2.4}
                  fill="url(#distArea)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </Reveal>

      {/* Recommendations */}
      <Reveal delay={0.15}>
        <GlassCard strong className="flex h-full flex-col p-6">
          <h3 className="font-serif text-xl font-medium text-foreground">
            Recommended actions
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Suggested next steps based on this week.
          </p>
          <ul className="mt-4 flex-1 space-y-3">
            {recommendations.slice(0, 4).map((r, i) => (
              <motion.li
                key={r.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="rounded-2xl border border-border/70 bg-background/60 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {r.category}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${priorityTone(
                          r.priority,
                        )}`}
                      >
                        {r.priority}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-foreground/85">{r.action}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{r.reason}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApply(r.action)}
                    className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-foreground hover:text-background"
                  >
                    Apply
                    <ArrowRight className="h-3 w-3" aria-hidden />
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        </GlassCard>
      </Reveal>
    </div>
  )
}
