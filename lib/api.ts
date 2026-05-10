const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://127.0.0.1:8010'

type RequestOptions = {
  method?: 'GET' | 'POST'
  body?: unknown
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`
    try {
      const errorPayload = (await response.json()) as { detail?: string }
      if (errorPayload?.detail) message = errorPayload.detail
    } catch {
      // Ignore parsing errors and keep fallback message.
    }
    throw new Error(message)
  }

  return (await response.json()) as T
}

export type ApiCategory = { name: string; display_name: string }
export type ApiInventoryItem = {
  category: string
  display_name: string
  quantity: number
  threshold: number
  status: 'healthy' | 'low' | 'critical'
}
export type IntakePayload = {
  category: string
  item_name?: string
  quantity: number
  condition?: string
  donor_name?: string
  intake_person?: string
  notes?: string
}
export type OutboundPayload = {
  category: string
  item_name?: string
  quantity: number
  recipient_id?: string
  outbound_person?: string
  notes?: string
}

export async function getCategories() {
  return request<ApiCategory[]>('/api/categories')
}

export async function getInventory() {
  return request<ApiInventoryItem[]>('/api/inventory')
}

export async function createIntake(payload: IntakePayload) {
  return request('/api/intake', { method: 'POST', body: payload })
}

export async function createOutbound(payload: OutboundPayload) {
  return request('/api/outbound', { method: 'POST', body: payload })
}

export async function getIntake(limit = 10) {
  return request(`/api/intake?limit=${limit}`)
}

export async function getOutbound(limit = 10) {
  return request(`/api/outbound?limit=${limit}`)
}

export async function getSummary(days = 7) {
  return request<
    Array<{
      category: string
      display_name: string
      intake_total: number
      outbound_total: number
      net: number
    }>
  >(`/api/reports/summary?days=${days}`)
}

export async function getLowInventory() {
  return request<
    Array<{
      category: string
      display_name: string
      current_quantity: number
      threshold: number
      deficit: number
      status: 'low' | 'critical'
    }>
  >('/api/reports/low-inventory')
}

export async function getRecommendations() {
  return request<
    Array<{
      category: string
      action: string
      reason: string
      priority: 'high' | 'medium' | 'low'
      confidence: number
    }>
  >('/api/analytics/recommendations')
}

export async function getWeeklySummary() {
  return request<{ summary: string; ai_powered: boolean; model: string }>(
    '/api/analytics/weekly-summary',
  )
}
