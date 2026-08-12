export function formatCurrency(value: string) {
  const numericValue = value.replace(/\D/g, '')

  if (!numericValue) {
    return ''
  }

  const amount = Number(numericValue) / 100

  return amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}