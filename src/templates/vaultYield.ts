import { EmbedBuilder } from 'discord.js'
import { VaultsDto } from '../types/EventDto'
import { FN, ProductLink, vaultName, WeeklyPercent } from './common'

// DISCORD //
export function VaultYieldDiscord(dto: VaultsDto): EmbedBuilder {
  const embed = new EmbedBuilder().setColor('#0099ff')

  embed.setTitle(`Earn Vaults Weekly Performance`).setTimestamp()
  embed.setDescription('🎉 The vaults keep printing yield for users and distributed 💸')
  dto.vaults.map((vault) => {
    embed.addFields({
      name: `${vaultName(vault.vaultId)}`,
      value: `> 🔹 *Last week* **~${FN(WeeklyPercent(Number(vault.lastWeekApy)), 2)}%**\n> 🔹 *APY* **~${FN(
        Number(vault.lastWeekApy) * 100,
        2,
      )}%**\n> 🔸 [deposit into vault](${ProductLink(vault.vaultId)})`,
      inline: false,
    })
  })
  embed.setImage('https://raw.githubusercontent.com/ethboi/assets/main/polynomial-earn-vaults.jpg')
  return embed
}

// TELEGRAM //
export function VaultYieldTelegram(dto: VaultsDto) {
  const post: string[] = []
  post.push('<strong>Earn Vaults Weekly Performance</strong>\n\n')
  post.push(`🎉 The vaults keep printing yield for users and distributed 💸\n\n`)
  dto.vaults.map((vault, index) => {
    post.push(
      `<strong>${vaultName(vault.vaultId)}</strong>\n ~${FN(WeeklyPercent(Number(vault.lastWeekApy)), 2)}% (~${FN(
        Number(vault.lastWeekApy) * 100,
        2,
      )}% APY)\n${index != dto.vaults.length - 1 ? '\n' : ''}`,
    )
  })
  post.push(`<a href="https://raw.githubusercontent.com/ethboi/assets/main/polynomial-earn-vaults.jpg">&#8205;</a>`)
  return post.join('')
}

// TWITTER //
export function VaultYieldTwitter(dto: VaultsDto) {
  const post: string[] = []
  post.push(`🎉 The vaults keep printing yield for users and distributed 💸\n\n`)
  dto.vaults.map((vault) => {
    post.push(
      `${vaultName(vault.vaultId)}: ~${FN(WeeklyPercent(Number(vault.lastWeekApy)), 2)}% (~${FN(
        Number(vault.lastWeekApy) * 100,
        2,
      )}% APY)\n`,
    )
  })
  return post.join('')
}
