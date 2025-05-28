type FormatCurrencyOptions = {
  currencySymbol?: string       // Ex: "R$", "$", "€"
  showSymbol?: boolean          // Exibe ou oculta o símbolo
  symbolPosition?: 'left' | 'right'  // Posição do símbolo
  decimalSeparator?: string     // Ex: "," ou "."
  thousandSeparator?: string    // Ex: "." ou ","
  decimalPlaces?: number        // Quantidade de casas decimais
  padDecimals?: boolean         // Preenche com zeros no final
}

export function formatCurrency(
  input: number | string,
  options: FormatCurrencyOptions = {}
): string {
  const {
    currencySymbol = 'R$',
    showSymbol = true,
    symbolPosition = 'left',
    decimalSeparator = ',',
    thousandSeparator = '.',
    decimalPlaces = 2,
    padDecimals = true
  } = options

  const raw = typeof input === 'string' ? parseFloat(input) : input
  const isNegative = raw < 0
  const abs = Math.abs(raw)

  let [intPart, decimalPart] = abs.toFixed(decimalPlaces).split('.')

  // Adiciona separadores de milhar
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)

  // Ajuste decimal (com ou sem zeros no final)
  if (!padDecimals) {
    decimalPart = decimalPart.replace(/0+$/, '')
    if (decimalPart === '') decimalPart = '0'
  }

  let formatted = `${intPart}${decimalSeparator}${decimalPart}`

  if (showSymbol) {
    formatted =
      symbolPosition === 'left'
        ? `${currencySymbol} ${formatted}`
        : `${formatted} ${currencySymbol}`
  }

  if (isNegative) formatted = `- ${formatted}`

  return formatted
}
