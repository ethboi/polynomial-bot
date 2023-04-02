import { Client } from 'discord.js'
import { Telegraf, Context } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TwitterApi } from 'twitter-api-v2'
import { getImage, BroadCast } from './common'
import { EventType } from '../constants/eventType'
import { GetEns } from '../integrations/ens'
import { EventDto } from '../types/EventDto'
import fromBigNumber from '../utils/fromBigNumber'
import { Event as GenericEvent } from 'ethers'
import { ProcessWithdrawalEvent } from '../contracts/typechain/V2'
import { V2__factory } from '../contracts/typechain/factories'
import { TOKENS } from '../constants/tokenIds'
import { GetPrice } from '../integrations/prices'

export async function TrackWithdraws(
  discordClient: Client<boolean>,
  telegramClient: Telegraf<Context<Update>>,
  twitterClient: TwitterApi,
  genericEvent: GenericEvent,
): Promise<void> {
  const event = parseEvent(genericEvent as ProcessWithdrawalEvent)
  const vault = VAULTS.find((v) => v.vaultAddress.toLowerCase() == event.address.toLowerCase())

  if (!vault) {
    console.log('Error finding vault')
    return
  }

  const depositToken = TOKENS[vault.depositTokenAddress.toLowerCase()]

  if (!depositToken) {
    console.log('Error finding deposit token')
    return
  }

  const price = GetPrice(vault.depositTokenAddress.toLowerCase())
  const amt = fromBigNumber(event.args.amount)
  const value = price * amt

  console.log(`Withdraw Value: ${value}`)

  try {
    const dto: EventDto = {
      eventType: EventType.CompleteWithdraw,
      user: event.args.user,
      asset: depositToken[1] as string,
      amt: amt,
      transactionHash: event.transactionHash,
      contractAddress: event.address,
      vault: vault,
      image: getImage(vault.vaultId),
      blockNumber: event.blockNumber,
      price: price,
      value: value,
      ens: await GetEns(event.args.user),
      isZap: false,
    }
    await BroadCast(dto, twitterClient, telegramClient, discordClient)
  } catch (ex) {
    console.log(ex)
  }
}

export function parseEvent(event: ProcessWithdrawalEvent): ProcessWithdrawalEvent {
  const parsedEvent = V2__factory.createInterface().parseLog(event)

  if ((parsedEvent.args as ProcessWithdrawalEvent['args']).length > 0) {
    event.args = parsedEvent.args as ProcessWithdrawalEvent['args']
  }
  return event
}
