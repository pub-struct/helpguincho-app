import { FirebaseError } from 'firebase/app'
import { InfraError } from '../InfraError'


export function handleFirebaseError(error: unknown): never {
  if (error instanceof FirebaseError) {
    const code = error.code
    const message = error.message
    const stack = error.stack || ''

    const userFriendlyMessage = mapFirebaseErrorCodeToMessage(code)

    throw new InfraError({
      originalError: error,
      message: userFriendlyMessage,
      titleMessage: 'Algo deu errado no Firebase',
      metadata: {
        name: 'handleFirebaseError',
        firebaseCode: code,
        firebaseMessage: message
      },
      stack
    })
  }

  throw new InfraError({
    originalError: error,
    message: 'Erro inesperado com Firebase',
    titleMessage: 'Algo deu errado',
    metadata: {
      name: 'handleFirebaseError',
      originalType: typeof error
    }
  })
}

function mapFirebaseErrorCodeToMessage(code: string): string {
  const cleanCode = code.replace('firestore/', '')

  const mapping: Record<string, string> = {
    'cancelled': 'A operação foi cancelada.',
    'unknown': 'Erro desconhecido ocorreu.',
    'invalid-argument': 'Argumento inválido fornecido.',
    'deadline-exceeded': 'Tempo limite da operação excedido. Tente novamente.',
    'not-found': 'Documento não encontrado.',
    'already-exists': 'O documento já existe.',
    'permission-denied': 'Permissão negada para acessar os dados.',
    'resource-exhausted': 'Limite de recursos excedido. Tente novamente mais tarde.',
    'failed-precondition': 'Pré-condição falhou para a operação.',
    'aborted': 'A operação foi abortada.',
    'out-of-range': 'Valor fora do intervalo permitido.',
    'unimplemented': 'Função não implementada.',
    'internal': 'Erro interno do servidor. Tente novamente.',
    'unavailable': 'Serviço indisponível no momento. Tente mais tarde.',
    'data-loss': 'Perda de dados detectada.',
    'unauthenticated': 'Usuário não autenticado. Faça login novamente.',
  }

  return mapping[cleanCode] || 'Erro inesperado. Tente novamente.'
}
