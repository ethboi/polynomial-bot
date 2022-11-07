import { Client, EmbedBuilder } from 'discord.js'
import { Telegraf, Context } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TwitterApi } from 'twitter-api-v2'
import { DiscordChannels } from '../constants/discordChannels'
import { EventType } from '../constants/eventType'
import { PostDiscord } from '../integrations/discord'
import { PostTelegram } from '../integrations/telegram'
import { SendTweet } from '../integrations/twitter'
import {
  TWITTER_ENABLED,
  TWITTER_THRESHOLD,
  TELEGRAM_ENABLED,
  TELEGRAM_THRESHOLD,
  DISCORD_ENABLED,
  DISCORD_THRESHOLD,
} from '../secrets'
import { BaseEvent, EventDto, VaultDto, VaultsDto } from '../types/EventDto'
import { DepositTwitter, DepositTelegram, DepositDiscord } from '../templates/deposit'
import { VaultStatsDiscord, VaultStatsTwitter } from '../templates/vaultStats'
import { VaultYieldDiscord, VaultYieldTelegram, VaultYieldTwitter } from '../templates/vaultYield'
import { media } from '../constants/twitter'

export function getPrice(coingeckoId: string): number {
  console.log(coingeckoId)
  const price = TOKEN_PRICES[coingeckoId] as unknown as number
  return price
}

export function getImage(vaultId: string) {
  switch (vaultId) {
    case 'SETH_CALL_SELLING':
    case 'ETH_CALL_SELLING':
      return 'https://earn.polynomial.fi/imgs/products/eth-logo.png'
    case 'SETH_PUT_SELLING':
    case 'ETH_PUT_SELLING':
      return 'https://raw.githubusercontent.com/ethboi/assets/main/usd-vault.png'
    case 'SETH_CALL_SELLING_QUOTE':
    case 'ETH_CALL_SELLING_QUOTE':
      return 'https://earn.polynomial.fi/imgs/products/call-selling-quote-logo.png'
    case 'GAMMA':
      return 'https://raw.githubusercontent.com/ethboi/assets/main/gamma-vault-logo.png'
    case 'BTC_CALL_SELLING':
      return 'https://earn.polynomial.fi/imgs/products/cold-btc.png'
    case 'BTC_PUT_SELLING':
      return 'https://earn.polynomial.fi/imgs/products/usd-btc.png'
  }
  return null
}

export async function BroadCast<T extends BaseEvent>(
  dto: T,
  twitterClient: TwitterApi,
  telegramClient: Telegraf<Context<Update>>,
  discordClient: Client<boolean>,
): Promise<void> {
  if (TWITTER_ENABLED) {
    let post = ''
    let mediaId: string | undefined

    //YIELD
    if (dto.eventType === EventType.VaultYield) {
      mediaId = media.weeklyAPR
      post = VaultYieldTwitter(dto as unknown as VaultsDto)
    }

    //STATS
    if (dto.eventType === EventType.VaultStats) {
      post = VaultStatsTwitter(dto as unknown as VaultDto)
    }

    //DEPOSITS
    if (dto.value >= TWITTER_THRESHOLD) {
      if (dto.eventType == EventType.Deposit) {
        post = DepositTwitter(dto as unknown as EventDto)
      }
    }

    if (post != '') {
      await SendTweet(post, mediaId, twitterClient)
    }
  }

  if (TELEGRAM_ENABLED) {
    //YIELD
    let post = ''

    if (dto.eventType === EventType.VaultYield) {
      post = VaultYieldTelegram(dto as unknown as VaultsDto)
    }

    //STATS
    if (dto.eventType === EventType.VaultStats) {
      //  post = VaultStatsDiscord(dto as unknown as VaultDto)
    }

    // DEPOSITS
    if (dto.eventType === EventType.Deposit) {
      if (dto.value >= TELEGRAM_THRESHOLD) {
        post = DepositTelegram(dto as unknown as EventDto)
      }
    }
    if (post != '') {
      await PostTelegram(post, telegramClient)
    }
  }

  if (DISCORD_ENABLED) {
    let embed: EmbedBuilder[] = []
    let channel = ''

    //YIELD
    if (dto.eventType === EventType.VaultYield) {
      channel = DiscordChannels.Vaults
      embed = [VaultYieldDiscord(dto as unknown as VaultsDto)]
    }

    //STATS
    if (dto.eventType === EventType.VaultStats) {
      channel = DiscordChannels.Vaults
      embed = [VaultStatsDiscord(dto as unknown as VaultDto)]
    }

    //DEPOSITS
    if (dto.eventType === EventType.Deposit || dto.eventType == EventType.CompleteWithdraw) {
      if (dto.value >= DISCORD_THRESHOLD) {
        embed = [DepositDiscord(dto as unknown as EventDto)]
        channel = dto.eventType === EventType.Deposit ? DiscordChannels.Deposit : DiscordChannels.Withdrawal
      }
    }
    if (embed.length > 0) {
      await PostDiscord(embed, discordClient, channel)
    }
  }
}
