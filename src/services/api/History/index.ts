import { tryCatchInfra } from '@/utils/tryCatchInfra'
import { API } from '../config'
import { IHistoryRidesDTO } from './types'


export async function tryGetHistory() {
  const url = '/rides/me/'

  const response = await tryCatchInfra({
    fn: () => API.get<IHistoryRidesDTO>(url),
    context: { name: 'tryGetHistory' },
    titleMessage: 'Erro ao buscar histórico de corridas'
  })

  return response.data
}
