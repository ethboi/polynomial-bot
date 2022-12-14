import * as dotenv from 'dotenv'
import * as _ from 'lodash'
import { convertToBoolean } from '../utils/utils'

dotenv.config({ path: '.env' })

export const TESTNET: boolean = _.defaultTo(convertToBoolean(process.env.TESTNET as string), true) as boolean

export const INFURA_ID = _.defaultTo(process.env.INFURA_ID, '')
export const INFURA_ID_OPTIMISM = _.defaultTo(process.env.INFURA_ID_OPTIMISM, '')
export const ALCHEMY_ID = _.defaultTo(process.env.ALCHEMY_ID, '')

export const LOG_TOKEN = _.defaultTo(process.env.LOG_TOKEN, '')
export const LOG_CHANNEL = _.defaultTo(process.env.LOG_CHANNEL, '')

export const TWITTER_APP_KEY = _.defaultTo(process.env.TWITTER_APP_KEY, '')
export const TWITTER_APP_SECRET = _.defaultTo(process.env.TWITTER_APP_SECRET, '')
export const TWITTER_ACCESS_TOKEN = _.defaultTo(process.env.TWITTER_ACCESS_TOKEN, '')
export const TWITTER_ACCESS_SECRET = _.defaultTo(process.env.TWITTER_ACCESS_SECRET, '')

export const DISCORD_ACCESS_TOKEN = _.defaultTo(process.env.DISCORD_ACCESS_TOKEN, '')

export const TELEGRAM_ACCESS_TOKEN = _.defaultTo(process.env.TELEGRAM_ACCESS_TOKEN, '')
export const TELEGRAM_CHANNEL = _.defaultTo(process.env.TELEGRAM_CHANNEL, '')

export const TWITTER_THRESHOLD = _.defaultTo(process.env.TWITTER_THRESHOLD, 500)
export const TELEGRAM_THRESHOLD = _.defaultTo(process.env.TELEGRAM_THRESHOLD, 100)
export const DISCORD_THRESHOLD = _.defaultTo(process.env.DISCORD_THRESHOLD, 100)

export const TWITTER_ENABLED: boolean = _.defaultTo(
  convertToBoolean(process.env.TWITTER_ENABLED as string),
  false,
) as boolean
export const TELEGRAM_ENABLED: boolean = _.defaultTo(
  convertToBoolean(process.env.TELEGRAM_ENABLED as string),
  true,
) as boolean
export const DISCORD_ENABLED: boolean = _.defaultTo(
  convertToBoolean(process.env.DISCORD_ENABLED as string),
  true,
) as boolean
