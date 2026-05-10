'use client'

import { useRef, useState } from 'react'
import {
  motion,
  useScroll,
  AnimatePresence,
  useMotionValueEvent,
} from 'framer-motion'
import {
  ClipboardCheck,
  Boxes,
  HeartHandshake,
  HandHeart,
  Droplets,
  Shirt,
  Baby,
  Apple,
  Home,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type StageId = 'intake' | 'inventory' | 'distribution' | 'impact'

interface FlowStage {
  id: StageId
  step: string
  title: string
  copy: string
  stat: string
  tooltip: string
  icon: React.ElementType
  nodeX: number   // % across the path (0–100)
  color: string
  bgFrom: string
  bgTo: string
}

/* ------------------------------------------------------------------ */
/*  Stage data                                                         */
/* ------------------------------------------------------------------ */

const stages: FlowStage[] = [
  {
    id: 'intake',
    step: 'Step 01',
    title: 'Donations come in.',
    copy: 'Volunteers quickly log what arrived before details get lost.',
    stat: '184 logged this week',
    tooltip: 'Donations are logged before details get lost.',
    icon: ClipboardCheck,
    nodeX: 8,
    color: 'oklch(0.75 0.1 20)',
    bgFrom: 'oklch(0.92 0.06 20 / 0.55)',
    bgTo: 'oklch(0.88 0.04 290 / 0.3)',
  },
  {
    id: 'inventory',
    step: 'Step 02',
    title: 'Inventory becomes clear.',
    copy: 'Every category shows what is healthy, low, or needs attention.',
    stat: '846 items tracked',
    tooltip: 'Teams can see what is available and what is low.',
    icon: Boxes,
    nodeX: 36,
    color: 'oklch(0.62 0.1 165)',
    bgFrom: 'oklch(0.9 0.05 195 / 0.5)',
    bgTo: 'oklch(0.92 0.06 70 / 0.3)',
  },
  {
    id: 'distribution',
    step: 'Step 03',
    title: 'Items go out with care.',
    copy: 'Distributions are recorded clearly while keeping recipient details private.',
    stat: '312 distributed',
    tooltip: 'Items going out are recorded with privacy in mind.',
    icon: HeartHandshake,
    nodeX: 64,
    color: 'oklch(0.72 0.08 290)',
    bgFrom: 'oklch(0.88 0.06 290 / 0.5)',
    bgTo: 'oklch(0.92 0.06 20 / 0.3)',
  },
  {
    id: 'impact',
    step: 'Step 04',
    title: 'Impact becomes visible.',
    copy: 'Reports show how essentials reached women and families.',
    stat: '124 families supported',
    tooltip: 'Reports turn daily work into clear community impact.',
    icon: HandHeart,
    nodeX: 92,
    color: 'oklch(0.78 0.11 60)',
    bgFrom: 'oklch(0.93 0.07 60 / 0.55)',
    bgTo: 'oklch(0.92 0.05 20 / 0.35)',
  },
]

/* ------------------------------------------------------------------ */
/*  Inventory shelf data                                               */
/* ------------------------------------------------------------------ */

const shelfItems = [
  { label: 'Hygiene',   qty: 186, max: 220, status: 'low'     },
  { label: 'Clothing',  qty: 248, max: 248, status: 'healthy'  },
  { label: 'Baby',      qty: 64,  max: 100, status: 'critical' },
  { label: 'Food',      qty: 172, max: 200, status: 'watch'    },
  { label: 'Emergency', qty: 58,  max: 80,  status: 'low'      },
] as const

const shelfColors: Record<string, string> = {
  healthy:  'oklch(0.62 0.1 165)',
  low:      'oklch(0.78 0.11 60)',
  watch:    'oklch(0.78 0.09 70)',
  critical: 'oklch(0.65 0.15 25)',
}

/* ------------------------------------------------------------------ */
/*  Impact chip data                                                   */
/* ------------------------------------------------------------------ */

const impactItems = [
  { label: '86 hygiene kits'      },
  { label: '42 baby supply packs' },
  { label: '57 clothing items'    },
  { label: '29 emergency kits'    },
]

/* ------------------------------------------------------------------ */
/*  Donation particle configs                                          */
/* ------------------------------------------------------------------ */

const particleConfigs = [
  { delay: 0,   duration: 5.2, x: [-20, 60, 140],  y: [10, -20, 5],   icon: Droplets   },
  { delay: 0.5, duration: 6.1, x: [20, 100, 180],  y: [-10, 15, -8],  icon: Shirt      },
  { delay: 1.1, duration: 4.8, x: [-10, 80, 160],  y: [20, -5, 18],   icon: Baby       },
  { delay: 1.7, duration: 5.5, x: [10, 90, 170],   y: [-15, 22, -12], icon: Apple      },
  { delay: 0.8, duration: 6.4, x: [30, 120, 200],  y: [8, -18, 10],   icon: Home       },
  { delay: 2.0, duration: 5.0, x: [-5, 70, 150],   y: [15, -10, 20],  icon: ShieldCheck},
]

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function stageIndexFromProgress(p: number): number {
  if (p < 0.25) return 0
  if (p < 0.5)  return 1
  if (p < 0.75) return 2
  return 3
}

/* ------------------------------------------------------------------ */
/*  StageProgressIndicator                                             */
/* ------------------------------------------------------------------ */

function StageProgressIndicator({ activeIndex }: { activeIndex: number }) {
  const labels = ['Intake', 'Inventory', 'Distribution', 'Impact']
  return (
    <div className="flex items-center gap-2" role="list" aria-label="Flow stages">
      {labels.map((label, i) => (
        <div key={label} className="flex items-center gap-2" role="listitem">
          <div className="flex flex-col items-center gap-1">
            <motion.div
              animate={{ width: i === activeIndex ? 28 : 8, opacity: i === activeIndex ? 1 : 0.35 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-2 rounded-full"
              style={{ background: i === activeIndex ? stages[i].color : 'oklch(0.7 0.02 260)' }}
            />
            <motion.span
              animate={{ opacity: i === activeIndex ? 1 : 0.4 }}
              className="text-[10px] font-medium tracking-wide text-foreground"
              style={{ lineHeight: 1 }}
            >
              {label}
            </motion.span>
          </div>
          {i < labels.length - 1 && (
            <div className="mb-3 h-px w-4 rounded-full bg-border opacity-50" />
          )}
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  FlowStageText                                                      */
/* ------------------------------------------------------------------ */

function FlowStageText({ stage }: { stage: FlowStage }) {
  return (
    <motion.div
      key={stage.id}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col"
    >
      <span className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: stage.color }}>
        {stage.step}
      </span>
      <h3 className="font-serif mt-2 text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl">
        {stage.title}
      </h3>
      <p className="font-crimson mt-3 text-lg leading-relaxed text-muted-foreground">
        {stage.copy}
      </p>
      <div
        className="mt-5 inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium"
        style={{
          background: `color-mix(in oklab, ${stage.color} 12%, transparent)`,
          color: stage.color,
          border: `1px solid color-mix(in oklab, ${stage.color} 25%, transparent)`,
        }}
      >
        <stage.icon className="h-3.5 w-3.5" aria-hidden />
        {stage.stat}
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  FlowPath  — lives in its own isolated 80 px lane                  */
/* ------------------------------------------------------------------ */

function FlowPath({ progress, activeColor }: { progress: number; activeColor: string }) {
  const pathLength = Math.max(0.02, Math.min(1, progress))

  return (
    <svg
      viewBox="0 0 900 80"
      className="h-full w-full"
      aria-hidden
      preserveAspectRatio="none"
      style={{ overflow: 'visible', display: 'block' }}
    >
      <defs>
        <linearGradient id="path-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="oklch(0.75 0.1 20)"   stopOpacity="0.7" />
          <stop offset="33%"  stopColor="oklch(0.62 0.1 165)"  stopOpacity="0.8" />
          <stop offset="66%"  stopColor="oklch(0.72 0.08 290)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="oklch(0.78 0.11 60)"  stopOpacity="0.7" />
        </linearGradient>
        <filter id="path-glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* dim track (always visible) */}
      <path
        d="M 72 40 C 200 10, 300 70, 450 40 C 600 10, 700 70, 828 40"
        fill="none"
        stroke="oklch(0.6 0.03 260 / 0.22)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* active filled portion */}
      <motion.path
        d="M 72 40 C 200 10, 300 70, 450 40 C 600 10, 700 70, 828 40"
        fill="none"
        stroke="url(#path-grad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        filter="url(#path-glow)"
        style={{ pathLength, strokeDasharray: '1', strokeDashoffset: '0' }}
      />

      {/* animated dots */}
      {[0.18, 0.42, 0.61, 0.79].map((pos, i) => (
        <motion.circle
          key={i}
          r="4"
          fill={activeColor}
          initial={{ opacity: 0.1 }}
          animate={{ opacity: pos <= pathLength ? [0.5, 0.9, 0.5] : 0.1 }}
          transition={{ duration: 1.8, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            offsetPath: "path('M 72 40 C 200 10, 300 70, 450 40 C 600 10, 700 70, 828 40')",
            offsetDistance: `${pos * 100}%`,
          } as React.CSSProperties}
        />
      ))}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  FlowNode — sits in the NODE ROW, above the path                   */
/* ------------------------------------------------------------------ */

function FlowNode({
  stage,
  isActive,
  isPast,
  containerWidth,
}: {
  stage: FlowStage
  isActive: boolean
  isPast: boolean
  containerWidth: number
}) {
  const [hovered, setHovered] = useState(false)
  // position node horizontally based on nodeX%; center the 56px circle
  const x = (stage.nodeX / 100) * containerWidth - 28

  return (
    <div
      className="absolute bottom-0 left-0 flex flex-col items-center"
      style={{ width: 56, transform: `translateX(${x}px)` }}
    >
      {/* tooltip — appears above the node */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.22 }}
            className="glass absolute bottom-full mb-2 w-44 -translate-x-1/2 left-1/2 rounded-xl px-3 py-2.5 text-center shadow-lg"
            style={{ zIndex: 50 }}
          >
            <p className="text-xs font-medium text-foreground/80">{stage.tooltip}</p>
            <p className="mt-1 text-[10px] font-semibold" style={{ color: stage.color }}>
              {stage.stat}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* active glow ring */}
      {isActive && (
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0.8, 0.45] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute rounded-full"
          style={{
            width: 56, height: 56,
            background: `radial-gradient(circle, ${stage.color} 0%, transparent 70%)`,
            filter: 'blur(8px)',
            transform: 'scale(1.7)',
            bottom: 0,
          }}
        />
      )}

      {/* node circle */}
      <motion.div
        animate={{ scale: isActive ? 1.12 : hovered ? 1.07 : 1, opacity: isPast || isActive ? 1 : 0.45 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex h-14 w-14 cursor-default items-center justify-center rounded-full"
        style={{
          background: isActive || isPast
            ? `radial-gradient(135deg at 35% 35%, oklch(0.97 0.01 60) 0%, color-mix(in oklab, ${stage.color} 28%, oklch(0.93 0.02 260)) 100%)`
            : 'oklch(0.97 0.01 60)',
          border: `1.5px solid color-mix(in oklab, ${stage.color} ${isActive ? 55 : isPast ? 35 : 20}%, oklch(0.9 0.01 70))`,
          boxShadow: isActive
            ? `0 0 0 3px color-mix(in oklab, ${stage.color} 22%, transparent), 0 8px 20px -8px color-mix(in oklab, ${stage.color} 50%, transparent)`
            : 'none',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <stage.icon
          className="h-5 w-5"
          style={{ color: isActive || isPast ? stage.color : 'oklch(0.6 0.02 260)' }}
          aria-hidden
        />
      </motion.div>

      {/* label below node */}
      <div className="mt-1.5 text-center">
        <span
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: isActive ? stage.color : 'oklch(0.55 0.02 260)' }}
        >
          {stage.id.charAt(0).toUpperCase() + stage.id.slice(1)}
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  CareOrb — animated bead that travels ALONG the path               */
/*  positioned at 50% of the PATH ROW height, left-anchored           */
/* ------------------------------------------------------------------ */

function CareOrb({ stage, pct }: { stage: FlowStage; pct: number }) {
  return (
    <motion.div
      className="pointer-events-none absolute"
      animate={{ left: `calc(${pct}% - 28px)` }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{ top: '50%', transform: 'translateY(-50%)', width: 56, height: 56 }}
    >
      {/* glow */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${stage.color} 0%, transparent 70%)`,
          filter: 'blur(12px)',
          transform: 'scale(2)',
        }}
      />
      {/* glass sphere */}
      <div
        className="absolute inset-0 flex items-center justify-center rounded-full"
        style={{
          background: `radial-gradient(135deg at 35% 35%,
            oklch(1 0 0 / 0.85) 0%,
            color-mix(in oklab, ${stage.color} 22%, oklch(0.97 0.01 60)) 50%,
            color-mix(in oklab, ${stage.color} 40%, oklch(0.92 0.03 195)) 100%)`,
          boxShadow: `
            inset 0 2px 4px oklch(1 0 0 / 0.7),
            0 6px 20px -6px color-mix(in oklab, ${stage.color} 55%, transparent)`,
          backdropFilter: 'blur(12px)',
        }}
      >
        <stage.icon className="h-6 w-6" style={{ color: stage.color, opacity: 0.9 }} aria-hidden />
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  InventoryShelfPreview — lives entirely in the DETAIL ROW          */
/* ------------------------------------------------------------------ */

function InventoryShelfPreview({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="glass w-full rounded-2xl p-4 shadow-xl"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Live Inventory
          </p>
          <div className="flex flex-col gap-2.5">
            {shelfItems.map((item, i) => {
              const pct = Math.min(100, Math.round((item.qty / item.max) * 100))
              const barColor = shelfColors[item.status]
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.35 }}
                >
                  <div className="flex items-center justify-between text-[11px] font-medium text-foreground/80">
                    <span>{item.label}</span>
                    <span style={{ color: barColor }}>{item.qty}</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-border/60">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: i * 0.09 + 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full"
                      style={{ background: barColor }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ */
/*  ImpactDetail — lives entirely in the DETAIL ROW                   */
/* ------------------------------------------------------------------ */

function ImpactDetail({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-4"
        >
          {/* central stat — standalone, not on the path */}
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center justify-center rounded-full text-center"
            style={{
              width: 120,
              height: 120,
              background: `radial-gradient(135deg at 35% 35%,
                oklch(0.98 0.01 60) 0%,
                oklch(0.94 0.06 55) 50%,
                oklch(0.88 0.09 40) 100%)`,
              boxShadow: `
                inset 0 2px 5px oklch(1 0 0 / 0.7),
                0 10px 32px -10px oklch(0.78 0.11 60 / 0.55)`,
            }}
          >
            <HandHeart className="h-7 w-7" style={{ color: 'oklch(0.55 0.12 40)' }} aria-hidden />
            <p className="mt-1 text-sm font-bold leading-tight" style={{ color: 'oklch(0.42 0.1 40)' }}>
              312 essentials
            </p>
            <p className="text-[10px] font-medium" style={{ color: 'oklch(0.55 0.07 40)' }}>
              124 families
            </p>
          </motion.div>

          {/* chip row below the orb */}
          <div className="flex flex-wrap justify-center gap-2">
            {impactItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 + 0.3, duration: 0.35 }}
                className="glass flex items-center rounded-full px-3 py-1.5 text-[11px] font-medium text-foreground/80 shadow"
              >
                {item.label}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ */
/*  DonationIconParticles                                              */
/* ------------------------------------------------------------------ */

function DonationIconParticles({ stageIndex }: { stageIndex: number }) {
  if (stageIndex > 1) return null
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {particleConfigs.map(({ delay, duration, x, y, icon: Icon }, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: `${30 + ((i * 37) % 40)}%`, left: '-2%' }}
          animate={{ x, y, opacity: [0, 0.6, 0.5, 0] }}
          transition={{ duration, delay: delay + stageIndex * 0.5, repeat: Infinity, ease: 'easeInOut', times: [0, 0.3, 0.7, 1] }}
        >
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{
              background: 'color-mix(in oklab, var(--card) 75%, transparent)',
              border: '1px solid color-mix(in oklab, var(--border) 60%, transparent)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  SectionBackground                                                  */
/* ------------------------------------------------------------------ */

function SectionBackground({ stageIndex }: { stageIndex: number }) {
  const bg = stages[stageIndex]
  return (
    <motion.div
      className="absolute inset-0 -z-10"
      animate={{
        background: `radial-gradient(60% 55% at 15% 30%, ${bg.bgFrom} 0%, transparent 65%), radial-gradient(55% 55% at 80% 70%, ${bg.bgTo} 0%, transparent 65%), var(--background)`,
      }}
      transition={{ duration: 1.1, ease: 'easeInOut' }}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Main FlowOfCareSection                                             */
/* ------------------------------------------------------------------ */

export function FlowOfCareSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const pathRowRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [pathProgress, setPathProgress] = useState(0.02)
  const [containerWidth, setContainerWidth] = useState(900)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setActiveIndex(stageIndexFromProgress(p))
    setPathProgress(Math.max(0.02, Math.min(1, p)))
    if (pathRowRef.current) {
      setContainerWidth(pathRowRef.current.offsetWidth)
    }
  })

  const activeStage = stages[activeIndex]
  // orb % keeps it centered on the active node
  const orbPct = activeStage.nodeX

  return (
    <section
      id="flow-of-care"
      ref={sectionRef}
      className="relative"
      style={{ height: '260vh' }}
      aria-label="The Flow of Care"
    >
      {/* sticky viewport */}
      <div className="sticky top-0 flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-16 sm:px-8 lg:px-12">
        <SectionBackground stageIndex={activeIndex} />

        <div className="mx-auto w-full max-w-7xl">

          {/* ── SECTION HEADER ─────────────────────────────────────── */}
          <div className="mb-10 text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
            >
              How it works
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.06 }}
              className="font-serif mt-2 text-balance text-4xl font-medium tracking-tight text-foreground sm:text-5xl"
            >
              The Flow of Care
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="font-crimson mx-auto mt-3 max-w-md text-pretty text-lg text-muted-foreground"
            >
              Every donation gets a clear path — from the front door to a family in need.
            </motion.p>
          </div>

          {/* ── MAIN GRID: text left | visual right ────────────────── */}
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:items-start">

            {/* ── LEFT: stage text ───────────────────────────────── */}
            <div className="flex flex-col gap-5 lg:pr-6">
              <StageProgressIndicator activeIndex={activeIndex} />

              <AnimatePresence mode="wait">
                <FlowStageText key={activeStage.id} stage={activeStage} />
              </AnimatePresence>

              <motion.div
                key={`callout-${activeIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-strong rounded-2xl p-4"
              >
                <p className="text-sm leading-relaxed text-foreground/70">
                  {activeIndex === 0 && 'Less time chasing what arrived. More time actually helping.'}
                  {activeIndex === 1 && 'Inventory clarity means fewer surprises on distribution day.'}
                  {activeIndex === 2 && 'Respectful records. Fast logging. Care that moves.'}
                  {activeIndex === 3 && 'Impact becomes visible — ready to share with donors and partners.'}
                </p>
              </motion.div>
            </div>

            {/* ── RIGHT: three stacked rows ──────────────────────── */}
            <div className="flex flex-col gap-0">

              {/* ROW 1: NODE ROW — nodes + labels live here, above the path */}
              {/*   height: 80px — exactly enough for the 56px circle + 18px label */}
              <div
                ref={pathRowRef}
                className="relative w-full"
                style={{ height: 80 }}
              >
                {/* donation particles float in the node row area */}
                <DonationIconParticles stageIndex={activeIndex} />

                {stages.map((s, i) => (
                  <FlowNode
                    key={s.id}
                    stage={s}
                    isActive={i === activeIndex}
                    isPast={i < activeIndex}
                    containerWidth={containerWidth}
                  />
                ))}
              </div>

              {/* ROW 2: PATH LANE — the ONLY thing here is the path and the travelling orb */}
              {/*   80px tall, isolated row, nothing else touches this */}
              <div className="relative w-full" style={{ height: 80 }}>
                {/* path fills the full row */}
                <FlowPath progress={pathProgress} activeColor={activeStage.color} />

                {/* care orb travels along path mid-height; only present for intake→distribution */}
                {activeIndex < 3 && (
                  <CareOrb stage={activeStage} pct={orbPct} />
                )}
              </div>

              {/* ROW 3: DETAIL ROW — cards/panels live here, fully below the path */}
              <div className="relative mt-6 w-full">
                <AnimatePresence mode="wait">
                  {activeIndex === 1 && (
                    <motion.div key="inventory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <InventoryShelfPreview visible />
                    </motion.div>
                  )}
                  {activeIndex === 3 && (
                    <motion.div key="impact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center">
                      <ImpactDetail visible />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* empty placeholder to keep layout stable for stages 0 and 2 */}
                {(activeIndex === 0 || activeIndex === 2) && (
                  <div style={{ minHeight: 160 }} />
                )}
              </div>
            </div>
          </div>

          {/* ── SCROLL NUDGE ────────────────────────────────────────── */}
          <motion.div
            className="mt-10 flex flex-col items-center gap-1.5"
            animate={{ opacity: activeIndex < 3 ? [0.5, 1, 0.5] : 0 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="h-8 w-px rounded-full bg-border" />
            <span className="text-xs font-medium tracking-wide text-muted-foreground">
              Scroll to explore
            </span>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
