# React dApp (with standalone v2 client)

🔗 Live dapp demo - https://react-app.walletconnect.com/ <br />
🔗 Live wallet demo - https://react-wallet.walletconnect.com/ <br />
📚 WalletConnect v2 Docs - https://docs.walletconnect.com/2.0

## Overview

This is an example implementation of a React dApp (generated via `create-react-app`) using the standalone
client for WalletConnect v2 to:

- handle pairings
- manage sessions
- send JSON-RPC requests to a paired wallet

## Running locally

Install the app's dependencies:

```bash
yarn
```

If you want to test Hedera integration, go to [Hedera Portal](https://portal.hedera.com/) to create a Testnet account.

Set up your local environment variables by copying the example into your own `.env.local` file:

```bash
cp .env.local.example .env.local
```

Your `.env.local` now contains the following environment variables:

- `NEXT_PUBLIC_PROJECT_ID` (placeholder) - You can generate your own ProjectId at https://cloud.walletconnect.com
- `NEXT_PUBLIC_RELAY_URL` (already set)
- `NEXT_PUBLIC_HEDERA_ACCOUNT_ID` (placeholder, optional) - Get your testnet account id from https://portal.hedera.com/
- `NEXT_PUBLIC_HEDERA_PRIVATE_KEY` (placeholder, optional) - Get your testnet private key from https://portal.hedera.com/

## Develop

```bash
yarn dev
```

## Test

```bash
yarn test
```

## Build

```bash
yarn build
```
