# Rage Quit Saving

A on-chain savings pool where patience pays — and quitters fund the winners.

Built on **Arc Testnet** (chain ID: 5042002). USDC is the native gas token on Arc, making this a stablecoin-native savings experience with fast finality and predictable costs.

---

## How it works

1. **Lock** — Users deposit USDC into a pool with a fixed lock duration and a visible early-exit penalty.
2. **Hold** — Every second you stay, you keep your share of the bonus pool. Quitters add to it.
3. **Quit early** — Pay the penalty (e.g. 20%). That amount goes directly into the bonus pool.
4. **Claim** — When the lock ends, survivors split the original deposits plus all collected penalties, proportional to their stake.

No oracles. No yield strategies. Just a simple behavioral rule enforced entirely on-chain.

---

## Pool types

| Type     | Duration | Early exit penalty | Min deposit |
|----------|----------|--------------------|-------------|
| Starter  | 7 days   | 10%                | 10 USDC     |
| Standard | 30 days  | 20%                | 100 USDC    |
| Hardcore | 60 days  | 35%                | 500 USDC    |

---

## Smart contract

- **Contract:** `src/RageQuitSaving.sol`
- **Deployed:** Arc Testnet
- **Address:** `0x59B7Cbee36075ED66FA04790770eD9d51404E810`
- **Explorer:** [arcscan.app](https://testnet.arcscan.app/address/0x59B7Cbee36075ED66FA04790770eD9d51404E810)

### Key functions

| Function | Description |
|---|---|
| `createPool(duration, penaltyBps)` | Create a new savings pool |
| `deposit(poolId)` | Join a pool with USDC |
| `rageQuit(poolId)` | Exit early — penalty is deducted and added to bonus pool |
| `claim(poolId)` | Claim stake + bonus share after maturity |
| `getPool(poolId)` | Read pool state |
| `getStake(poolId, user)` | Read a user's stake in a pool |

---

## Frontend

Built with Next.js, Tailwind CSS, wagmi, and viem.

```bash
cd frontend
npm install
npm run dev
```

---

## Contract development

```bash
# Build
forge build

# Test
forge test

# Deploy to Arc Testnet
cp .env.example .env
# fill in PRIVATE_KEY and ARC_TESTNET_RPC_URL
forge script script/Deploy.s.sol --rpc-url $ARC_TESTNET_RPC_URL --private-key $PRIVATE_KEY --broadcast
```

---

## Environment variables

```
ARC_TESTNET_RPC_URL=https://rpc.testnet.arc.network
PRIVATE_KEY=0x...
RAGEQUIT_ADDRESS=0x59B7Cbee36075ED66FA04790770eD9d51404E810
```

Never commit your `.env` file. It is gitignored by default.
