import { DISCORD_ACCESS_TOKEN, DISCORD_ENABLED, TELEGRAM_ENABLED, TWITTER_ENABLED } from './secrets'
import { DiscordClient } from './clients/discordClient'
import { Client } from 'discord.js'
import { TwitterApi } from 'twitter-api-v2'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TwitterClient } from './clients/twitterClient'
import { TelegramClient } from './clients/telegramClient'
import { defaultActivity } from './integrations/discord'
import { optimismInfuraProvider } from './clients/ethersClient'
import { TrackEvents } from './event/blockEvent'
import RpcClient from './clients/client'
import { GetApiData } from './integrations/contracts'
import { GetPrices } from './integrations/coingecko'
import { ScheduledJobs } from './schedule'

let discordClient: Client<boolean>
let twitterClient: TwitterApi
let telegramClient: Telegraf<Context<Update>>

export async function goBot() {
  const rpcClient = new RpcClient(optimismInfuraProvider)
  await InitGlobals()
  await InitClients()

  await TrackEvents(discordClient, telegramClient, twitterClient, rpcClient)
  ScheduledJobs()
}

async function InitGlobals() {
  global.ENS = {}
  global.VAULT_ADDRESSES = []
  global.TOKEN_PRICES = {}
  await GetPrices()
  await GetApiData()
}

async function InitClients() {
  await SetUpDiscord()
  await SetUpTwitter()
  await SetUpTelegram()
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

export async function SetUpTwitter() {
  if (TWITTER_ENABLED) {
    twitterClient = TwitterClient
    twitterClient.readWrite
  }
}

export async function SetUpTelegram() {
  if (TELEGRAM_ENABLED) {
    telegramClient = TelegramClient
  }
}
