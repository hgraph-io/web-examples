export type THederaChain = 'hedera:testnet'

export const HEDERA_MAINNET_CHAINS = {
  // TODO
}

export const HEDERA_TESTNET_CHAINS = {
  'hedera:testnet': {
    chainId: 'testnet',
    name: 'Hedera Testnet',
    logo: '/chain-logos/hedera-hbar-logo.png',
    rgb: '118, 90, 234',
  }
}

export const HEDERA_CHAINS = { ...HEDERA_TESTNET_CHAINS }

export enum HEDERA_SIGNING_METHODS {
  HEDERA_SIGN_AND_EXECUTE_TRANSACTION = 'hedera_signAndExecuteTransaction',
  HEDERA_SIGN_AND_RETURN_TRANSACTION = 'hedera_signAndReturnTransaction'
}
