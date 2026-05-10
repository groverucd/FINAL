/**
 * Centralized mock data for GoodsFlow / Wellspring Flow.
 * Keep this separate so it can later be replaced with API responses.
 */

import {
  Sparkles,
  Shirt,
  Baby,
  Apple,
  Home,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Categories + inventory                                            */
/* ------------------------------------------------------------------ */

export type CategoryKey =
  | 'hygiene'
  | 'clothing'
  | 'baby'
  | 'food'
  | 'household'
  | 'emergency'

export type InventoryStatus = 'healthy' | 'low' | 'critical' | 'watch'

export type Tone = 'teal' | 'blush' | 'lavender' | 'gold' | 'sage' | 'rose'

export interface Category {
  key: CategoryKey
  label: string
  icon: LucideIcon
  quantity: number
  threshold: number
  status: InventoryStatus
  trend: string
  recommendation: string
  urgencyScore: number
  tone: Tone
}

export const categories: Category[] = [
  {
    key: 'hygiene',
    label: 'Hygiene',
    icon: Sparkles,
    quantity: 186,
    threshold: 220,
    status: 'low',
    trend: 'High demand',
    recommendation: 'Prioritize hygiene kits in the next donation drive.',
    urgencyScore: 8.4,
    tone: 'teal',
  },
  {
    key: 'clothing',
    label: 'Clothing',
    icon: Shirt,
    quantity: 248,
    threshold: 120,
    status: 'healthy',
    trend: 'Stable',
    recommendation: 'Inventory is healthy.',
    urgencyScore: 2.4,
    tone: 'lavender',
  },
  {
    key: 'baby',
    label: 'Baby Supplies',
    icon: Baby,
    quantity: 64,
    threshold: 100,
    status: 'critical',
    trend: 'Increasing demand',
    recommendation: 'Request diapers, wipes, and formula support.',
    urgencyScore: 9.2,
    tone: 'blush',
  },
  {
    key: 'food',
    label: 'Food',
    icon: Apple,
    quantity: 172,
    threshold: 150,
    status: 'watch',
    trend: 'Weekend demand rising',
    recommendation: 'Review weekend pantry demand.',
    urgencyScore: 5.1,
    tone: 'sage',
  },
  {
    key: 'household',
    label: 'Household',
    icon: Home,
    quantity: 118,
    threshold: 90,
    status: 'healthy',
    trend: 'Stable',
    recommendation: 'Inventory is healthy.',
    urgencyScore: 3.2,
    tone: 'gold',
  },
  {
    key: 'emergency',
    label: 'Emergency Kits',
    icon: ShieldCheck,
    quantity: 58,
    threshold: 80,
    status: 'low',
    trend: 'Demand rising',
    recommendation: 'Prepare emergency kit restock this week.',
    urgencyScore: 7.8,
    tone: 'rose',
  },
]

export const conditions = ['New', 'Like New', 'Good', 'Needs Review'] as const
export type Condition = (typeof conditions)[number]

/* ------------------------------------------------------------------ */
/*  Top-level metrics (Overview)                                      */
/* ------------------------------------------------------------------ */

export const stats = {
  currentInventory: 846,
  donatedThisWeek: 184,
  donatedDelta: 18, // +18% from last week
  distributedThisMonth: 312,
  familiesSupported: 124,
  lowStockCategories: 3,
  reportsGenerated: 18,
}

/* ------------------------------------------------------------------ */
/*  Care Timeline (replaces Recent Activity)                          */
/* ------------------------------------------------------------------ */

export type CareEventType =
  | 'donation'
  | 'distribution'
  | 'inventory'
  | 'alert'
  | 'report'

export interface CareEvent {
  id: string
  type: CareEventType
  title: string
  detail?: string
  time: string
}

export const careTimeline: CareEvent[] = [
  {
    id: 'c1',
    type: 'donation',
    title: '24 hygiene kits added',
    detail: 'Logged by Maya \u00b7 Sunrise Church drop-off',
    time: '12 min ago',
  },
  {
    id: 'c2',
    type: 'distribution',
    title: '12 winter coats distributed',
    detail: 'Family support \u00b7 Logged by Lena',
    time: '38 min ago',
  },
  {
    id: 'c3',
    type: 'donation',
    title: '8 baby supply packs logged',
    detail: 'Donor: Riverside Co-op',
    time: '1 hr ago',
  },
  {
    id: 'c4',
    type: 'alert',
    title: 'Emergency kits marked low',
    detail: '58 of 80 \u00b7 Restock recommended',
    time: '2 hr ago',
  },
  {
    id: 'c5',
    type: 'report',
    title: 'Weekly impact summary generated',
    detail: 'Ready to share with partners',
    time: '4 hr ago',
  },
  {
    id: 'c6',
    type: 'inventory',
    title: 'Food pantry stock updated',
    detail: '+18 items from a community drive',
    time: '6 hr ago',
  },
]

/* ------------------------------------------------------------------ */
/*  Reports                                                           */
/* ------------------------------------------------------------------ */

/** Donations by category (matches current inventory snapshot). */
export const donationsByCategory = [
  { category: 'Hygiene', value: 186 },
  { category: 'Clothing', value: 248 },
  { category: 'Baby Supplies', value: 64 },
  { category: 'Food', value: 172 },
  { category: 'Household', value: 118 },
  { category: 'Emergency Kits', value: 58 },
]

/** Weekly distribution by day. */
export const weeklyDistribution = [
  { day: 'Mon', items: 38 },
  { day: 'Tue', items: 44 },
  { day: 'Wed', items: 29 },
  { day: 'Thu', items: 61 },
  { day: 'Fri', items: 52 },
  { day: 'Sat', items: 47 },
  { day: 'Sun', items: 41 },
]

export const lowStockAlerts: Array<{
  key: CategoryKey
  label: string
  status: InventoryStatus
}> = [
  { key: 'baby', label: 'Baby Supplies', status: 'critical' },
  { key: 'hygiene', label: 'Hygiene', status: 'low' },
  { key: 'emergency', label: 'Emergency Kits', status: 'low' },
]

export const weeklySummaryText =
  'Baby supplies and hygiene kits saw the highest demand this week. Emergency kits are trending low and should be prioritized in the next donation drive. Clothing remained stable, while food distribution increased toward the weekend.'

/* ------------------------------------------------------------------ */
/*  Recommendations (Reports tab + Inventory expand)                  */
/* ------------------------------------------------------------------ */

export interface Recommendation {
  id: string
  category: string
  priority: 'High' | 'Medium' | 'Low'
  action: string
  reason: string
}

export const recommendations: Recommendation[] = [
  {
    id: 'r1',
    category: 'Baby Supplies',
    priority: 'High',
    action: 'Request diapers, wipes, and formula support.',
    reason: 'Stock is below threshold while demand is increasing.',
  },
  {
    id: 'r2',
    category: 'Hygiene',
    priority: 'High',
    action: 'Launch a hygiene kit donation drive.',
    reason:
      'Hygiene kits are moving quickly and current inventory is below target.',
  },
  {
    id: 'r3',
    category: 'Emergency Kits',
    priority: 'Medium',
    action: 'Prepare emergency kit restock this week.',
    reason: 'Stock is low and recent distribution has increased.',
  },
  {
    id: 'r4',
    category: 'Food',
    priority: 'Medium',
    action: 'Review weekend pantry demand.',
    reason: 'Food distribution has increased near the end of the week.',
  },
]

/* ------------------------------------------------------------------ */
/*  Distribution Trail                                                */
/* ------------------------------------------------------------------ */

export interface DistributionTrailEntry {
  id: string
  label: string
  target: string
  staff: string
  time: string
}

export const distributionTrail: DistributionTrailEntry[] = [
  { id: 'd1', label: '12 winter coats', target: 'Families', staff: 'Lena', time: '32 min ago' },
  { id: 'd2', label: '8 baby supply packs', target: 'New mothers', staff: 'Aria', time: '1 hr ago' },
  { id: 'd3', label: '24 hygiene kits', target: 'Community care', staff: 'Maya', time: '2 hr ago' },
  { id: 'd4', label: '5 emergency kits', target: 'Urgent support', staff: 'Jordan', time: '4 hr ago' },
]

/* ------------------------------------------------------------------ */
/*  Impact Strip                                                      */
/* ------------------------------------------------------------------ */

export interface ImpactMetric {
  id: CategoryKey
  label: string
  value: number
  note: string
}

export const impactBreakdown: ImpactMetric[] = [
  {
    id: 'hygiene',
    label: 'Hygiene kits',
    value: 86,
    note: 'Hygiene kits support dignity and daily comfort.',
  },
  {
    id: 'baby',
    label: 'Baby supply packs',
    value: 42,
    note: 'Baby supplies support mothers caring for infants.',
  },
  {
    id: 'clothing',
    label: 'Clothing items',
    value: 57,
    note: 'Clothing items provide practical seasonal support.',
  },
  {
    id: 'emergency',
    label: 'Emergency kits',
    value: 29,
    note: 'Emergency kits help teams respond to urgent needs.',
  },
]

export const impactHeadline =
  '312 essentials reached women and families this month.'

/* ------------------------------------------------------------------ */
/*  Loading + branding                                                */
/* ------------------------------------------------------------------ */

export const loadingPhrases = [
  'Preparing the flow of care\u2026',
  'Mapping donations to impact\u2026',
  'Organizing essentials\u2026',
  'Making every item easier to track\u2026',
]

export const trustBadges = [
  'Volunteer Friendly',
  'Privacy Aware',
  'Fast Intake',
  'Low-Stock Alerts',
  'Impact Reports',
  'Built for Care Teams',
]

/* ------------------------------------------------------------------ */
/*  Flow Map nodes                                                    */
/* ------------------------------------------------------------------ */

export type FlowNodeId = 'intake' | 'inventory' | 'distribution' | 'impact'

export interface FlowNode {
  id: FlowNodeId
  label: string
  hint: string
}

export const flowNodes: FlowNode[] = [
  { id: 'intake', label: 'Intake', hint: 'Donations come in.' },
  { id: 'inventory', label: 'Inventory', hint: 'Items are organized.' },
  { id: 'distribution', label: 'Distribution', hint: 'Items reach the community.' },
  { id: 'impact', label: 'Impact', hint: 'Care is delivered.' },
]
