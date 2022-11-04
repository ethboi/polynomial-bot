import { EmbedBuilder } from 'discord.js'
import { EventDto, VaultDto, VaultsDto } from '../types/EventDto'
import { firstAddress, shortAddress } from '../utils/utils'
import { EventType } from '../constants/eventType'
import { emoji, EtherScanTransactionLink, FN, zapperUrl } from './common'
import { Vault } from '../types/polynomial'
import { BigNumber } from 'ethers'
import fromBigNumber from '../utils/fromBigNumber'

// DISCORD //
export function VaultStatsDiscord(dto: VaultDto): EmbedBuilder {
  const embed = new EmbedBuilder().setColor('#0099ff')

  embed.setTitle(`🎉 Earn Vault Yields`).setTimestamp()

  return embed
}

export function VaultStatsTwitter(dto: VaultDto) {
  const vault = dto.vault
  const post: string[] = []
  post.push(`$${vault.vaultId.replace(/_/g, ' ')}\n`)
  post.push(`💵 APY ${FN((vault.apy as unknown as number) * 100, 2)}%\n`)
  post.push(`📈 Last Week APY ${FN(Number(vault.lastWeekApy), 2)}%\n`)
  post.push(`🏦 Total Funds ${FN(dto.totalFunds, 2)} $${dto.asset} ($${FN(dto.totalFundsValue, 2)}) \n`)
  post.push(`🏦 Used Funds ${FN(dto.usedFunds, 2)} $${dto.asset} ($${FN(dto.usedFundsValue, 2)})\n`)
  post.push(`💰 Total Premium Collected ${FN(dto.totalPremiumCollected, 2)}  $${dto.asset}\n`)
  post.push(`📊 Colat Ratio ${FN(Number(dto.collateralizationRatio) * 100, 0)}% \n`)
  post.push(`🪙 Queued Deposits $${FN(Number(dto.totalQueuedDeposits), 2)}\n`)
  post.push(`🔒 Collateralization  ${FN(Number(vault.vaultSpecificData.collateralization), 2)}%\n`)

  post.push(`Earn yield on your crypto assets today 👇\n`)
  post.push(`https://earn.polynomial.fi/`)
  return post.join('')
}
