import { Client } from 'discord.js'
import { scheduleJob } from 'node-schedule'
import { Telegraf, Context } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TwitterApi } from 'twitter-api-v2'
import { TrackYield } from '../event/vault'
import { GetPrices } from '../integrations/coingecko'
import { GetApiData } from '../integrations/contracts'

export function ScheduledJobs(
  discordClient: Client<boolean>,
  telegramClient: Telegraf<Context<Update>>,
  twitterClient: TwitterApi,
): void {
  scheduleJob('*/20 * * * *', async () => {
    await GetPrices()
  })

  // Monday / Wednesday / Friday (as this resets each build)
  scheduleJob('0 0 * * 1,3,5', async () => {
    await GetApiData()
    await TrackYield(discordClient, telegramClient, twitterClient)
  })
}
