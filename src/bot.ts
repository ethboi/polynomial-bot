import { DISCORD_ACCESS_TOKEN, DISCORD_ENABLED, TELEGRAM_ENABLED, TWITTER_ENABLED } from './secrets'
import { DiscordClient } from './clients/discordClient'
import { Client } from 'discord.js'
import { TwitterApi } from 'twitter-api-v2'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TwitterClient } from './clients/twitterClient'
import { TelegramClient } from './clients/telegramClient'
import { defaultActivity } from './integrations/discord'
import { alchemyProvider } from './clients/ethersClient'
import { TrackEvents } from './event/blockEvent'
import RpcClient from './clients/client'
import { GetApiData } from './integrations/contracts'
import { GetPrices } from './integrations/coingecko'
import { ScheduledJobs } from './schedule'

let discordClient: Client<boolean>
let twitterClient: TwitterApi
let telegramClient: Telegraf<Context<Update>>

export async function goBot() {
  const rpcClient = new RpcClient(alchemyProvider)
  await Promise.all([InitGlobals(), InitClients()])
  await TrackEvents(discordClient, telegramClient, twitterClient, rpcClient)
  ScheduledJobs(discordClient, telegramClient, twitterClient)
}

async function InitGlobals() {
  global.ENS = {}
  global.VAULT_ADDRESSES = []
  global.TOKEN_PRICES = {}
  await Promise.all([GetPrices(), GetApiData()])
}

async function InitClients() {
  SetUpTwitter()
  SetUpTelegram()
  await SetUpDiscord()
}

export async function SetUpDiscord() {
  if (DISCORD_ENABLED) {
    discordClient = DiscordClient
    discordClient.on('ready', async (client) => {
      console.debug('Discord bot is online!')
    })
    await discordClient.login(DISCORD_ACCESS_TOKEN)
    defaultActivity(discordClient)
  }
}

export function SetUpTwitter() {
  if (TWITTER_ENABLED) {
    twitterClient = TwitterClient
    twitterClient.readWrite
  }
}

export function SetUpTelegram() {
  if (TELEGRAM_ENABLED) {
    telegramClient = TelegramClient
  }
}
