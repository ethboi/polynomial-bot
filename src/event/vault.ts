import { Client } from 'discord.js'
import { BigNumber } from 'ethers'
import { Telegraf, Context } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TwitterApi } from 'twitter-api-v2'
import { EventType } from '../constants/eventType'
import { TOKENS } from '../constants/tokenIds'
import { VaultDto, VaultsDto } from '../types/EventDto'
import { Vault } from '../types/polynomial'
import fromBigNumber from '../utils/fromBigNumber'
import { BroadCast, getPrice } from './common'

// OLD VAULTS
const excludedVaults = ['SETH_CALL_SELLING', 'SETH_PUT_SELLING', 'SETH_CALL_SELLING_QUOTE', 'GAMMA']

export async function TrackYield(
  discordClient: Client<boolean>,
  telegramClient: Telegraf<Context<Update>>,
  twitterClient: TwitterApi,
): Promise<void> {
  const vaults: Vault[] = []

  VAULTS.map((vault) => {
    if (!excludedVaults.includes(vault.vaultId)) {
      return vaults.push(vault)
    }
  })

  const dto: VaultsDto = {
    value: 0,
    vaults: vaults,
    eventType: EventType.VaultYield,
  }

  await BroadCast(dto, twitterClient, telegramClient, discordClient)
}

export async function TrackStats(
  discordClient: Client<boolean>,
  telegramClient: Telegraf<Context<Update>>,
  twitterClient: TwitterApi,
): Promise<void> {
  VAULTS.map(async (vault) => {
    if (!excludedVaults.includes(vault.vaultId)) {
      const depositToken = TOKENS[vault.depositTokenAddress.toLowerCase()]
      const price = getPrice(depositToken[0] as string)
      const decimals = depositToken[2] as number
      const totalFunds = fromBigNumber(vault.totalFunds as unknown as BigNumber, decimals)
      const usedFunds = fromBigNumber(vault.usedFunds as unknown as BigNumber, decimals)
      const totalPremiumCollected = fromBigNumber(
        vault.vaultSpecificData.totalPremiumCollected as unknown as BigNumber,
        decimals,
      )
      const totalFundsValue = totalFunds * price
      const usedFundsValue = usedFunds * price
      const colatRatio = fromBigNumber(vault.vaultSpecificData.collateralizationRatio as unknown as BigNumber, decimals)
      const totalQueuedDeposits = fromBigNumber(vault.vaultSpecificData.totalQueuedDeposits as unknown as BigNumber, 14)
      const totalQueuedWithdrawals = fromBigNumber(
        vault.vaultSpecificData.totalQueuedWithdrawals as unknown as BigNumber,
        14,
      )

      const vaultDto: VaultDto = {
        value: 0,
        vault: vault as Vault,
        eventType: EventType.VaultStats,
        price: price,
        decimals: depositToken[2] as number,
        asset: depositToken[1] as string,
        totalFunds: totalFunds,
        totalFundsValue: totalFundsValue,
        usedFunds: usedFunds,
        usedFundsValue: usedFundsValue,
        totalPremiumCollected: totalPremiumCollected,
        collateralizationRatio: colatRatio,
        totalQueuedDeposits: totalQueuedDeposits,
        totalQueuedWithdrawals: totalQueuedWithdrawals,
      }
      console.log(vaultDto)

      // await BroadCast(vaultDto, twitterClient, telegramClient, discordClient)
    }
  })
}
