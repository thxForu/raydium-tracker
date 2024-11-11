import type {PoolConfig} from '../types/trade.types'

export const POOLS: Record<string, PoolConfig> = {
  'SOL/USDT': {
    id: '3nMFwZXwY1s1M5s8vYAHqd4wGs4iSxXE4LRoUMMYqEgF',
    name: 'SOL/USDT',
    baseName: 'SOL',
    quoteName: 'USDT',
    baseDecimals: 9,
    quoteDecimals: 6,
    minPrice: 180,
    maxPrice: 260
  },
}