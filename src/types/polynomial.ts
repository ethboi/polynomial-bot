export type Data = {
  data: Vault[]
}

export type Vault = {
  tokenAddress: string
  vaultAddress: string
  vaultId: string
  vaultType: string
  apy: string
  averageApy: string
  optimisticApy: string
  lastWeekApy: string
  totalFunds: string
  usedFunds: string
  vaultSpecificData: VaultSpecificData
  maxCapacity: string
  minDepositLimit: string
  depositTokenAddress: string
}

export type VaultSpecificData = {
  totalPremiumCollected?: string
  collateralizationRatio?: string
  netDelta: string
  totalQueuedDeposits: string
  totalQueuedWithdrawals: string
  collateralization?: string
  positionData?: PositionData
}

export type PositionData = {
  strikeId: string
  positionId: string
  optionAmount: string
  premiumPaid: string
  shortAmount: string
  totalMargin: string
  strikePrice: string
  expiry: string
}
