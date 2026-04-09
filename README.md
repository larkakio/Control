# Control

Mobile-first puzzle game on **Base** with daily on-chain check-in, **wagmi/viem**, and **ERC-8021** builder attribution on transactions.

## Structure

- `web/` — Next.js App Router (Vercel **Root Directory** = `web`)
- `contracts/` — Foundry `DailyCheckIn` contract

**Production:** [https://control-lyart.vercel.app](https://control-lyart.vercel.app)

## Web setup

```bash
cd web
cp .env.example .env.local
# add Base.dev / builder code / site URL as needed, then:
npm install
npm run test
npm run build
```

## Contract (Base mainnet)

Deployed **`DailyCheckIn`**: `0xcE2F7dFA6F93Fa517FA17367D731c65Be37b38d8`

```bash
cd contracts
forge test
```

For a new deploy, update `NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS` in `web/.env.local` and Vercel.

## Assets

Branded JPGs live in `web/public/`:

- `control-app-icon.jpg` — 1:1, max 1024×1024, under 1MB
- `control-app-thumbnail.jpg` — 1.91:1, under 1MB
