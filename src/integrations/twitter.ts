import { TwitterApi } from 'twitter-api-v2'
import { TESTNET } from '../secrets'
import printObject from '../utils/printObject'

export async function SendTweet(tweet: string, mediaId: string | undefined, twitterApi: TwitterApi) {
  if (TESTNET) {
    console.log(tweet)
  } else {
    try {
      //const test = await twitterApi.v1.singleTweet('1589549658980118530')
      const response = await twitterApi.v1.tweet(tweet, { media_ids: mediaId })
      console.log(response.id)
      //printObject(test)
    } catch (e: any) {
      console.log(e)
    }
  }
}
