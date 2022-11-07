import { Client } from 'discord.js'
import { Telegraf, Context } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TwitterApi } from 'twitter-api-v2'
import { getPrice, getImage, BroadCast } from './common'
import { EventType } from '../constants/eventType'
import { GetEns } from '../integrations/ens'
import { EventDto } from '../types/EventDto'
import fromBigNumber from '../utils/fromBigNumber'
import { Event as GenericEvent } from 'ethers'
import { ProcessDepositEvent } from '../contracts/typechain/V2'
import { V2__factory } from '../contracts/typechain/factories'
import { TOKENS } from '../constants/tokenIds'

export async function TrackDeposits(
  discordClient: Client<boolean>,
  telegramClient: Telegraf<Context<Update>>,
  twitterClient: TwitterApi,
  genericEvent: GenericEvent,
): Promise<void> {
  const event = parseEvent(genericEvent as ProcessDepositEvent)
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

  const price = getPrice(depositToken[0] as string)
  const amt = fromBigNumber(event.args.amount)
  const value = price * amt

  console.log(`Deposit Value: ${value}`)

  try {
    const dto: EventDto = {
      eventType: EventType.Deposit,
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

export function parseEvent(event: ProcessDepositEvent): ProcessDepositEvent {
  const parsedEvent = V2__factory.createInterface().parseLog(event)

  if ((parsedEvent.args as ProcessDepositEvent['args']).length > 0) {
    event.args = parsedEvent.args as ProcessDepositEvent['args']
  }
  return event
}
