import { loggerErrors } from '../logger'
import { DomainError } from './DomainError'
import { InfraError } from './InfraError'
import Toast from 'react-native-toast-message'
import { Alert } from 'react-native'
import { BaseError } from './BaseError'
import { Vibrate } from '@/utils/vibrate'


export function handleErrors(error: unknown) {
  if (error instanceof DomainError && error.name === 'DomainError') {
    Vibrate()
    Toast.show({
      type: 'info',
      text1: error.titleMessage,
      text2: error.message,
      swipeable: true,
      onPress: error.onPress ? error.onPress : undefined
    })
    return error
  }

  if (error instanceof InfraError && error.name === 'InfraError') {
    Vibrate()
    Toast.show({
      type: 'error',
      text1: error.titleMessage,
      text2: error.message,
    })
    loggerErrors(error, error.metadata)
    return error
  }

  const othersErrors = unknownErrors(error)
  const dataUnknownErrors = {
    name: 'Desconhecido',
    ErroStringify: othersErrors[0],
    ErroMessage: othersErrors[1],
    ErroResponse: othersErrors[2]
  }

  const errorTyped = error as Error
  const typedError =
    error instanceof BaseError
      ? error
      : new BaseError(errorTyped.message, 'ERRO DESCONHECIDO', dataUnknownErrors, error)

  // loggerErrors(typedError, dataUnknownErrors)

  return typedError
}

function unknownErrors(error: unknown) {
  console.error('ERRO GENERICO =====>', error)
  // eslint-disable-next-line tseslint/no-explicit-any
  const typedError = error as any
  const JSON1 = JSON.stringify(typedError, null, 2)
  const JSON2 = JSON.stringify(typedError.message, null, 2)
  const JSON3 = JSON.stringify(typedError.response, null, 2)

  Alert.alert(
    'Erro',
    `ERROR_1: ${JSON1}, ERROR_2: ${JSON2}`,
    [{
      onPress: () => {
        Toast.show({
          type: 'error',
          text1: 'Erro inesperado',
          text2: 'Entre em contato com o time de TI',
        })
      },
      text: 'Fechar'
    }]
  )

  return [JSON1, JSON2, JSON3] as const
}
