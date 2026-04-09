# DailyCheckIn

Solidity contract: one `checkIn()` per address per UTC day bucket (`block.timestamp / 1 days`). Reverts if `msg.value != 0`.

## Test

```bash
forge test
```

## Deploy (Base mainnet)

Replace `YOUR_KEY` with a deployer private key (never commit keys).

```bash
forge create src/DailyCheckIn.sol:DailyCheckIn \
  --rpc-url https://mainnet.base.org \
  --private-key YOUR_KEY \
  --broadcast
```

Current deploy (Base mainnet): `0xcE2F7dFA6F93Fa517FA17367D731c65Be37b38d8` — set as `NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS` in the web app / Vercel.
