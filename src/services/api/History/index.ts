import { tryCatchInfra } from '@/utils/tryCatchInfra'
import { API } from '../config'
import { IHistoryRidesDTO } from './types'


interface IParams {
	page: number;
	page_size: number;
}

export async function tryGetHistory(params: IParams) {
  const { page, page_size } = params
  const url = `/rides/me/?page_size=${page_size}&page=${page}`

  const response = await tryCatchInfra({
    fn: () => API.get<IHistoryRidesDTO>(url),
    context: { name: 'tryGetHistory', page, page_size },
    titleMessage: 'Erro ao buscar histórico de corridas',
  })

  return response.data
}
