import { EventType } from '../constants/eventType'
import { Vault } from './polynomial'

export type BaseEvent = {
  value: number
  eventType: EventType
}

export type EventDto = BaseEvent & {
  asset: string
  amt: number
  user: string
  transactionHash: string
  contractAddress: string
  image: string | null
  blockNumber: number
  timestamp: Date
  price: number
  ens: string
  vault: Vault
}
