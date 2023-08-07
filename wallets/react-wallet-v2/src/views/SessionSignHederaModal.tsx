import ProjectInfoCard from '@/components/ProjectInfoCard'
import RequestDataCard from '@/components/RequestDataCard'
import RequestDetailsCard from '@/components/RequestDetalilsCard'
import RequestMethodCard from '@/components/RequestMethodCard'
import RequestModalContainer from '@/components/RequestModalContainer'
import { HEDERA_SIGNING_METHODS } from '@/data/HederaData'
import ModalStore from '@/store/ModalStore'
import { approveHederaRequest, rejectHederaRequest } from '@/utils/HederaRequestHandlerUtil'
import { hederaWallet } from '@/utils/HederaWalletUtil'
import { signClient } from '@/utils/WalletConnectUtil'
import {
  type TransferTransaction,
  RequestType,
  TopicMessageSubmitTransaction
} from '@hashgraph/sdk'
import { Button, Divider, Modal, Text } from '@nextui-org/react'
import { SignClientTypes } from '@walletconnect/types'
import { Fragment } from 'react'

type HederaSignAndSendTransactionParams = {
  transaction: {
    type: string
    bytes: string
  }
}

type HederaSignMessageParams = {
  message: string
}

type SessionRequestParams = SignClientTypes.EventArguments['session_request']['params']

type SummaryDetailProps = {
  label: string
  data: JSX.Element | string | null | undefined
}

const SummaryDetail = ({ label, data }: SummaryDetailProps) => {
  if (!data) return null
  return (
    <div style={{ paddingTop: 8 }}>
      <Text b>{`${label}`}</Text>
      {typeof data === 'string' ? (
        <Text color="$gray400" weight="normal">
          {data}
        </Text>
      ) : (
        data
      )}
    </div>
  )
}

const SummaryDetailSection = ({ items }: { items: SummaryDetailProps[] }) => {
  return (
    <>
      <Text h5>Summary</Text>
      {items.map(({ label, data }) => (
        <SummaryDetail key={label} label={label} data={data} />
      ))}
    </>
  )
}

const SignTransactionSummary = ({ params }: { params: SessionRequestParams }) => {
  const { transaction } = params.request.params as HederaSignAndSendTransactionParams
  const transactionFromBytes = hederaWallet.transactionFromEncodedBytes(transaction.bytes)
  const shouldShow = transaction.bytes && transactionFromBytes

  if (!shouldShow) return null

  const items: SummaryDetailProps[] = []

  items.push({ label: 'TransactionType', data: transaction.type })
  items.push({ label: 'Memo', data: transactionFromBytes.transactionMemo })

  if (transaction.type === RequestType.CryptoTransfer.toString()) {
    const hbarTransferMap = (transactionFromBytes as TransferTransaction).hbarTransfers
    if (hbarTransferMap) {
      const hbarTransfers = Array.from(hbarTransferMap)

      const HbarTransferSummary = (
        <>
          {hbarTransfers.map(([accountId, amount]) => (
            <div key={accountId.toString() + amount}>
              <Text span color="$gray400">
                {`• ${accountId.toString()}: `}
                <Text span color={amount.isNegative() ? 'error' : 'success'}>
                  {amount.toString()}
                </Text>
              </Text>
            </div>
          ))}
        </>
      )
      items.push({ label: 'HBAR Transfers', data: HbarTransferSummary })
    }

    /**
     * TODO: Handle token transfers and NFT transfers as well
     */
  }

  if (transaction.type === RequestType.ConsensusSubmitMessage.toString()) {
    const txn = transactionFromBytes as TopicMessageSubmitTransaction
    const uint8Message = txn.getMessage()
    const message = uint8Message && Buffer.from(uint8Message as any, 'base64').toString()

    items.push({ label: 'Topic ID', data: txn.topicId?.toString() })
    items.push({ label: 'Message', data: message })
  }

  if (!items.length) return null

  return <SummaryDetailSection items={items} />
}

const SignMessageSummary = ({ params }: { params: SessionRequestParams }) => {
  const { message } = params.request.params as HederaSignMessageParams
  const decodedMessage = Buffer.from(message, 'base64').toString()

  const items: SummaryDetailProps[] = []

  items.push({ label: 'Decoded Message Data', data: decodedMessage })

  return <SummaryDetailSection items={items} />
}

const RequestSummary = ({ params }: { params: SessionRequestParams }) => {
  switch (params.request.method) {
    case HEDERA_SIGNING_METHODS.HEDERA_SIGN_AND_EXECUTE_TRANSACTION:
    case HEDERA_SIGNING_METHODS.HEDERA_SIGN_AND_RETURN_TRANSACTION:
      return <SignTransactionSummary params={params} />
    case HEDERA_SIGNING_METHODS.HEDERA_SIGN_MESSAGE:
      return <SignMessageSummary params={params} />
    default:
      return null
  }
}

export default function SessionSignHederaModal() {
  // Get request and wallet data from store
  const requestEvent = ModalStore.state.data?.requestEvent
  const requestSession = ModalStore.state.data?.requestSession

  // Ensure request and wallet are defined
  if (!requestEvent || !requestSession) {
    return <Text>Missing request data</Text>
  }

  // Get required request data
  const { topic, params } = requestEvent
  const { request, chainId } = params

  // Handle approve action (logic varies based on request method)
  async function onApprove() {
    if (requestEvent) {
      const response = await approveHederaRequest(requestEvent)
      await signClient.respond({
        topic,
        response
      })
      ModalStore.close()
    }
  }

  // Handle reject action
  async function onReject() {
    if (requestEvent) {
      const response = rejectHederaRequest(requestEvent)
      await signClient.respond({
        topic,
        response
      })
      ModalStore.close()
    }
  }

  return (
    <Fragment>
      <RequestModalContainer title="Hedera">
        <ProjectInfoCard metadata={requestSession.peer.metadata} />

        <Divider y={2} />

        <RequestDetailsCard chains={[chainId ?? '']} protocol={requestSession.relay.protocol} />

        <Divider y={2} />

        <RequestSummary params={params} />

        <Divider y={2} />

        <RequestDataCard data={params} />

        <Divider y={2} />

        <RequestMethodCard methods={[request.method]} />
      </RequestModalContainer>

      <Modal.Footer>
        <Button auto flat color="error" onClick={onReject}>
          Reject
        </Button>
        <Button auto flat color="success" onClick={onApprove}>
          Approve
        </Button>
      </Modal.Footer>
    </Fragment>
  )
}
