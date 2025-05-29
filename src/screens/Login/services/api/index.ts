import { tryLogin } from '@/services/api/Auth'
import { rethrowIfAppError } from '@/services/errors/rethrowIfAppError'
import { factoryLogin } from '../factory'


export async function login(data: object) {
  try {
    const response = await tryLogin(data)

    return factoryLogin(response)
  } catch (error) {
    throw rethrowIfAppError(error)
  }
}
