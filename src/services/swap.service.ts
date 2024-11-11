import type {SwapEvent, PoolConfig} from '../types/trade.types';

export class SwapService {
  private static parseAmounts(log: string): { amountIn: number; amountOut: number } | null {
    const amountInMatch = /amount_in:\s(\d+)/.exec(log)
    const amountOutMatch = /amount_out:\s(\d+)/.exec(log)

    if (!amountInMatch || !amountOutMatch) return null

    return {
      amountIn: parseFloat(amountInMatch[1]),
      amountOut: parseFloat(amountOutMatch[1])
    }
  }

  public static processSwapEvent(log: string, pool: PoolConfig): SwapEvent | null {
    try {
      if (log.includes('RouteSwap')) return null

      const amounts = this.parseAmounts(log)
      if (!amounts) return null

      const { amountIn, amountOut } = amounts
      const isSell = amountIn > amountOut

      const baseAmount = isSell
        ? amountIn / Math.pow(10, pool.baseDecimals)
        : amountOut / Math.pow(10, pool.baseDecimals)

      const quoteAmount = isSell
        ? amountOut / Math.pow(10, pool.quoteDecimals)
        : amountIn / Math.pow(10, pool.quoteDecimals)

      const price = quoteAmount / baseAmount

      if (price < pool.minPrice || price > pool.maxPrice) return null

      return {
        type: isSell ? 'SELL' : 'BUY',
        baseAmount,
        quoteAmount,
        price,
        timestamp: new Date(),
        poolName: pool.name
      }
    } catch (error) {
      console.error('Error processing swap event:', error)
      return null
    }
  }
}