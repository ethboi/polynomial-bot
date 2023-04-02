import { TwitterApi } from 'twitter-api-v2'
import { TESTNET } from '../config'
import printObject from '../utils/printObject'

export async function SendTweet(tweet: string, mediaId: string | undefined, twitterApi: TwitterApi) {
  if (TESTNET) {
    console.log(tweet)
  } else {
    try {
      const response = await twitterApi.v1.tweet(tweet, { media_ids: mediaId })
      console.log(response.id)
      //printObject(test)
    } catch (e: any) {
      console.log(e)
    }
  }
}
