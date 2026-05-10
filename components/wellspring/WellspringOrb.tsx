'use client'

import { motion } from 'framer-motion'
import { HandHeart, Sparkles, Baby, Shirt, Apple, Package } from 'lucide-react'

interface WellspringOrbProps {
  size?: number
  className?: string
  showOrbiting?: boolean
}

const orbitIcons = [Sparkles, Baby, Shirt, Apple, Package]

/**
 * Central glass orb. Soft gradient, breathing inner glow, optional orbiting
 * donation icons, subtle radial rings.
 */
export function WellspringOrb({
  size = 220,
  className,
  showOrbiting = true,
}: WellspringOrbProps) {
  const orbitRadius = size * 0.78

  return (
    <div
      className={['relative', className].filter(Boolean).join(' ')}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* outer aura */}
      <motion.div
        className="absolute inset-[-20%] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, oklch(0.92 0.06 25 / 0.65), oklch(0.92 0.06 290 / 0.45) 60%, transparent 75%)',
        }}
        animate={{ scale: [1, 1.04, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity }}
      />

      {/* radial rings */}
      {[1, 0.78, 0.6].map((scale, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border"
          style={{
            transform: `scale(${scale})`,
            borderColor: 'oklch(0.85 0.04 30 / 0.45)',
          }}
          animate={{ opacity: [0.25, 0.55, 0.25] }}
          transition={{
            duration: 4 + i,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: i * 0.4,
          }}
        />
      ))}

      {/* glass orb */}
      <motion.div
        className="absolute inset-0 rounded-full border border-border/70"
        style={{
          background:
            'radial-gradient(circle at 30% 28%, oklch(1 0 0 / 0.85), oklch(0.96 0.04 25 / 0.7) 45%, oklch(0.92 0.05 290 / 0.55))',
          boxShadow:
            '0 30px 60px -20px oklch(0.6 0.08 30 / 0.25), inset 0 1px 0 oklch(1 0 0 / 0.7), inset 0 -20px 40px oklch(0.85 0.05 290 / 0.25)',
          backdropFilter: 'blur(20px)',
        }}
        animate={{ scale: [1, 1.015, 1] }}
        transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
      />

      {/* highlight */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 0.45,
          height: size * 0.25,
          left: size * 0.18,
          top: size * 0.16,
          background:
            'radial-gradient(closest-side, oklch(1 0 0 / 0.7), transparent 70%)',
          filter: 'blur(6px)',
        }}
      />

      {/* heart icon center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ y: [0, -4, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 3.5, ease: 'easeInOut', repeat: Infinity }}
          className="flex items-center justify-center rounded-full"
          style={{
            width: size * 0.36,
            height: size * 0.36,
            background:
              'radial-gradient(circle at 30% 30%, oklch(0.99 0.01 30), oklch(0.9 0.06 25 / 0.85))',
            boxShadow:
              '0 8px 20px oklch(0.7 0.12 25 / 0.4), inset 0 1px 0 oklch(1 0 0 / 0.6)',
          }}
        >
          <HandHeart
            style={{
              width: size * 0.18,
              height: size * 0.18,
              color: 'oklch(0.55 0.13 25)',
            }}
          />
        </motion.div>
      </div>

      {/* orbiting icons */}
      {showOrbiting && (
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 36, ease: 'linear', repeat: Infinity }}
        >
          {orbitIcons.map((Icon, i) => {
            const angle = (i / orbitIcons.length) * Math.PI * 2
            const x = Math.cos(angle) * (orbitRadius / 2)
            const y = Math.sin(angle) * (orbitRadius / 2)
            return (
              <motion.div
                key={i}
                className="glass absolute left-1/2 top-1/2 flex h-8 w-8 items-center justify-center rounded-full text-foreground/70"
                style={{ x, y, marginLeft: -16, marginTop: -16 }}
                animate={{ rotate: -360 }}
                transition={{
                  duration: 36,
                  ease: 'linear',
                  repeat: Infinity,
                }}
              >
                <Icon className="h-3.5 w-3.5" />
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
