# raydium-tracker

### Add New Pool

Add pool to `src/config/pools.config.ts`:

```typescript
'SOL/USDT': {
  id: '3nMFwZXwY1s1M5s8vYAHqd4wGs4iSxXE4LRoUMMYqEgF', // Pool address from raydium.io/pools
  name: 'SOL/USDT',
  baseName: 'SOL',        // First token
  quoteName: 'USDT',      // Second token
  baseDecimals: 9,        // SOL decimals
  quoteDecimals: 6,       // USDT decimals
  minPrice: 180,          // Min price filter
  maxPrice: 260           // Max price filter
}
```

Common decimals:
- SOL: 9
- USDT/USDC: 6


To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.33. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

