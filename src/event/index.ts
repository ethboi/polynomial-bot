import { BigNumber } from '@ethersproject/bignumber'
import { BlockTag } from '@ethersproject/providers'
import { Event as GenericEvent } from 'ethers'
import RpcClient from '../clients/client'

export type EventListener = {
  off: () => void
}

export type EventListenerCallback = (transfer: GenericEvent) => void

export type EventListenerOptions = {
  pollInterval?: number
  startBlockNumber?: BlockTag
  addresses: string[]
  topics: string[]
}
export class BlockEvent {
  static on(rpcClient: RpcClient, callback: EventListenerCallback, options?: EventListenerOptions): EventListener {
    const ms = options?.pollInterval ?? 7.5 * 1000
    const startBlockTag = options?.startBlockNumber ?? 'latest'
    let timeout: NodeJS.Timeout | null

    rpcClient.provider.getBlock(startBlockTag).then(async (block) => {
      console.debug(`Polling from block ${block.number} every ${ms}ms`)
      let prevBlock = block

      const poll = async () => {
        const latestBlock = await rpcClient.provider.getBlock('latest')
        const fromBlockNumber = prevBlock.number + 1
        const toBlockNumber = latestBlock.number
        if (fromBlockNumber >= toBlockNumber) {
          setTimeout(poll, ms)
          return
        }
        console.debug(
          `Querying block range: ${fromBlockNumber} to ${toBlockNumber} (${toBlockNumber - fromBlockNumber} blocks)`,
        )

        try {
          const events: GenericEvent[] = await rpcClient.provider.send('eth_getLogs', [
            {
              fromBlock: BigNumber.from(fromBlockNumber).toHexString(),
              toBlock: BigNumber.from(toBlockNumber).toHexString(),
              address: options?.addresses,
              topics: [options?.topics],
            },
          ])

          if (events.length > 0) {
            console.debug(`Found ${events.length} events`)
          }
          await Promise.all(
            events.map((x) => {
              callback(x)
            }),
          )
        } catch (e) {
          console.warn(e)
        }
        prevBlock = latestBlock
        setTimeout(poll, ms)
      }
      timeout = setTimeout(poll, ms)
    })

    return {
      off: () => {
        if (timeout) {
          clearTimeout(timeout)
        }
      },
    }
  }
}
