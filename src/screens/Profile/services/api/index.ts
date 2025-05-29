import { tryGetUserProfile } from '@/services/api/User'
import { rethrowIfAppError } from '@/services/errors/rethrowIfAppError'
import { factory } from '../factory'


export async function getUserProfile() {
  try {
    const response = await tryGetUserProfile()
    // console.log('RESPONSE TESTE ====>', JSON.stringify(response, null, 2))
    return factory(response)
  } catch (error) {
    throw rethrowIfAppError(error)
  }
}
