import { tryCatchInfra } from '@/utils/tryCatchInfra'
import { API } from '../config'
import { IUserLoginDTO } from '../Auth/types'


export async function tryGetUserProfile() {
  const url = '/auth/me/'

  const response = await tryCatchInfra({
    fn: () => API.get<Omit<IUserLoginDTO, 'token'>>(url),
    context: { name: 'tryGetUserProfile' },
    titleMessage: 'Erro ao buscar perfil do usuario'
  })

  return response.data
}
