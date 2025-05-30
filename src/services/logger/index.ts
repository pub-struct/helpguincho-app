// import { writeFile } from '@/utils/files/writeFile'
import { BaseError, ErrorMetadata } from '../errors/BaseError'
// import * as FileSystem from 'expo-file-system'
// import { dateWithoutTimezone } from '@/utils/dateWithoutTimezone'
// import { randomUUID } from 'expo-crypto'
// import { readFile } from '@/utils/files/readFile'
// import { rethrowIfAppError } from '../errors/rethrowIfAppError'
// import { InfraError } from '../errors/InfraError'
// import { formatData } from '@/utils/formatData'
import { formatStackTrace } from '@/utils/debug/formatStackTrace'
import { colorTerminal } from '@/utils/debug/colorTerminal'
// import { storageAuthGet } from '../storage/Auth'
// import { LOG_FILE_URI } from '@/constants/filesPath'


export async function loggerErrors(error: BaseError, context: ErrorMetadata) {
  const contextMessage = context ? JSON.stringify(context, null, 2) : ''
  const errorMessage = error.message
  // eslint-disable-next-line tseslint/no-explicit-any
  const errorMessageOriginal = error.originalError ? (error.originalError as any).message : ''
  const titleMessage = error.titleMessage
  const stackTrace = formatStackTrace(error, { isTerminal: true })
  // const timestamp = formatData(dateWithoutTimezone(new Date()), 'dd/MM/yyyy HH:mm:ss')
  // const username = (await storageAuthGet()).username

  // const UUID = randomUUID()

  if (__DEV__) {
    console.error(
      '\n-------------------------------------------------------------------------------------------' +
      '\n-------------------------------------------------------------------------------------------' +
      '\n⛔ ' + colorTerminal('TITLE MSG', 33) + ' ==> ' + titleMessage +
      '\n🔴 ' + colorTerminal('ERROR MSG', 33) + ' ==> ' + errorMessage +
      '\n🔴 ' + colorTerminal('ORIGINAL ERROR MSG', 33) + ' ==> ' + errorMessageOriginal +
      '\n📝 ' + colorTerminal('CONTEXT', 33) + ' ==> ' + contextMessage +
      '\n📢 ' + colorTerminal('STACK TRACE', 33) + ' ==> ' + stackTrace +
      // '\n📢 ' + colorTerminal('STACK TRACE ORIGINAL', 33) + ' ==> ' + error.stack +
      '\n-------------------------------------------------------------------------------------------' +
      '\n-------------------------------------------------------------------------------------------\n'
    )
  }

  // try {
  //   await saveLogToFile({
  //     UUID,
  //     context,
  //     error,
  //     timestamp,
  //     username
  //   })
  // } catch (e) {
  //   const error = e as InfraError
  //   console.log('ERRO NO LOGGER ERRORS SAVE FILE ======>', error)
  // }

  // try {
  //   await firebaseCreateLog({
  //     UUID,
  //     error,
  //     logData: context,
  //     timestamp
  //   })
  // } catch (error) {
  //   console.log('ERRO NO LOGGER ERRORS FIREBASE ======>', error)
  // }
}

// interface IParams {
//   context: ErrorMetadata
//   error: BaseError
//   timestamp: string
//   UUID: string
//   username: string
// }

// async function saveLogToFile(params: IParams) {
//   const { UUID, error, context, timestamp, username } = params
//   // eslint-disable-next-line tseslint/no-explicit-any
//   const errorMessageOriginal = error.originalError ? (error.originalError as any).message : ''

//   const logData =
//   '\n--------------------------------------------------------------' +
//   '\n🟢 ID ====> ' + UUID +
//   '\n📲 Username ====> ' + username +
//   '\n📢 Title =====> ' + error.titleMessage +
//   '\n❌ Error ====> ' + error.message +
//   '\n🔴 Original Error Msg ====> ' + errorMessageOriginal +
//   '\n📄 Context ====> ' + JSON.stringify(context, null, 2) +
//   '\n🕒 Timestamp ====> ' + timestamp +
//   '\n📌 Stack ====> ' + formatStackTrace(error, { isTerminal: false }) +
//   '\n--------------------------------------------------------------'


//   try {
//     const fileInfo = await FileSystem.getInfoAsync(LOG_FILE_URI)

//     if (!fileInfo.exists) {
//       await writeFile(LOG_FILE_URI, logData)
//     } else {
//       const currentLogs = await readFile(LOG_FILE_URI)
//       const updatedLogs = currentLogs + '\n\n' + logData

//       await writeFile(LOG_FILE_URI, updatedLogs)
//     }
//   } catch (e) {
//     rethrowIfAppError(e)

//     throw new InfraError({
//       message: 'Erro ao salvar o log no arquivo',
//       metadata: {
//         LOG_FILE_URI,
//         logData
//       },
//       originalError: e,
//       titleMessage: 'Erro no salvamento do log',
//     })
//   }
// }
