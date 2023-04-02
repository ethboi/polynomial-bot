import { TELEGRAM_CHANNEL, TESTNET } from '../config'
import { Context, Telegraf } from 'telegraf'

export async function PostTelegram(
  post: string,
  telegramClient: Telegraf<Context>,
  channel: string = TELEGRAM_CHANNEL,
  disablePreview = true,
) {
  if (TESTNET) {
    console.log(post)
  } else {
    try {
      const response = await telegramClient.telegram.sendMessage(channel, post, {
        parse_mode: 'HTML',
        disable_web_page_preview: disablePreview,
      })
    } catch (e: any) {
      console.log(e)
    }
  }
}
