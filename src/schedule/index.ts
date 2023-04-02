import { Client } from 'discord.js'
import { scheduleJob } from 'node-schedule'
import { Telegraf, Context } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TwitterApi } from 'twitter-api-v2'
import { TrackYield } from '../event/vault'
import { GetPrices } from '../integrations/prices'
import { GetApiData } from '../integrations/contracts'

export function ScheduledJobs(
  discordClient: Client<boolean>,
  telegramClient: Telegraf<Context<Update>>,
  twitterClient: TwitterApi,
): void {
  scheduleJob('*/20 * * * *', async () => {
    await GetPrices()
  })

  // Friday (as this resets each build) // 2pm FRIDAYS
  scheduleJob('0 14 * * 5', async () => {
    await GetApiData()
    await TrackYield(discordClient, telegramClient, twitterClient)
  })
}
