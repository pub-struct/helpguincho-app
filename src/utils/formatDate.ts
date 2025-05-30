import { InfraError } from '@/services/errors/InfraError'
import { format as formatFNS } from 'date-fns'


export function formatDate(date: string, format?: string) {
  try {
    if (!date) return ''

    return formatFNS(new Date(date), format || 'dd/MM/yyyy')
  } catch (error) {
    throw new InfraError({
      originalError: error,
      titleMessage: 'Erro ao formatar data',
      message: '',
      metadata: {
        name: 'function formatDate',
        date,
        ...(format && {
          formato: format,
        }),
      },
    })
  }
}
