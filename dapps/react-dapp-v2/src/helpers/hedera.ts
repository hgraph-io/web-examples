import { EngineTypes } from "@walletconnect/types";
import { AccountId, RequestType, Transaction } from "@hashgraph/sdk";

type TypedRequestParams<T> = Omit<EngineTypes.RequestParams, "request"> & {
  request: Omit<EngineTypes.RequestParams["request"], "params"> & {
    params: T;
  };
};

/**
 * `transaction.type` should be an instance of `RequestType` from `@hashgraph/sdk`.
 * e.g. RequestType.CryptoTransfer.toString()
 */
export type HederaSignAndSendTransactionParams = {
  transaction: {
    type: string;
    bytes: string;
  };
};

export type HederaSessionRequestParams =
  TypedRequestParams<HederaSignAndSendTransactionParams>;

export class HederaParamsFactory {
  public static buildTransactionPayload(
    type: RequestType,
    transaction: Transaction
  ): HederaSignAndSendTransactionParams {
    this._setNodeAccountIds(transaction);
    this._freezeTransaction(transaction);
    return {
      transaction: {
        type: type.toString(),
        bytes: this._encodeTransactionBytes(transaction),
      },
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
