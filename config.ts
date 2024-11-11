import { Raydium } from '@raydium-io/raydium-sdk-v2'
import { Connection, Keypair } from '@solana/web3.js'

const connection = new Connection(
  'https://api.mainnet-beta.solana.com',
  { wsEndpoint: 'wss://api.mainnet-beta.solana.com' }
)
const cluster = 'mainnet'
let raydium: Raydium | undefined

export const initSdk = async () => {
  if (raydium) return raydium

  const owner = Keypair.generate()

  raydium = await Raydium.load({
    owner,
    connection,
    cluster,
    disableFeatureCheck: true,
    disableLoadToken: true,
    blockhashCommitment: 'finalized',
  })

  return raydium
}