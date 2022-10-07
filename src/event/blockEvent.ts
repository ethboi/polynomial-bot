import { TESTNET } from '../secrets'
import { Client } from 'discord.js'
import { BlockEvent } from '../event'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TwitterApi } from 'twitter-api-v2'
import { PROCESS_DEPOSIT, PROCESS_WITHDRAWAL, PROCESS_WITHDRAWAL_PARTIALLY } from '../constants/topics'
import { TrackDeposits } from './deposit'
import { TrackWithdraws } from './withdraw'
import RpcClient from '../clients/client'

export async function TrackEvents(
  discordClient: Client<boolean>,
  telegramClient: Telegraf<Context<Update>>,
  twitterClient: TwitterApi,
  rpcClient: RpcClient,
): Promise<void> {
  console.log('### Polling Events ###')
  let blockNumber: number | undefined = undefined
  let pollInterval = 60000
  if (TESTNET) {
    blockNumber = rpcClient.provider.blockNumber - 30000
    pollInterval = 10000
  }
  BlockEvent.on(
    rpcClient,
    async (event) => {
      if (event.topics[0].toLowerCase() === PROCESS_DEPOSIT) {
        await TrackDeposits(discordClient, telegramClient, twitterClient, rpcClient, event)
      }
      if (
        event.topics[0].toLowerCase() == PROCESS_WITHDRAWAL ||
        event.topics[0].toLowerCase() == PROCESS_WITHDRAWAL_PARTIALLY
      ) {
        await TrackWithdraws(discordClient, telegramClient, twitterClient, rpcClient, event)
      }
    },
    {
      startBlockNumber: blockNumber,
      addresses: global.VAULT_ADDRESSES,
      topics: [PROCESS_DEPOSIT, PROCESS_WITHDRAWAL, PROCESS_WITHDRAWAL_PARTIALLY],
      pollInterval: pollInterval,
    },
  )
}
