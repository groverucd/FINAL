'use client'

import { Boxes, Package, HandHeart, CircleAlert } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { MetricCard } from '../MetricCard'
import { CareTimeline } from '../CareTimeline'
import { NeedRadar } from '../NeedRadar'
import { ImpactStrip } from '../ImpactStrip'
import { getInventory, getLowInventory, getSummary } from '@/lib/api'
import { useToast } from '../Toast'

export function OverviewTab() {
  const { toast } = useToast()
  const [inventoryTotal, setInventoryTotal] = useState(0)
  const [donatedWeek, setDonatedWeek] = useState(0)
  const [distributedWeek, setDistributedWeek] = useState(0)
  const [lowStockCategories, setLowStockCategories] = useState(0)

  useEffect(() => {
    let active = true
    async function loadOverview() {
      try {
        const [inventoryRows, summaryRows, lowRows] = await Promise.all([
          getInventory(),
          getSummary(7),
          getLowInventory(),
        ])
        if (!active) return
        setInventoryTotal(inventoryRows.reduce((sum, row) => sum + row.quantity, 0))
        setDonatedWeek(summaryRows.reduce((sum, row) => sum + row.intake_total, 0))
        setDistributedWeek(summaryRows.reduce((sum, row) => sum + row.outbound_total, 0))
        setLowStockCategories(lowRows.length)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to load overview metrics.'
        toast(message, 'error')
      }
    }
    void loadOverview()
    return () => {
      active = false
    }
  }, [toast])

  const donatedDelta = useMemo(() => (distributedWeek === 0 ? 0 : Math.round((donatedWeek / distributedWeek) * 100)), [donatedWeek, distributedWeek])

  return (
    <div className="flex flex-col gap-5">
      {/* metric row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Current Inventory"
          value={inventoryTotal}
          detail="6 categories tracked"
          icon={Boxes}
          tone="teal"
          delay={0}
        />
        <MetricCard
          label="Donated This Week"
          value={donatedWeek}
          detail="From volunteer drop-offs"
          icon={Package}
          tone="blush"
          delta={`+${donatedDelta}%`}
          delay={0.05}
        />
        <MetricCard
          label="Distributed This Week"
          value={distributedWeek}
          detail="From outbound logs"
          icon={HandHeart}
          tone="lavender"
          delay={0.1}
        />
        <MetricCard
          label="Needs Attention"
          value={lowStockCategories}
          detail="Low-stock categories"
          icon={CircleAlert}
          tone="gold"
          delay={0.15}
        />
      </div>

      {/* second row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <CareTimeline />
        </div>
        <div className="lg:col-span-2">
          <NeedRadar />
        </div>
      </div>

      {/* third row */}
      <ImpactStrip />
    </div>
  )
}
