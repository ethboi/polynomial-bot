import dayjs from 'dayjs'
import dayjsPluginUTC from 'dayjs/plugin/utc'
import _ from 'lodash'

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

export function emoji(vaultId: string) {
  if (vaultId === 'ETH_PUT_SELLING') {
    return '🐂'
  }
  if (vaultId === 'ETH_CALL_SELLING') {
    return '🐻'
  }
  if (vaultId === 'ETH_CALL_SELLING_QUOTE') {
    return '🐻‍❄️'
  }

  return ''
}

export function vaultName(vaultId: string) {
  const cased = _.startCase(_.lowerCase(vaultId.replace(/_/g, ' ')))
  return `${emoji(vaultId)} s${cased}`
}

export function WeeklyPercent(apr: number) {
  // vault APR
  // raise to 1/52 power -  compounded weekly
  return (Math.pow(Number(apr) + 1, 1 / 52) - 1) * 100
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
