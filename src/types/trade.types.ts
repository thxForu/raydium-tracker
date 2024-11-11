export interface SwapEvent {
  type: 'BUY' | 'SELL'
  baseAmount: number
  quoteAmount: number
  price: number
  timestamp: Date
  poolName: string
}

export interface PoolConfig {
  id: string
  name: string
  baseName: string
  quoteName: string
  baseDecimals: number
  quoteDecimals: number
  minPrice: number
  maxPrice: number
}