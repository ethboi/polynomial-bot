/* eslint-disable no-var */
import { Vault } from './polynomial'

declare global {
  var ENS: { [key: string]: string } = {}
  var TOKEN_PRICES: { [key: string]: string } = {}
  var VAULT_ADDRESSES: string[]
  var VAULTS: Vault[]
}

export {}
