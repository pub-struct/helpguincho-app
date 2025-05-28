import { BaseError } from './BaseError'
// import { loggerErrors } from '../logger'


export function registerGlobalErrorHandler() {
  // 🔥 1. Erros não tratados no JS global
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    const errorMessage = error?.message || 'Erro desconhecido'
    const errorStack = error?.stack || ''

    const data = {
      message: errorMessage,
      stack: errorStack,
      titleMessage: isFatal ? 'Erro Fatal' : 'Erro Não Fatal',
      originalError: error,
      metadata: {
        name: 'function registerGlobalErrorHandler - ErrorUtils',
        isFatal
      },
      name: 'BaseError',
      isAppError: true
    } as BaseError

    // loggerErrors(data, data.metadata)
  })

  // ✅ Promises rejeitadas não tratadas
  // window.addEventListener('unhandledrejection', event => {
  //   event.preventDefault?.() // Evita crash feio
  //   const errorMessage = event.reason?.message || 'Erro desconhecido'

  //   const data = {
  //     message: errorMessage,
  //     stack: event.reason?.stack || '',
  //     titleMessage: 'Promise Rejeitada Não Tratada',
  //     originalError: event.reason,
  //     metadata: {
  //       name: 'function registerGlobalErrorHandler - unhandledrejection',
  //       eventReason: event.reason
  //     },
  //     name: 'BaseError'
  //   } as BaseError

  //   loggerErrors(data, data.metadata)
  // })

  // ✅ (Opcional) Captura erros globais (Hermes / Web / Android)
  if (typeof globalThis.addEventListener === 'function') {
    globalThis.addEventListener('error', (event: ErrorEvent) => {
      const error = event.error instanceof Error ? event.error : new Error(String(event.message))

      const data = {
        message: error.message,
        stack: error.stack || '',
        titleMessage: 'Erro Não Capturado (Global)',
        originalError: error,
        metadata: {
          name: 'function registerGlobalErrorHandler - global error event',
          event: JSON.stringify(event, null, 2)
        },
        name: 'BaseError',
        isAppError: true
      } as BaseError

      // loggerErrors(data, data.metadata)
    })
  }

  // 🔥 2. Promises rejeitadas sem catch (em navegadores e engines que suportam)
  if (typeof globalThis.addEventListener === 'function') {
    globalThis.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      const reason = event.reason instanceof Error ? event.reason : new Error(String(event.reason))

      const data = {
        message: reason.message || 'Erro desconhecido',
        stack: reason.stack || '',
        titleMessage: 'Promise Rejeitada Não Tratada',
        originalError: reason,
        metadata: {
          name: 'registerGlobalErrorHandler - unhandledrejection',
          eventReason: event.reason
        },
        name: 'BaseError',
        isAppError: true
      } as BaseError

      // loggerErrors(data, data.metadata)
    })
  }

  // 🔥 3. Promises rejeitadas sem catch (compatível com Hermes)
  if (typeof process?.on === 'function') {
    process.on('unhandledRejection', (reason) => {
      const err = reason instanceof Error ? reason : new Error(String(reason))

      const data = {
        message: err.message || 'Erro desconhecido',
        stack: err.stack || '',
        titleMessage: 'Promise Rejeitada Não Tratada (Hermes)',
        originalError: err,
        metadata: {
          name: 'registerGlobalErrorHandler - unhandledRejection (Hermes)',
          reason
        },
        name: 'BaseError',
        isAppError: true
      } as BaseError

      // loggerErrors(data, data.metadata)
    })
  }

  // 🔥 4. Erros não tratados em Event Listeners
  if (typeof globalThis.addEventListener === 'function') {
    globalThis.addEventListener('error', (event: ErrorEvent) => {
      const error = event.error instanceof Error
        ? event.error
        : new Error(String(event.message))

      const data = {
        message: error.message || 'Erro desconhecido',
        stack: error.stack || '',
        titleMessage: 'Erro Não Capturado em Event Listener',
        originalError: error,
        metadata: {
          name: 'registerGlobalErrorHandler - error event',
          eventMessage: event.message
        },
        name: 'BaseError',
        isAppError: true
      } as BaseError

      // loggerErrors(data, data.metadata)
    })
  }
}
