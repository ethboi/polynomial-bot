import { EmbedBuilder } from 'discord.js'
import { EventDto } from '../types/EventDto'
import { firstAddress } from '../utils/utils'
import { EventType } from '../constants/eventType'
import { EtherScanTransactionLink, FN, vaultNameNoEmoji, zapperUrl } from './common'

// DISCORD //
export function DepositDiscord(dto: EventDto): EmbedBuilder {
  const embed = new EmbedBuilder().setColor('#0099ff').setURL(`${EtherScanTransactionLink(dto.transactionHash)}`)
  embed
    .setThumbnail(dto.image ?? '')
    .setTitle(
      `${dto.eventType === EventType.Deposit ? '🟢' : '🔴'} $${FN(dto.value, 2)}${dto.isZap ? ' ⚡️' : ''} ${
        dto.eventType === EventType.Deposit ? 'Deposit:' : 'Withdraw:'
      } ${vaultNameNoEmoji(dto.vault.vaultId)}`,
    )
    .addFields(
      {
        name: '🏦 Amount',
        value: `> ${dto.asset !== 'sUSD' ? FN(dto.amt, 4) : FN(dto.amt, 2)}`,
        inline: false,
      },
      {
        name: '🪙 Asset',
        value: `> ${dto.asset}`,
        inline: false,
      },
      {
        name: '💵 Value (USD)',
        value: `> $${FN(dto.value, 2)}`,
        inline: false,
      },
      {
        name: '👨 User',
        value: `> ${dto.ens ? dto.ens : firstAddress(dto.user)}`,
        inline: false,
      },
    )
    .setTimestamp()

  return embed
}

export function DepositTelegram(dto: EventDto) {
  const post: string[] = []
  post.push(
    `${dto.eventType === EventType.Deposit ? '🟢' : '🔴'} #${dto.vault.vaultId} ${
      dto.eventType === EventType.Deposit ? 'Deposit:' : 'Withdraw:'
    } <a href="${EtherScanTransactionLink(dto.transactionHash)}">$${FN(dto.value, 2)}${
      dto.isZap ? ' ⚡️' : ''
    }</a> by <a href="${zapperUrl}${dto.user}">${dto.ens ? dto.ens : firstAddress(dto.user)}</a>.\n`,
  )
  return post.join('')
}

export function DepositTwitter(dto: EventDto) {
  const post: string[] = []
  post.push(
    `💵 $${FN(dto.value, 2)}${dto.asset !== 'sUSD' ? ' (' + FN(dto.amt, 2) + ' ' + dto.asset + ')' : ''}${
      dto.isZap ? ' ⚡️' : ''
    } Deposit \n\n`,
  )
  post.push(`from 🧑 ${dto.ens ? dto.ens : dto.user}\n`)
  post.push(`to 🔷 ${vaultNameNoEmoji(dto.vault.vaultId)} Vault\n\n`)
  post.push(`🔗 ${EtherScanTransactionLink(dto.transactionHash)}\n\n`)
  post.push(`Earn yield on your crypto assets today 👇\n`)
  post.push(`https://earn.polynomial.fi/`)
  return post.join('')
}
