import { tryCatchInfra } from '@/utils/tryCatchInfra'
import { API } from '../config'
import { IUserLoginDTO } from './types'
import { factoryLogin } from '@/screens/Login/services/factory'
import { rethrowIfAppError } from '@/services/errors/rethrowIfAppError'


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

export async function tryValidateAccessToken(token: string) {
  const url = '/auth/session/'
  console.log('TOKEN DEVIDE ===>', token)

  const response = await tryCatchInfra({
    fn: () => API.post<IUserLoginDTO>(url, undefined, {
      headers: {
        Authorization: `Token ${token}`
      }
    }),
    context: { name: 'validateAccessToken', token },
    titleMessage: 'Erro ao validar o token'
  })

  return response.data
}

export async function validateAccessToken(token: string) {
  try {
    const response = await tryValidateAccessToken(token)
    // console.log('RESPONSE VALIDATE =====>', JSON.stringify(x, null, 2))

    return factoryLogin(response)
  } catch (e) {
    rethrowIfAppError(e)
    throw e
  }
}
