import axios from 'axios'
import { urls } from '../constants/urls'
import { Data } from '../types/polynomial'

export const GetApiData = async () => {
  const apiData = (await axios.get(urls.polynomialApiUrl)) as Data
  global.VAULTS = apiData.data
  console.log(global.VAULTS)
  global.VAULT_ADDRESSES = apiData.data.reduce((vaults, vault) => {
    const vaultAddress = vault?.vaultAddress.toLowerCase()
    if (vaultAddress) {
      vaults.push(vaultAddress)
    }
    return vaults
  }, [] as string[])
}
