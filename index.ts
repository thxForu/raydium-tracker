import {initSdk} from './config'
import {PublicKey} from '@solana/web3.js'

async function watchTrades() {
  const raydium = await initSdk()

  // SOL/USDT pool
  const poolId = '3nMFwZXwY1s1M5s8vYAHqd4wGs4iSxXE4LRoUMMYqEgF'
  const poolAddress = new PublicKey(poolId)

  console.log(`\nStarting monitoring for SOL/USDT pool`)

  const handleSwapEvent = (log: string) => {
    try {
      if (!log.includes('RouteSwap')) {
        const amountInMatch = /amount_in:\s(\d+)/.exec(log)
        const amountOutMatch = /amount_out:\s(\d+)/.exec(log)

        if (amountInMatch && amountOutMatch) {
          const amountIn = parseFloat(amountInMatch[1])
          const amountOut = parseFloat(amountOutMatch[1])

          const isSell = amountIn > amountOut

          const amountSOL = isSell
            ? amountIn / Math.pow(10, 9)    // SOL amount_in
            : amountOut / Math.pow(10, 9)   // SOL amount_out

          const amountUSDT = isSell
            ? amountOut / Math.pow(10, 6)   // USDT amount_out
            : amountIn / Math.pow(10, 6)    // USDT amount_in

          const price = amountUSDT / amountSOL

          if (price > 180 && price < 260) {
            console.log('\n🔄 Swap:', {
              type: isSell ? '🔴 SELL' : '🟢 BUY',
              SOL: amountSOL.toFixed(4),
              USDT: amountUSDT.toFixed(2),
              price: price.toFixed(2)
            })
          }
        }
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const subscription = raydium.connection.onLogs(
    poolAddress,
    (logs) => {
      logs.logs.forEach((log) => {
        if (log.includes('Swap')) {
          handleSwapEvent(log)
        }
      })
    },
    'confirmed'
  )

  process.on('SIGINT', () => {
    console.log('\nUnsubscribing from WebSocket...')
    raydium.connection.removeOnLogsListener(subscription)
    process.exit(0)
  })
}

watchTrades()