'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LoadingScreen } from '@/components/wellspring/LoadingScreen'
import { NameCapture } from '@/components/wellspring/NameCapture'
import { UserProvider } from '@/components/wellspring/UserContext'
import { ToastProvider } from '@/components/wellspring/Toast'
import { FlowBackground } from '@/components/wellspring/FlowBackground'
import { ProductHero } from '@/components/wellspring/ProductHero'
import { FlowOfCareSection } from '@/components/wellspring/FlowOfCareSection'
import { ProductWorkspace } from '@/components/wellspring/ProductWorkspace'
import { MissionFooter } from '@/components/wellspring/MissionFooter'

type Stage = 'loading' | 'name' | 'app'

export default function Page() {
  const [stage, setStage] = useState<Stage>('loading')
  const workspaceRef = useRef<HTMLDivElement | null>(null)

  function scrollToWorkspace() {
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <UserProvider>
      <ToastProvider>
        <AnimatePresence mode="wait">
          {stage === 'loading' && (
            <LoadingScreen key="loading" onComplete={() => setStage('name')} />
          )}
          {stage === 'name' && (
            <NameCapture key="name" onComplete={() => setStage('app')} />
          )}
          {stage === 'app' && (
            <motion.div
              key="app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="relative min-h-screen"
            >
              <FlowBackground />
              <main className="relative z-10">
                <ProductHero onScrollToWorkspace={scrollToWorkspace} />
                <FlowOfCareSection />
                <ProductWorkspace ref={workspaceRef} />
                <MissionFooter />
              </main>
            </motion.div>
          )}
        </AnimatePresence>
      </ToastProvider>
    </UserProvider>
  )
}
