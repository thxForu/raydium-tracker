import { MonitorService } from './src/services/monitor.service'
import { initRaydium } from "./src/config/raydium.config.ts";

async function main() {
  try {
    const raydium = await initRaydium()
    const monitor = new MonitorService(raydium)

    await monitor.startMonitoring('SOL/USDT')

    process.on('SIGINT', () => {
      monitor.stopMonitoring()
      process.exit(0)
    })
  } catch (error) {
    console.error('Error starting monitor:', error)
    process.exit(1)
  }
}

main()