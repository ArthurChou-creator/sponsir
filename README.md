# Sponsir — AI-Native Event Sponsorship Marketplace

> Built for the **OKX AI Hackathon 2026** · Deployed on X Layer Mainnet

Sponsir is an AI-powered sponsorship marketplace where autonomous agents discover, evaluate, and purchase event sponsorships on-chain — fully gas-free via the x402 payment protocol.

---

## The Problem

Event sponsorship is broken. Sponsors waste weeks on cold emails, PDFs, and wire transfers. Organizers struggle to reach the right buyers. There's no transparent, programmable, on-chain layer for any of it.

## The Solution

Sponsir puts AI agents in charge. A sponsor sets a budget and criteria — the agent handles everything: scanning events, scoring fit, selecting the best package, and paying instantly with USDG on X Layer. No gas. No friction. Fully verifiable on-chain.

---

## Demo

**Live proof of payment on X Layer:**
[`0xba50f0a9a2a6903567d50ca03285a270debbb32dd71a43c3cf2338bd3fb5ecfa`](https://web3.okx.com/en/explorer/x-layer/tx/0xba50f0a9a2a6903567d50ca03285a270debbb32dd71a43c3cf2338bd3fb5ecfa)

**SponsorshipRegistry Contract:**
[`0xC6bBee3228434F8ae468B1B4Dc74DDCBf1b55b11`](https://web3.okx.com/en/explorer/x-layer/address/0xC6bBee3228434F8ae468B1B4Dc74DDCBf1b55b11)

---

## Key Features

- **AI Agent** — Autonomously scans events, scores fit (0–100), selects packages, and pays
- **x402 Protocol** — Gas-free USDG payments via EIP-3009 TransferWithAuthorization through OKX Facilitator
- **OKX Onchain OS** — Balance API for real-time USDG balance; Transaction History API for wallet credibility scoring
- **Wallet-aware UX** — Smart CTAs adapt based on connected wallet balance
- **SponsorshipRegistry** — On-chain record of every sponsorship, deployed on X Layer mainnet
- **Organizer Dashboard** — Create events, define sponsorship packages, manage listings
- **Shopping Cart** — Manual sponsorship purchase flow with x402 checkout

---

## OKX Integration

| Feature | Integration |
|---|---|
| Payment | x402 protocol · EIP-3009 · OKX Facilitator |
| Wallet Balance | OKX Onchain OS Balance API (`getUSDGBalance`) |
| Credibility Score | OKX Transaction History API (`getCredibilityScore`) |
| Network | X Layer Mainnet (Chain ID: 196) |
| Explorer | OKX Web3 Explorer |

---

## How the AI Agent Works

```
1. User sets budget + event category preferences
2. Agent scans all published events on Sponsir
3. Each event is scored: relevance + audience + timing + budget fit
4. Agent selects best matching sponsorship package
5. x402 payment executed — USDG transferred gas-free via OKX Facilitator
6. Sponsorship recorded on-chain via SponsorshipRegistry.record()
7. Wallet credibility score logged (OKX Onchain OS)
```

---

## Tech Stack

- **Frontend** — React 18, Vite, TailwindCSS
- **Blockchain** — viem, X Layer (EVM-compatible L2)
- **Smart Contract** — Solidity 0.8.20, SponsorshipRegistry
- **Payment** — x402 protocol, EIP-3009, USDG (Global Dollar)
- **OKX APIs** — Onchain OS Balance API, Transaction History API
- **Fonts** — Space Grotesk, DM Mono

---

## Smart Contract

```solidity
// SponsorshipRegistry on X Layer Mainnet
// 0xC6bBee3228434F8ae468B1B4Dc74DDCBf1b55b11

function record(
    string calldata eventId,
    string calldata planId,
    string calldata eventTitle,
    string calldata planTitle,
    uint256 amountUSD
) external
```

Source: [`contracts/SponsorshipRegistry.sol`](./contracts/SponsorshipRegistry.sol)

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Add your OKX API credentials

# Start development server
pnpm run dev
```

### Environment Variables

```
VITE_OKX_API_KEY=your_okx_api_key
VITE_OKX_SECRET_KEY=your_okx_secret_key
VITE_OKX_PASSPHRASE=your_okx_passphrase
```

---

## Project Structure

```
src/
├── pages/
│   ├── AgentPage.jsx          # AI agent interface
│   ├── Home.jsx               # Landing page
│   ├── sponsor/
│   │   ├── EventBrowse.jsx    # Event discovery
│   │   ├── EventDetail.jsx    # Sponsorship plans + wallet-aware CTAs
│   │   └── ShoppingCart.jsx   # x402 checkout
│   └── organizer/
│       ├── CreateEvent.jsx    # Event creation
│       ├── ManageEvents.jsx   # Event management
│       └── CreateSponsorshipPlans.jsx
├── lib/
│   ├── x402.js               # x402 payment protocol
│   ├── onchainOS.js          # OKX Onchain OS APIs
│   └── contract.js           # SponsorshipRegistry interface
├── hooks/
│   └── useWalletBalance.js   # Real-time USDG balance hook
└── contracts/
    └── SponsorshipRegistry.sol
```

---

## Built With

- [OKX Onchain OS](https://www.okx.com/web3) — Balance & Transaction History APIs
- [x402 Protocol](https://x402.org) — HTTP-native payments
- [X Layer](https://www.okx.com/xlayer) — OKX's EVM-compatible L2
- [viem](https://viem.sh) — Ethereum interactions

---

*OKX AI Hackathon 2026 submission by Arthur Chou*
