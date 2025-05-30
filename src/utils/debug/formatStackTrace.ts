import { parse } from 'stacktrace-parser'
import { Platform } from 'react-native'
import { BaseError } from '@/services/errors/BaseError'
import { colorTerminal } from './colorTerminal'

/**
 * Detecta se o app está usando Hermes Engine
 */
function isHermes() {
  // eslint-disable-next-line tseslint/no-explicit-any
  return !!(global as any).HermesInternal
}

function cleanFileName(file?: string | null) {
  if (!file) return ''

  return file
    .replace(/^.*?index\.ts\.bundle\/?/, '') // Remove index.ts.bundle e tudo antes
    .replace(/^http:\/\/.*?\//, '') // Remove http://192.168.x.x:8081/
    .replace(/^node_modules\/expo\/AppEntry\.bundle\/?/, '') // Remove node_modules/expo/AppEntry.bundle/
    .replace(/^node_modules\/expo\/AppEntry\.bundle\/?/, '') // Expo entry
    .replace(/^\/+/, '') // Remove barras duplicadas no início
    .replace(/^\/&platform.*$/, '') // Remove lixo tipo /&platform=android...
    .replace(/&platform.*$/, '') // Remove params do Metro
    .replace(/\?.*$/, '') // Remove qualquer query string que sobrar
}

function isHermesBytecode(frame: { file?: string | null }) {
  return frame.file?.includes('address at') || frame.file?.includes('InternalBytecode')
}

function isAppCode(file: string) {
  return file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')
}

/**
 * Formata um erro bonito, pronto para logar ou enviar
 */
export function formatStackTrace(
  error: BaseError,
  options: {
    includeNodeModules?: boolean
    isTerminal: boolean
  }
) {
  if (!error.stack) return ''

  const message = error.message || 'Erro desconhecido'
  const stack = error.stack || ''
  const includeNodeModules = options?.includeNodeModules ?? false
  const isTerminal = options.isTerminal

  const parsed = parse(stack)

  const seen = new Set<string>()
  const formattedStack = parsed
    .filter(frame => {
      if (!frame.file) return false
      if (includeNodeModules) return true
      return !frame.file.includes('node_modules')
    })
    .filter(frame => {
    // Remove duplicados baseando-se em file + method + line
      const key = `${frame.file}-${frame.methodName}-${frame.lineNumber}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .map(frame => {
      const file = cleanFileName(frame.file)
      const method = frame.methodName
      const line = frame.lineNumber
      const column = frame.column

      if (isHermesBytecode(frame)) {
        return isTerminal ?
          `  📍 at ${method} (${colorTerminal('🔥 Hermes Bytecode', 31)})`
          : `  📍 at ${method} ('🔥 Hermes Bytecode')`
      }

      if (isAppCode(file)) {
        return isTerminal ?
          `  📍 at ${colorTerminal(method, 33)} (${colorTerminal(`📝 ${file}:${line}:${column}`, 32)})`
          : `  📍 at ${method} ('📝 ${file}:${line}:${column}')`
      }

      if (file) {
        return isTerminal ?
          `  📍 at ${colorTerminal(method, 33)} (${colorTerminal(`${file}:${line}:${column}`, 90)})`
          : `  📍 at ${method} ('${file}:${line}:${column}')`
      }

      return `  📍 at ${method}`
    })
    .join('\n')

  const engine = getEngine(isTerminal)
  const platform = getPlatform(isTerminal)

  return isTerminal ?
    `${platform} ${engine} \n⛔ ${error.titleMessage}\n🔴 ${colorTerminal(message, 33)}\n${formattedStack}`
    : `${platform} ${engine} \n⛔ ${error.titleMessage}\n🔴 ${message}\n${formattedStack}`
}

function getEngine(isTerminal: boolean) {
  if (isTerminal) {
    return isHermes() ? colorTerminal('[🔥 Hermes]', 31) : colorTerminal('[💎 JS Engine]', 34)
  }
  return isHermes() ? '[🔥 Hermes]' : '[💎 JS Engine]'
}
function getPlatform(isTerminal: boolean) {
  if (isTerminal) {
    return Platform.OS === 'android' ? colorTerminal('[🤖 Android]', 35) : colorTerminal('[🍎 iOS]', 35)
  }
  return Platform.OS === 'android' ? '[🤖 Android]' : '[🍎 iOS]'
}
