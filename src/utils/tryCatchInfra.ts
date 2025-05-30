import { ValidationError } from '@/@types/Errors'
import { ErrorMetadata } from '@/services/errors/BaseError'
import { getAxiosMessage } from '@/services/errors/custom/getErrors'
import { InfraError } from '@/services/errors/InfraError'
import { isAxiosError } from 'axios'


type AsyncFunction<T> = () => Promise<T>

interface IParams<T> {
  fn: AsyncFunction<T>
  errorMessage?: string
  titleMessage: string
  context: ErrorMetadata
}

export async function tryCatchInfra<T>(params: IParams<T>): Promise<T> {
  const { context, errorMessage = '', fn, titleMessage } = params

  try {
    return await fn()
  } catch (error) {
    if (isAxiosError<ValidationError>(error)) {
      const contextAxios = {
        url: `${error.config?.baseURL ?? ''}${error.config?.url ?? ''}`,
        status: error.request.status
      }
      const message = getAxiosMessage(error)
      // console.log('AUTH ==>', JSON.stringify(error.request, null, 2))
      throw new InfraError({
        titleMessage,
        message: message,
        metadata: { ...contextAxios, ...context },
        originalError: error
      })
    }

    throw new InfraError({
      titleMessage,
      message: errorMessage,
      metadata: context,
      originalError: error
    })
  }
}
