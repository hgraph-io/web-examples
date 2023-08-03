import { HederaWallet } from '@/lib/HederaLib'

export let hederaAddresses: string[]
export let hederaWallet: HederaWallet

export async function createOrRestoreHederaWallet() {
  try {
    const accountId = process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID
    const privateKey = process.env.HEDERA_PRIVATE_KEY
    if (!accountId || !privateKey) {
      throw new Error(
        'Missing required env vars: `NEXT_PUBLIC_HEDERA_ACCOUNT_ID` and/or `HEDERA_PRIVATE_KEY`'
      )
    }

    hederaWallet = new HederaWallet({ accountId, privateKey })
    const account = await hederaWallet.getAccount()
    hederaAddresses = [account.accountId]

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
