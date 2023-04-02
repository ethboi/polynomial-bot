import axios from 'axios'
import { urls } from '../constants/urls'
import { Dexscreener } from '../types/dexscreener'

export async function GetPrices(): Promise<void> {
  try {
    const addresses = [...new Set(global.VAULTS.map((x) => x.depositTokenAddress.toLowerCase()))]

    addresses.map(async (address) => {
      const dexscreenerData = (await axios.get(`${urls.dexscreenerUrl}${address}`)).data as Dexscreener
      const pair = dexscreenerData.pairs.find((pair) => pair.baseToken.address.toLowerCase() == address.toLowerCase())
      if (pair) {
        TOKEN_PRICES[address.toLowerCase()] = Number(pair.priceUsd)
      } else {
        console.log(`No pair found: ${address}`)
      }
    })
  } catch (error) {
    console.log(error)
  }
}

export function GetPrice(address: string): number {
  return TOKEN_PRICES[address.toLowerCase()] as unknown as number
}
