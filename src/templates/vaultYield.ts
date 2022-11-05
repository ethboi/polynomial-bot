import { EmbedBuilder } from 'discord.js'
import { EventDto, VaultDto, VaultsDto } from '../types/EventDto'
import { firstAddress, shortAddress } from '../utils/utils'
import { EventType } from '../constants/eventType'
import { emoji, EtherScanTransactionLink, FN, ProductLink, vaultName, zapperUrl } from './common'
import { Vault } from '../types/polynomial'
import { BigNumber } from 'ethers'
import fromBigNumber from '../utils/fromBigNumber'

// DISCORD //
export function VaultYieldDiscord(dto: VaultsDto): EmbedBuilder {
  const embed = new EmbedBuilder().setColor('#0099ff')

  embed.setTitle(`✨ Earn Vault Yields`).setTimestamp()

  dto.vaults.map((vault) => {
    embed.addFields({
      name: `${vaultName(vault.vaultId)}`,
      value: `> 🔹 *APR* **${FN((vault.averageApy as unknown as number) * 100, 2)}%**\n> 🔹 *Last Week* **${FN(
        (Number(vault.lastWeekApy) as number) * 100,
        2,
      )}%**\n> 🔸 [deposit into vault](${ProductLink(vault.vaultId)})`,
      inline: false,
    })
  })

  return embed
}

export function VaultYieldTelegram(dto: VaultsDto) {
  const post: string[] = []
  post.push(`✨ Earn Vault Yields\n\n`)
  dto.vaults.map((vault) => {
    post.push(
      `${vaultName(vault.vaultId)}:\n🔹 ${FN((vault.averageApy as unknown as number) * 100, 2)}% (Last Week: ${FN(
        (Number(vault.lastWeekApy) as number) * 100,
        2,
      )}%)\n\n`,
    )
  })
  return post.join('')
}

export function VaultYieldTwitter(dto: VaultsDto) {
  const post: string[] = []
  post.push(`✨ Polynomial Earn Vault Yields\n\n`)
  dto.vaults.map((vault) => {
    post.push(
      `${vaultName(vault.vaultId)}:\n🔹 ${FN((vault.averageApy as unknown as number) * 100, 2)}% (Last Week: ${FN(
        (Number(vault.lastWeekApy) as number) * 100,
        2,
      )}%)\n\n`,
    )
  })

  post.push(`Earn yield on your crypto assets today 👇\n`)
  post.push(`https://earn.polynomial.fi/`)
  return post.join('')
}
