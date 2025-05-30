import { tryGetHistory } from '@/services/api/History'
import { rethrowIfAppError } from '@/services/errors/rethrowIfAppError'
import { factory } from '../factory'


export async function getHistory(page: number = 1) {
  try {
    const response = await tryGetHistory({
      page,
      page_size: 30
    })

    return factory(response)
  } catch (error) {
    rethrowIfAppError(error)
    throw error
  }
}
