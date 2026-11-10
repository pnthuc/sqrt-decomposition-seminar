export type Direction = 'prev' | 'next'

export interface RemoteState {
  type: 'state' | 'ack'
  page: number
  total: number
  hasPrev: boolean
  hasNext: boolean
}

export const connectTimeout = 15_000
export const commandTimeout = 5_000

export function isRemoteState(data: unknown): data is RemoteState {
  if (!data || typeof data !== 'object') return false
  const state = data as Partial<RemoteState>
  return (state.type === 'state' || state.type === 'ack')
    && Number.isInteger(state.page)
    && Number.isInteger(state.total)
    && typeof state.hasPrev === 'boolean'
    && typeof state.hasNext === 'boolean'
}
