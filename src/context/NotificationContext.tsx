import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Platform } from 'react-native'
import * as Notifications from 'expo-notifications'
import { NotificationService, IPushNotificationData } from '@/services/notifications/NotificationService'
import { useAuth } from '@/hooks/useAuth'
import { Vibrate } from '@/utils/vibrate'
import Toast from 'react-native-toast-message'

interface INotificationContext {
  pushToken: string | null
  isNotificationEnabled: boolean
  registerForNotifications: () => Promise<void>
  clearAllNotifications: () => Promise<void>
  setBadgeCount: (count: number) => Promise<void>
  scheduleLocalNotification: (title: string, body: string, data?: any) => Promise<void>
}

const NotificationContext = createContext<INotificationContext>({
  pushToken: null,
  isNotificationEnabled: false,
  registerForNotifications: async () => { },
  clearAllNotifications: async () => { },
  setBadgeCount: async () => { },
  scheduleLocalNotification: async () => { },
})

interface INotificationProvider {
  children: ReactNode
}

export function NotificationProvider({ children }: INotificationProvider) {
  const [pushToken, setPushToken] = useState<string | null>(null)
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false)
  const { user, isAuthenticated } = useAuth()

  /**
   * Handle notification received while app is in foreground
   */
  const handleNotificationReceived = (notification: Notifications.Notification) => {
    const data = notification.request.content.data as unknown as IPushNotificationData

    console.log('📩 Notification received:', notification)

    // Vibrate device
    Vibrate()

    // Show toast notification
    Toast.show({
      type: data?.type === 'new_ride' ? 'success' : 'info',
      text1: notification.request.content.title ?? 'Nova Notificação',
      text2: notification.request.content.body ?? '',
      visibilityTime: 5000,
      swipeable: true,
    })

    // Handle specific notification types
    if (data?.type === 'new_ride') {
      // Additional handling for new ride notifications
      console.log('🚗 New ride notification received:', data.rideId)
    }
  }

  /**
   * Handle notification tap (when user taps on notification)
   */
  const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data as unknown as IPushNotificationData

    console.log('🔔 Notification tapped:', response)

    // Navigate based on notification type
    if (data?.type === 'new_ride' && data?.rideId) {
      // You can add navigation logic here
      console.log('Navigating to ride:', data.rideId)
      // Example: navigation.navigate('RideDetails', { rideId: data.rideId })
    }
  }

  /**
 * Register for push notifications
 */
  const registerForNotifications = async () => {
    try {
      // Only register if user is authenticated
      if (isAuthenticated !== 'LOGGED' || !user) {
        console.warn('⚠️  Cannot register for notifications: user not authenticated')
        setIsNotificationEnabled(false)
        return
      }

      console.log('🚀 Starting notification registration...')

      // Configure notification channels first (Android)
      await NotificationService.configureNotificationChannels()

      // First, explicitly request permissions (this should show the dialog)
      const permissionResult = await NotificationService.requestNotificationPermissions()
      console.log('🔐 Permission result:', permissionResult)

      if (!permissionResult.granted) {
        console.warn('❌ Notification permissions denied')
        setIsNotificationEnabled(false)

        // Show user-friendly message
        Toast.show({
          type: 'error',
          text1: 'Permissões Negadas',
          text2: Platform.OS === 'ios'
            ? 'Ative as notificações em Ajustes > Notificações > HelpGuincho'
            : 'Ative as notificações nas configurações do app',
          visibilityTime: 5000,
        })
        return
      }

      // Register for push notifications
      const token = await NotificationService.registerForPushNotifications()

      if (token && user) {
        setPushToken(token)
        setIsNotificationEnabled(true)

        // Send token to backend
        console.log('🌐 Sending token to backend. User:', user?.id, 'Auth status:', isAuthenticated)

        // Test if other authenticated endpoints work
        try {
          console.log('🧪 Testing auth with user profile endpoint...')
          const { tryGetUserProfile } = await import('@/services/api/User')
          await tryGetUserProfile()
          console.log('✅ User profile endpoint works - auth is OK')
        } catch (error) {
          console.log('❌ User profile endpoint also fails:', error)
        }

        const result = await NotificationService.sendTokenToBackend(token)

        if (result?.success) {
          console.log('✅ Push notifications registered successfully:', result.message)
        } else {
          console.error('❌ Failed to register token with backend:', result?.error)
        }

        console.log('✅ Push notifications setup completed')
      } else {
        console.warn('⚠️  Push notification registration failed - no token or user')
        setIsNotificationEnabled(false)

        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Falha ao obter token de notificação',
          visibilityTime: 3000,
        })
      }
    } catch (error) {
      console.error('❌ Failed to register for push notifications:', error)
      setIsNotificationEnabled(false)

      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Falha ao configurar notificações',
        visibilityTime: 3000,
      })
    }
  }

  /**
   * Clear all notifications
   */
  const clearAllNotifications = async () => {
    await NotificationService.clearAllNotifications()
  }

  /**
   * Set badge count
   */
  const setBadgeCount = async (count: number) => {
    await NotificationService.setBadgeCount(count)
  }

  /**
   * Schedule a local notification
   */
  const scheduleLocalNotification = async (title: string, body: string, data?: any) => {
    await NotificationService.scheduleLocalNotification(title, body, data)
  }

  useEffect(() => {
    // Set up notification listeners
    const notificationListener = NotificationService.addNotificationReceivedListener(
      handleNotificationReceived
    )

    const responseListener = NotificationService.addNotificationResponseListener(
      handleNotificationResponse
    )

    // Auto-register for notifications only when user is authenticated and logged in
    if (user && isAuthenticated === 'LOGGED' && !pushToken) {
      registerForNotifications()
    }

    // Clear notification state when user logs out
    if (isAuthenticated === 'UNLOGGED') {
      setPushToken(null)
      setIsNotificationEnabled(false)
    }

    return () => {
      notificationListener.remove()
      responseListener.remove()
    }
  }, [user, isAuthenticated])

  const value: INotificationContext = {
    pushToken,
    isNotificationEnabled,
    registerForNotifications,
    clearAllNotifications,
    setBadgeCount,
    scheduleLocalNotification,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
} 