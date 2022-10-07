import { scheduleJob } from 'node-schedule'
import { GetPrices } from '../integrations/coingecko'
import { GetApiData } from '../integrations/contracts'

export function ScheduledJobs(): void {
  scheduleJob('*/20 * * * *', async () => {
    await GetPrices()
  })

  // Monday / Wednesday / Friday (as this resets each build)
  scheduleJob('0 0 * * 1,3,5', async () => {
    await GetApiData()
  })
}
