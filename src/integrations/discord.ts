import { ActivityType, Client, EmbedBuilder, TextChannel } from 'discord.js'
import { TESTNET } from '../secrets'
import printObject from '../utils/printObject'

export async function PostDiscord(embeds: EmbedBuilder[], client: Client<boolean>, channelName: string) {
  if (TESTNET) {
    printObject(embeds)
  } else {
    try {
      //printObject(client.channels.cache)
      const channels = client.channels.cache
        .filter((value) => (value as TextChannel)?.name == channelName)
        .map(async (channel) => {
          console.log(`found channel: ${channelName}`)
          await (channel as TextChannel).send({ embeds: embeds })
        })
    } catch (e: any) {
      console.log(e)
    }
  }
}

export async function defaultActivity(client: Client<boolean>) {
  client.user?.setActivity(`Deposit & Withdraw`, { type: ActivityType.Watching })
}
