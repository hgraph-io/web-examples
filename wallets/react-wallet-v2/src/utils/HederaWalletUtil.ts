import { HederaWallet } from '@/lib/HederaLib'

export let hederaAddresses: string[]
export let hederaWallet: HederaWallet

export async function createOrRestoreHederaWallet() {
  try {
    /**
     * WARNING: Do not use this approach of storing/accessing private keys in production.
     * This app is not configured with a secure storage mechanism, so this is just the
     * best way to make it work and showcase Hedera integration with WalletConnect.
     */
    const privateKey = process.env.NEXT_PUBLIC_HEDERA_PRIVATE_KEY
    const accountAddress = process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID

    if (!accountAddress || !privateKey) {
      throw new Error(
        'Missing required env vars: `NEXT_PUBLIC_HEDERA_ACCOUNT_ID` and/or `HEDERA_PRIVATE_KEY`'
      )
    }

    const accountId = Number(accountAddress.split('.').pop())
    hederaWallet = HederaWallet.init({ accountId, privateKey })
    hederaAddresses = [hederaWallet.getAccountAddress()]

    return {
      hederaWallet,
      hederaAddresses
    }
  } catch (e) {
    console.error('Failed to initialize Hedera wallet', e)
    return {
      hederaWallet: null,
      hederaAddresses: []
    }
  }
}
