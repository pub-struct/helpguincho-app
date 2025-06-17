import { tryCatchInfra } from '@/utils/tryCatchInfra'
import { API } from '../config'
import { INotificationTokenDTO, INotificationTokenResponseDTO } from './types'
import { storageGetToken } from '@/services/storage/Auth'

export async function tryRegisterNotificationToken(tokenData: INotificationTokenDTO) {
  const url = '/notifications/register-token/'

  // Debug: Check if authorization header is set
  console.log('🔑 Current API headers:', API.defaults.headers.common)

  // Get the stored auth token manually as backup
  const authToken = await storageGetToken()
  console.log('💾 Stored auth token exists:', !!authToken)

  // Debug: Full request details
  console.log('🌐 Making request to:', `${API.defaults.baseURL}${url}`)
  console.log('📦 Request payload:', JSON.stringify(tokenData))

  const response = await tryCatchInfra({
    fn: () => API.post<INotificationTokenResponseDTO>(url, tokenData, {
      headers: {
        ...(authToken && { Authorization: `Token ${authToken}` }),
      },
    }),
    titleMessage: 'Erro ao registrar token de notificação',
    context: {
      name: 'tryRegisterNotificationToken',
      platform: tokenData.platform,
      url: `${API.defaults.baseURL}${url}`,
      hasAuthToken: !!authToken,
    },
  })

  return response.data
} 