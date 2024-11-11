import { PublicKey } from '@solana/web3.js'
import { Raydium } from '@raydium-io/raydium-sdk-v2'
import { SwapService } from './swap.service'
import { POOLS } from '../config/pools.config'
import type {SwapEvent, PoolConfig} from '../types/trade.types'

export class MonitorService {
  private subscription: number | undefined

  constructor(
    private readonly raydium: Raydium,
  ) {}

  public async startMonitoring(poolName: string) {
    const pool = POOLS[poolName]
    if (!pool) {
      throw new Error(`Pool ${poolName} not found in config`)
    }

    const poolAddress = new PublicKey(pool.id)
    console.log(`\nStarting monitoring for ${pool.name} pool`)

    this.subscription = this.raydium.connection.onLogs(
      poolAddress,
      (logs) => {
        logs.logs.forEach((log) => {
          if (log.includes('Swap')) {
            const swap = SwapService.processSwapEvent(log, pool)
            if (swap) {
              this.printSwap(swap, pool)
            }
          }
        })
      },
      'confirmed'
    )
  }

  private printSwap(swap: SwapEvent, pool: PoolConfig) {
    console.log('\n🔄 Swap:', {
      type: swap.type === 'SELL' ? '🔴 SELL' : '🟢 BUY',
      [pool.baseName]: swap.baseAmount.toFixed(4),
      [pool.quoteName]: swap.quoteAmount.toFixed(2),
      price: swap.price.toFixed(2),
      time: swap.timestamp.toLocaleTimeString()
    })
  }

  public stopMonitoring() {
    if (this.subscription) {
      this.raydium.connection.removeOnLogsListener(this.subscription)
      console.log('\nMonitoring stopped')
    }
  }
}