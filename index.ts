import { initSdk } from './config'
import { PublicKey } from '@solana/web3.js'
import Decimal from 'decimal.js'

async function watchTrades() {
  const raydium = await initSdk()

  // SOL-RAY pool
  const poolId = '4y81XN75NGct6iUYkBp2ixQKtXdrQxxMVgFbFF9w5n4u'

  const poolInfos = await raydium.cpmm.getRpcPoolInfos([poolId])
  let lastBaseReserve = poolInfos[poolId].baseReserve
  let lastQuoteReserve = poolInfos[poolId].quoteReserve

  console.log('Initial pool state:', {
    price: poolInfos[poolId].poolPrice.toString(),
    baseReserve: lastBaseReserve.toString(),
    quoteReserve: lastQuoteReserve.toString()
  })

  const subscription = raydium.connection.onAccountChange(
    new PublicKey(poolId),
    async () => {
      try {
        const currentPoolInfo = await raydium.cpmm.getRpcPoolInfos([poolId])
        const currentBaseReserve = currentPoolInfo[poolId].baseReserve
        const currentQuoteReserve = currentPoolInfo[poolId].quoteReserve

        const baseChange = currentBaseReserve.sub(lastBaseReserve)
        const quoteChange = currentQuoteReserve.sub(lastQuoteReserve)

        if (!baseChange.isZero() || !quoteChange.isZero()) {
          const isSell = baseChange.isNeg() && quoteChange.isPos()

          const price = new Decimal(quoteChange.abs().toString())
            .div(baseChange.abs().toString())

          console.log('\n🔄 Trade Detected:', {
            timestamp: new Date().toLocaleTimeString(),
            type: isSell ? '🔴 SELL' : '🟢 BUY',
            baseAmount: baseChange.abs().toString(),
            quoteAmount: quoteChange.abs().toString(),
            price: price.toString(),
            currentPrice: currentPoolInfo[poolId].poolPrice.toString()
          })
        }

        lastBaseReserve = currentBaseReserve
        lastQuoteReserve = currentQuoteReserve

      } catch (error) {
        console.error('Error processing update:', error)
      }
    },
    'confirmed'
  )

  process.on('SIGINT', () => {
    console.log('\nUnsubscribing from WebSocket...')
    raydium.connection.removeAccountChangeListener(subscription)
    process.exit(0)
  })
}

console.log('Starting trade monitoring...')
watchTrades()