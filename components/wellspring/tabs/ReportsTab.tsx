'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { jsPDF } from 'jspdf'
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
import { GlassCard } from '@/components/wellspring/GlassCard'
import { Reveal } from '@/components/wellspring/Reveal'
import { useToast } from '@/components/wellspring/Toast'
import { useWorkspaceNav } from '@/components/wellspring/WorkspaceNavContext'
import {
  getLowInventory,
  getRecommendations,
  getSummary,
} from '@/lib/api'

const PALETTE = [
  'oklch(0.78 0.09 195)',
  'oklch(0.84 0.07 25)',
  'oklch(0.82 0.08 290)',
  'oklch(0.86 0.08 75)',
  'oklch(0.82 0.08 145)',
  'oklch(0.80 0.10 25)',
]

type RecommendationRow = {
  id: string
  category: string
  priority: 'High' | 'Medium' | 'Low'
  action: string
  reason: string
}

function priorityTone(priority: 'High' | 'Medium' | 'Low') {
  if (priority === 'High') return 'bg-rose/40 text-foreground'
  if (priority === 'Medium') return 'bg-gold/50 text-foreground'
  return 'bg-sage/45 text-foreground'
}

type SummaryRow = {
  category: string
  display_name: string
  intake_total: number
  outbound_total: number
}

type LowAlert = { key: string; label: string; status: 'critical' | 'low' }

function buildWeeklyNarrative(summary: SummaryRow[], lowAlerts: LowAlert[]): string {
  const totalIn = summary.reduce((s, r) => s + r.intake_total, 0)
  const totalOut = summary.reduce((s, r) => s + r.outbound_total, 0)

  const parts: string[] = []

  if (totalIn === 0 && totalOut === 0) {
    parts.push(
      'No intake or distribution was recorded in the last 7 days, so demand for specific categories cannot be inferred from movement yet.',
    )
  } else {
    parts.push(
      `In the last 7 days, ${totalIn} unit${totalIn === 1 ? '' : 's'} were received and ${totalOut} unit${totalOut === 1 ? '' : 's'} were distributed.`,
    )
    const topOut = [...summary].sort((a, b) => b.outbound_total - a.outbound_total)[0]
    if (topOut && topOut.outbound_total > 0) {
      parts.push(
        `Most went out under ${topOut.display_name} (${topOut.outbound_total} unit${topOut.outbound_total === 1 ? '' : 's'}).`,
      )
    }
    const topIn = [...summary].sort((a, b) => b.intake_total - a.intake_total)[0]
    if (topIn && topIn.intake_total > 0 && topOut && topIn.category !== topOut.category) {
      parts.push(`Largest intake: ${topIn.display_name} (${topIn.intake_total}).`)
    }
  }

  if (lowAlerts.length > 0) {
    const critical = lowAlerts.filter((a) => a.status === 'critical').map((a) => a.label)
    const low = lowAlerts.filter((a) => a.status === 'low').map((a) => a.label)
    const pieces: string[] = []
    if (critical.length) pieces.push(`${critical.join(', ')} ${critical.length === 1 ? 'is' : 'are'} below threshold (critical)`)
    if (low.length) pieces.push(`${low.join(', ')} ${low.length === 1 ? 'is' : 'are'} low`)
    parts.push(`Current shelf: ${pieces.join('; ')}.`)
  } else {
    parts.push('All categories are at or above their stock thresholds right now.')
  }

  return parts.join(' ')
}

function normalizeCategorySlug(value: string): string {
  const lowered = value.toLowerCase().trim()
  if (lowered.includes('baby')) return 'baby_supplies'
  if (lowered.includes('emergency')) return 'emergency_kits'
  if (lowered.includes('household')) return 'household'
  if (lowered.includes('hygiene')) return 'hygiene'
  if (lowered.includes('clothing')) return 'clothing'
  if (lowered.includes('food')) return 'food'
  return lowered.replace(/\s+/g, '_')
}

export function ReportsTab() {
  const { toast } = useToast()
  const { applyRecommendationToIntake, focusInventoryByStatus } = useWorkspaceNav()

  const [weeklySummaryText, setWeeklySummaryText] = useState('Loading weekly summary...')
  const [donationsByCategory, setDonationsByCategory] = useState<Array<{ category: string; value: number }>>([])
  const [lowStockAlerts, setLowStockAlerts] = useState<Array<{ key: string; label: string; status: 'critical' | 'low' }>>([])
  const [recommendations, setRecommendations] = useState<RecommendationRow[]>([])
  const [summaryRows, setSummaryRows] = useState<SummaryRow[]>([])

  const totalWeekly = useMemo(
    () => summaryRows.reduce((sum, row) => sum + row.outbound_total, 0),
    [summaryRows],
  )

  const distributionByCategory = useMemo(
    () => summaryRows.map((row) => ({ day: row.display_name, items: row.outbound_total })),
    [summaryRows],
  )

  useEffect(() => {
    let active = true
    async function loadReports() {
      try {
        const [lowRows, recRows, summary] = await Promise.all([
          getLowInventory(),
          getRecommendations(),
          getSummary(7),
        ])
        if (!active) return
        const alerts = lowRows.map((row) => ({
          key: row.category,
          label: row.display_name,
          status: row.status,
        }))
        setLowStockAlerts(alerts)
        setWeeklySummaryText(buildWeeklyNarrative(summary, alerts))
        setDonationsByCategory(
          summary.map((row) => ({ category: row.display_name, value: row.intake_total })),
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
    try {
      const doc = new jsPDF()
      const now = new Date()
      let y = 20

      doc.setFontSize(16)
      doc.text('Wellspring Flow Weekly Report', 14, y)
      y += 8
      doc.setFontSize(11)
      doc.text(`Generated: ${now.toLocaleString()}`, 14, y)
      y += 10

      const summaryLines = doc.splitTextToSize(weeklySummaryText, 180)
      doc.setFontSize(12)
      doc.text('Summary', 14, y)
      y += 6
      doc.setFontSize(10)
      doc.text(summaryLines, 14, y)
      y += summaryLines.length * 5 + 6

      doc.setFontSize(12)
      doc.text('Category totals (last 7 days)', 14, y)
      y += 6
      doc.setFontSize(10)

      const rowsToExport = summaryRows.map((row) => ({
        category: row.display_name,
        intake_total: row.intake_total,
        outbound_total: row.outbound_total,
      }))

      rowsToExport.forEach((row) => {
        if (y > 275) {
          doc.addPage()
          y = 20
        }
        const net = row.intake_total - row.outbound_total
        doc.text(`${row.category}: intake ${row.intake_total}, outbound ${row.outbound_total}, net ${net}`, 14, y)
        y += 6
      })

      if (lowStockAlerts.length > 0) {
        y += 4
        if (y > 275) {
          doc.addPage()
          y = 20
        }
        doc.setFontSize(12)
        doc.text('Low stock alerts', 14, y)
        y += 6
        doc.setFontSize(10)
        lowStockAlerts.forEach((alert) => {
          if (y > 275) {
            doc.addPage()
            y = 20
          }
          doc.text(`${alert.label}: ${alert.status}`, 14, y)
          y += 6
        })
      }

      doc.save(`wellspring-report-${now.toISOString().slice(0, 10)}.pdf`)
      toast('Weekly report exported as PDF.', 'success')
    } catch {
      toast('Could not generate PDF. Please try again.', 'error')
    }
  }

  function handleApply(recommendation: RecommendationRow) {
    const slug = normalizeCategorySlug(recommendation.category)
    applyRecommendationToIntake(slug)
    if (recommendation.priority === 'High') focusInventoryByStatus('critical')
    toast(`Moved to Intake with ${slug.replace(/_/g, ' ')} preselected.`, 'success')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Reveal className="lg:col-span-3">
        <GlassCard strong className="p-6 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lavender/55 text-foreground">
                <Sparkles className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Weekly summary</p>
                <h3 className="mt-1 text-balance font-serif text-2xl font-medium text-foreground">This week in care</h3>
              </div>
            </div>
            <button type="button" onClick={handleExport} className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-sm transition hover:opacity-90">
              <FileDown className="h-4 w-4" aria-hidden />
              Export PDF
            </button>
          </div>
          <p className="mt-4 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground">{weeklySummaryText}</p>
        </GlassCard>
      </Reveal>

      <Reveal className="lg:col-span-2" delay={0.05}>
        <GlassCard strong className="p-6">
          <div className="mb-4 flex items-baseline justify-between">
            <h3 className="font-serif text-xl font-medium text-foreground">Donations by category</h3>
            <span className="text-xs text-muted-foreground">Intake logged (7 days)</span>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={donationsByCategory} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barCategoryGap={18}>
                <CartesianGrid stroke="oklch(0.85 0.02 70 / 0.6)" strokeDasharray="3 4" vertical={false} />
                <XAxis dataKey="category" tickLine={false} axisLine={false} tick={{ fill: 'oklch(0.45 0.02 70)', fontSize: 12 }} interval={0} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: 'oklch(0.55 0.02 70)', fontSize: 11 }} />
                <Tooltip cursor={{ fill: 'oklch(0.92 0.05 290 / 0.35)' }} contentStyle={{ background: 'oklch(0.99 0.005 70 / 0.95)', border: '1px solid oklch(0.88 0.02 70)', borderRadius: 14, fontSize: 12, color: 'oklch(0.25 0.02 70)' }} />
                <Bar dataKey="value" radius={[10, 10, 6, 6]}>
                  {donationsByCategory.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </Reveal>

      <Reveal delay={0.1}>
        <GlassCard strong className="flex h-full flex-col p-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-foreground" aria-hidden />
            <h3 className="font-serif text-xl font-medium text-foreground">Low-stock alerts</h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Categories that may need attention this week.</p>
          <ul className="mt-4 space-y-3">
            {lowStockAlerts.map((alert) => (
              <li key={alert.key} className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 px-4 py-3">
                <span className="text-sm font-medium text-foreground">{alert.label}</span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${alert.status === 'critical' ? 'bg-rose/45 text-foreground' : 'bg-gold/50 text-foreground'}`}>
                  {alert.status === 'critical' ? 'Critical' : 'Low'}
                </span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </Reveal>

      <Reveal className="lg:col-span-2" delay={0.12}>
        <GlassCard strong className="p-6">
          <div className="mb-4 flex items-baseline justify-between">
            <h3 className="font-serif text-xl font-medium text-foreground">Distribution by category (7d)</h3>
            <span className="text-xs text-muted-foreground">{totalWeekly} items distributed</span>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={distributionByCategory} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="distArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.78 0.09 195)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="oklch(0.78 0.09 195)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(0.85 0.02 70 / 0.6)" strokeDasharray="3 4" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: 'oklch(0.45 0.02 70)', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: 'oklch(0.55 0.02 70)', fontSize: 11 }} />
                <Tooltip cursor={{ stroke: 'oklch(0.78 0.09 195)', strokeWidth: 1 }} contentStyle={{ background: 'oklch(0.99 0.005 70 / 0.95)', border: '1px solid oklch(0.88 0.02 70)', borderRadius: 14, fontSize: 12, color: 'oklch(0.25 0.02 70)' }} />
                <Area type="monotone" dataKey="items" stroke="oklch(0.55 0.1 195)" strokeWidth={2.4} fill="url(#distArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </Reveal>

      <Reveal delay={0.15}>
        <GlassCard strong className="flex h-full flex-col p-6">
          <h3 className="font-serif text-xl font-medium text-foreground">Recommended actions</h3>
          <p className="mt-1 text-sm text-muted-foreground">Suggested next steps based on this week.</p>
          <ul className="mt-4 flex-1 space-y-3">
            {recommendations.slice(0, 4).map((r, i) => (
              <motion.li key={r.id} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.4, delay: i * 0.04 }} className="rounded-2xl border border-border/70 bg-background/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{r.category}</span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${priorityTone(r.priority)}`}>{r.priority}</span>
                    </div>
                    <p className="mt-1 text-sm text-foreground/85">{r.action}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{r.reason}</p>
                  </div>
                  <button type="button" onClick={() => handleApply(r)} className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-foreground hover:text-background">
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
