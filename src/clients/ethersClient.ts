import { ethers } from 'ethers'
import { INFURA_ID, INFURA_ID_OPTIMISM, ALCHEMY_ID } from '../secrets'

const network = 'mainnet'
export const mainNetInfuraProvider = new ethers.providers.InfuraProvider(network, INFURA_ID)
export const optimismInfuraProvider = new ethers.providers.InfuraProvider(10, INFURA_ID_OPTIMISM)
export const alchemyProvider = new ethers.providers.AlchemyProvider(10, ALCHEMY_ID)

export const optimsimProvider = new ethers.providers.JsonRpcProvider(
  { url: 'https://mainnet.optimism.io', throttleLimit: 1 },
  10,
)
