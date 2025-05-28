import { tryCatchInfra } from '@/utils/tryCatchInfra'
import { API } from '../config'
import { UserLoginResponse } from './types'


export async function login(data: object) {
  const URL = '/auth/login/'

  const response = await tryCatchInfra({
    fn: () => API.post<UserLoginResponse>(URL, data),
    context: {
      name: 'Login',
      url: URL,
      ...data
    },
    titleMessage: 'Erro ao realizar login',
  })

  return response.data
}
