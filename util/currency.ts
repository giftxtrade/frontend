export default function numberToCurrency(value: number, currency: string = 'USD', locales: string = 'en-US'): string {
  return new Intl
    .NumberFormat(locales, { style: 'currency', currency: currency })
    .format(value)
}