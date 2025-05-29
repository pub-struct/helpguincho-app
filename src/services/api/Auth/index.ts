import { tryCatchInfra } from '@/utils/tryCatchInfra'
import { API } from '../config'
import { IUserLoginDTO } from './types'


export async function tryLogin(data: object) {
  const URL = '/auth/login/'

  const response = await tryCatchInfra({
    fn: () => API.post<IUserLoginDTO>(URL, data),
    context: {
      name: 'Login',
      url: URL,
      ...data
    },
    titleMessage: 'Erro ao realizar login',
  })

  return response.data
}
