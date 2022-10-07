import { TwitterApi } from 'twitter-api-v2'
import { TESTNET } from '../secrets'

export async function SendTweet(tweet: string, twitterApi: TwitterApi) {
  if (TESTNET) {
    console.log(tweet)
  } else {
    try {
      const response = await twitterApi.v1.tweet(tweet)
      console.log(response.id)
    } catch (e: any) {
      console.log(e)
    }
  }
}
