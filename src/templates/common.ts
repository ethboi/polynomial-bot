import dayjs from 'dayjs'
import dayjsPluginUTC from 'dayjs/plugin/utc'

export function EtherScanUrl() {
  return 'https://optimistic.etherscan.io'
}

export const zapperUrl = 'https://zapper.fi/account/'

export function FN(value: number, decimals: number) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function FNS(value: number, decimals: number) {
  const sign = value > 0 ? '+' : ''

  return `${sign}${value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`
}

export function EtherScanTransactionLink(transactionHash: string) {
  return `${EtherScanUrl()}/tx/${transactionHash}`
}

export function FormattedDate(date: Date) {
  dayjs.extend(dayjsPluginUTC)
  return dayjs(date).utc().format('DD MMM YY')
}

export function FormattedDateTime(date: Date) {
  dayjs.extend(dayjsPluginUTC)
  return dayjs(date).utc().format('MMM-DD-YY HH:mm:ss') + ' UTC'
}

export function ProductLink(vaultId: string) {
  const baseUrl = 'https://earn.polynomial.fi/products/'
  return `${baseUrl}${vaultId.replace('_', '-')}`
}
