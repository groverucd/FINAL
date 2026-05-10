'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import {
  Sparkles,
  HandHeart,
  Package,
  Droplets,
  Boxes,
  HeartHandshake,
} from 'lucide-react'

type Accent = 'overview' | 'intake' | 'inventory' | 'distribution' | 'reports'

const accentMap: Record<Accent, { a: string; b: string; c: string }> = {
  overview: {
    a: 'oklch(0.92 0.05 25 / 0.55)',
    b: 'oklch(0.92 0.05 195 / 0.55)',
    c: 'oklch(0.94 0.04 290 / 0.45)',
  },
  intake: {
    a: 'oklch(0.93 0.06 35 / 0.6)',
    b: 'oklch(0.93 0.05 20 / 0.55)',
    c: 'oklch(0.95 0.04 70 / 0.45)',
  },
  inventory: {
    a: 'oklch(0.93 0.05 195 / 0.6)',
    b: 'oklch(0.92 0.05 160 / 0.55)',
    c: 'oklch(0.95 0.04 220 / 0.4)',
  },
  distribution: {
    a: 'oklch(0.93 0.05 290 / 0.6)',
    b: 'oklch(0.93 0.05 20 / 0.55)',
    c: 'oklch(0.95 0.04 320 / 0.45)',
  },
  reports: {
    a: 'oklch(0.94 0.06 70 / 0.6)',
    b: 'oklch(0.93 0.05 290 / 0.5)',
    c: 'oklch(0.95 0.04 50 / 0.45)',
  },
}

interface FlowBackgroundProps {
  accent?: Accent
}

const driftIcons = [HandHeart, Package, Droplets, Sparkles, Boxes, HeartHandshake]

export function FlowBackground({ accent = 'overview' }: FlowBackgroundProps) {
  const colors = accentMap[accent]

  // Stable per-mount random seeds for drifting icons
  const particles = useMemo(
    () =>
      driftIcons.map((Icon, i) => ({
        Icon,
        left: 8 + ((i * 17) % 84), // spread across width
        top: 10 + ((i * 23) % 70),
        delay: (i % 6) * 0.8,
        duration: 16 + (i % 4) * 4,
      })),
    [],
  )

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* base warm cream wash */}
      <div className="absolute inset-0 bg-background" />

      {/* gradient mesh that subtly shifts with tab accent */}
      <motion.div
        key={accent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(60% 55% at 18% 20%, ${colors.a} 0%, transparent 60%),
            radial-gradient(55% 50% at 82% 28%, ${colors.b} 0%, transparent 65%),
            radial-gradient(70% 60% at 50% 110%, ${colors.c} 0%, transparent 65%)
          `,
        }}
      />

      {/* large floating glass orbs */}
      <FloatingOrb
        size={520}
        top="-8%"
        left="-6%"
        color="oklch(0.94 0.05 25 / 0.6)"
        delay={0}
      />
      <FloatingOrb
        size={440}
        top="6%"
        right="-8%"
        color="oklch(0.94 0.05 290 / 0.55)"
        delay={3}
      />
      <FloatingOrb
        size={620}
        bottom="-12%"
        left="20%"
        color="oklch(0.94 0.05 195 / 0.45)"
        delay={5}
      />
      <FloatingOrb
        size={360}
        bottom="6%"
        right="6%"
        color="oklch(0.94 0.06 70 / 0.45)"
        delay={2}
      />

      {/* curved flow line: donation -> inventory -> distribution -> impact */}
      <svg
        className="absolute inset-x-0 top-[28%] h-40 w-full"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.78 0.07 25)" stopOpacity="0.6" />
            <stop offset="50%" stopColor="oklch(0.78 0.07 195)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="oklch(0.78 0.08 290)" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <motion.path
          d="M -40 120 C 240 30 400 200 600 110 S 980 30 1240 120"
          fill="none"
          stroke="url(#flowGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="6 14"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -200 }}
          transition={{ duration: 14, ease: 'linear', repeat: Infinity }}
          style={{ opacity: 0.55 }}
        />
      </svg>

      {/* drifting donation icons */}
      {particles.map(({ Icon, left, top, delay, duration }, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${left}%`, top: `${top}%` }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 0.55, 0.55, 0],
            y: [0, -28, -42, -60],
            x: [0, 12, -8, 18],
          }}
          transition={{
            duration,
            ease: 'easeInOut',
            repeat: Infinity,
            delay,
          }}
        >
          <div className="glass flex h-9 w-9 items-center justify-center rounded-full text-foreground/45">
            <Icon className="h-4 w-4" />
          </div>
        </motion.div>
      ))}

      {/* subtle film grain via radial */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, oklch(0.3 0.05 30) 1px, transparent 0)',
          backgroundSize: '4px 4px',
        }}
      />
    </div>
  )
}

function FloatingOrb({
  size,
  top,
  bottom,
  left,
  right,
  color,
  delay,
}: {
  size: number
  top?: string
  bottom?: string
  left?: string
  right?: string
  color: string
  delay: number
}) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl"
      style={{
        width: size,
        height: size,
        top,
        bottom,
        left,
        right,
        background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`,
      }}
      animate={{
        x: [0, 24, -12, 0],
        y: [0, -18, 14, 0],
        scale: [1, 1.04, 0.98, 1],
      }}
      transition={{
        duration: 22,
        ease: 'easeInOut',
        repeat: Infinity,
        delay,
      }}
    />
  )
}
