import { JsonRpcRequest } from "@walletconnect/jsonrpc-utils";

import { HEDERA_LOGO_URL } from "../constants";
import {
  NamespaceMetadata,
  ChainMetadata,
  ChainRequestRender,
  ChainsMap,
} from "../helpers";

export const HederaMetadata: NamespaceMetadata = {
  testnet: {
    logo: HEDERA_LOGO_URL,
    rgb: "118, 90, 234",
  },
};

export const HederaChainData: ChainsMap = {
  testnet: {
    name: "Hedera Testnet",
    id: "hedera:testnet",
    /**
     * Hedera integration utilizes an sdk instead of a JSON-RPC relay:
     * {@link https://walletconnect-specs-git-fork-hgraph-io-main-walletconnect1.vercel.app/2.0/blockchain-rpc/hedera-rpc}
     */
    rpc: [],
    slip44: 3030,
    testnet: true,
  },
};

export function getChainMetadata(chainId: string): ChainMetadata {
  const reference = chainId.split(":")[1];
  const metadata = HederaMetadata[reference];
  if (typeof metadata === "undefined") {
    throw new Error(`No chain metadata found for chainId: ${chainId}`);
  }
  return metadata;
}

export function getChainRequestRender(
  request: JsonRpcRequest
): ChainRequestRender[] {
  return [
    { label: "Method", value: request.method },
    {
      label: "params",
      value: JSON.stringify(request.params, null, "\t"),
    },
  ];
}
