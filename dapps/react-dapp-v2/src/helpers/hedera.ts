import axios, { AxiosInstance } from "axios";
import { EngineTypes } from "@walletconnect/types";
import {
  AccountId,
  Client,
  Hbar,
  RequestType,
  Transaction,
} from "@hashgraph/sdk";

type TypedRequestParams<T> = Omit<EngineTypes.RequestParams, "request"> & {
  request: Omit<EngineTypes.RequestParams["request"], "params"> & {
    params: T;
  };
};

/**
 * `transaction.type` should be an instance of `RequestType` from `@hashgraph/sdk`.
 * e.g. RequestType.CryptoTransfer.toString()
 */
export type HederaSignAndExecuteTransactionParams = {
  transaction: {
    type: string;
    bytes: string;
  };
};

export type HederaSignMessageParams = {
  message: string;
};

export type HederaSessionRequestParams = TypedRequestParams<
  HederaSignAndExecuteTransactionParams | HederaSignMessageParams
>;

export class HederaParamsFactory {
  public static buildTransactionPayload(
    type: RequestType,
    transaction: Transaction
  ): HederaSignAndExecuteTransactionParams {
    this._setNodeAccountIds(transaction);
    this._freezeTransaction(transaction);
    return {
      transaction: {
        type: type.toString(),
        bytes: this._encodeTransactionBytes(transaction),
      },
    };
  }

  public static buildSignMessagePayload(
    message: string
  ): HederaSignMessageParams {
    return {
      message: Buffer.from(message).toString("base64"),
    };
  }

  private static _freezeTransaction(transaction: Transaction): void {
    if (!transaction.isFrozen()) {
      transaction.freeze();
    }
  }

  private static _setNodeAccountIds(transaction: Transaction): void {
    const nodeIds = transaction.nodeAccountIds;
    if (!nodeIds || nodeIds.length === 0) {
      transaction.setNodeAccountIds([new AccountId(3)]);
    }
  }

  private static _encodeTransactionBytes(transaction: Transaction): string {
    const transactionBytes = transaction.toBytes();
    return Buffer.from(transactionBytes).toString("base64");
  }
}

const hederaApi: AxiosInstance = axios.create({
  timeout: 10000, // 10 secs
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  baseURL: "https://testnet.mirrornode.hedera.com/api/v1",
});

const formatTinybarAsHbar = (balance: number | string): string => {
  return Hbar.fromTinybars(balance).toBigNumber().toFormat(8);
};

export const apiGetHederaAccountBalance = async (address: string) => {
  const response = await hederaApi.get(`/accounts/${address}`);
  const { balance } = response.data.balance;
  return {
    balance: formatTinybarAsHbar(balance),
    name: "HBAR",
    symbol: "ℏ",
  };
};

const createTestnetClient = () => {
  try {
    /**
     * WARNING: Do not use this approach of storing/accessing private keys in production.
     * This app is not configured with a secure storage mechanism, so this is just the
     * best way to make it work and showcase Hedera integration with WalletConnect.
     */
    const privateKey = process.env.NEXT_PUBLIC_HEDERA_PRIVATE_KEY;
    const accountAddress = process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID;

    if (!accountAddress || !privateKey) {
      throw new Error(
        "Missing required env vars: `NEXT_PUBLIC_HEDERA_ACCOUNT_ID` and/or `HEDERA_PRIVATE_KEY`"
      );
    }

    const id = Number(accountAddress.split(".").pop());
    const accountId = new AccountId(id);

    const client = Client.forTestnet();
    client.setOperator(accountId, privateKey);
    client.setDefaultMaxTransactionFee(new Hbar(100));
    client.setMaxQueryPayment(new Hbar(50));

    return client;
  } catch (e) {
    console.error("Failed to initialize Hedera wallet", e);
    return null;
  }
};

export const hederaTestnetClient = createTestnetClient();
