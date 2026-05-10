'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Package,
  HandHeart,
  Boxes,
  CircleAlert,
  ChartNoAxesCombined,
} from 'lucide-react'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { careTimeline as mockCareTimeline, type CareEvent } from '@/lib/wellspring-data'
import { getIntake, getOutbound } from '@/lib/api'
import { useToast } from './Toast'

const typeMap: Record<
  CareEvent['type'],
  {
    Icon: typeof Package
    bg: string
    color: string
  }
> = {
  donation: {
    Icon: Package,
    bg: 'oklch(0.94 0.05 25 / 0.7)',
    color: 'oklch(0.48 0.1 25)',
  },
  distribution: {
    Icon: HandHeart,
    bg: 'oklch(0.94 0.04 290 / 0.7)',
    color: 'oklch(0.42 0.09 290)',
  },
  inventory: {
    Icon: Boxes,
    bg: 'oklch(0.94 0.05 195 / 0.7)',
    color: 'oklch(0.4 0.09 195)',
  },
  alert: {
    Icon: CircleAlert,
    bg: 'oklch(0.95 0.05 60 / 0.7)',
    color: 'oklch(0.45 0.11 60)',
  },
  report: {
    Icon: ChartNoAxesCombined,
    bg: 'oklch(0.94 0.05 160 / 0.7)',
    color: 'oklch(0.4 0.08 160)',
  },
}

function relativeTime(iso: string): string {
  try {
    return formatDistanceToNow(parseISO(iso), { addSuffix: true })
  } catch {
    return 'recently'
  }
}

function buildLiveEvents(intakeRows: unknown[], outboundRows: unknown[]): CareEvent[] {
  type Sortable = CareEvent & { _t: number }

  const intake: Sortable[] = (intakeRows as Array<Record<string, unknown>>).map((row) => {
    const qty = Number(row.quantity ?? 0)
    const name = String(row.item_name ?? row.display_name ?? 'items')
    const person = String(row.intake_person ?? 'Team')
    const donor = row.donor_name ? String(row.donor_name) : ''
    const id = String(row.id ?? '')
    const created = String(row.created_at ?? '')
    return {
      id: `in-${id}`,
      type: 'donation' as const,
      title: `${qty} ${name} received`,
      detail: donor ? `Logged by ${person} · Donor: ${donor}` : `Logged by ${person}`,
      time: relativeTime(created),
      _t: new Date(created).getTime(),
    }
  })

  const outbound: Sortable[] = (outboundRows as Array<Record<string, unknown>>).map((row) => {
    const qty = Number(row.quantity ?? 0)
    const name = String(row.item_name ?? row.display_name ?? 'items')
    const person = String(row.outbound_person ?? 'Team')
    const recipient = row.recipient_id ? String(row.recipient_id) : ''
    const id = String(row.id ?? '')
    const created = String(row.created_at ?? '')
    return {
      id: `out-${id}`,
      type: 'distribution' as const,
      title: `${qty} ${name} distributed`,
      detail: recipient
        ? `Logged by ${person} · ${recipient}`
        : `Logged by ${person}`,
      time: relativeTime(created),
      _t: new Date(created).getTime(),
    }
  })

  return [...intake, ...outbound]
    .sort((a, b) => b._t - a._t)
    .slice(0, 14)
    .map(({ _t, ...event }) => event)
}

interface CareTimelineProps {
  /** If omitted, timeline loads merged intake/outbound from the API (shared for all users). */
  events?: CareEvent[]
  title?: string
}

export function CareTimeline({
  events: eventsProp,
  title = 'Care Timeline',
}: CareTimelineProps) {
  const { toast } = useToast()
  const [liveEvents, setLiveEvents] = useState<CareEvent[]>([])
  const [loading, setLoading] = useState(eventsProp === undefined)

  useEffect(() => {
    if (eventsProp !== undefined) {
      setLoading(false)
      return
    }

    let active = true
    async function load() {
      try {
        const [intakeRows, outboundRows] = await Promise.all([
          getIntake(24),
          getOutbound(24),
        ])
        if (!active) return
        const built = buildLiveEvents(intakeRows as unknown[], outboundRows as unknown[])
        setLiveEvents(built.length > 0 ? built : mockCareTimeline)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to load timeline.'
        toast(message, 'error')
        setLiveEvents(mockCareTimeline)
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()
    const interval = setInterval(() => void load(), 45000)

    return () => {
      active = false
      clearInterval(interval)
    }
  }, [eventsProp, toast])

  const events = eventsProp ?? liveEvents

  return (
    <section className="glass-strong relative flex h-full flex-col overflow-hidden rounded-3xl p-5 sm:p-6">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">
            Recent intake and distribution from everyone using this workspace.
          </p>
        </div>
        <span className="glass inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: 'oklch(0.62 0.1 160)' }}
          />
          {loading ? 'Loading…' : 'Live'}
        </span>
      </header>

      <div className="relative flex-1">
        <div
          className="absolute left-[1.05rem] top-1 bottom-1 w-px"
          style={{
            background:
              'linear-gradient(to bottom, transparent, oklch(0.85 0.05 290 / 0.7), oklch(0.85 0.05 25 / 0.6), transparent)',
          }}
        />

        <ul className="space-y-3">
          {events.length === 0 && !loading ? (
            <li className="text-sm text-muted-foreground">
              No activity yet. Log intake or distribution to populate this timeline.
            </li>
          ) : (
            events.map((e, i) => {
              const cfg = typeMap[e.type]
              const Icon = cfg.Icon
              return (
                <motion.li
                  key={e.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.05 + i * 0.06,
                    ease: 'easeOut',
                  }}
                  className="relative flex items-start gap-3 pl-0"
                >
                  <div
                    className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/60 backdrop-blur-md"
                    style={{ background: cfg.bg, color: cfg.color }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-medium text-foreground">
                        {e.title}
                      </p>
                      <span className="shrink-0 text-[11px] text-muted-foreground">{e.time}</span>
                    </div>
                    {e.detail ? (
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {e.detail}
                      </p>
                    ) : null}
                  </div>
                </motion.li>
              )
            })
          )}
        </ul>
      </div>
    </section>
  )
}
