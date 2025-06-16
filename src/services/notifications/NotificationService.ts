import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'
import { ENV } from '@/env'

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export interface IPushNotificationData {
  type: 'new_ride' | 'ride_update' | 'general'
  rideId?: number
  message: string
  title: string
}

export class NotificationService {
  private static token: string | null = null

  /**
   * Register for push notifications and get the token
   */
  static async registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) {
      console.warn('Push notifications only work on physical devices')
      return null
    }

    // Request permissions with specific iOS options
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowDisplayInCarPlay: true,
          allowCriticalAlerts: false,
          provideAppNotificationSettings: true,
          allowProvisional: false,
          allowAnnouncements: false,
        },
      })
      finalStatus = status
    }

    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token for push notification!')
      
      // On iOS, show alert to guide user to settings
      if (Platform.OS === 'ios') {
        // You might want to show an alert here guiding users to enable notifications in Settings
        console.warn('iOS: Please enable notifications in Settings > Notifications > HelpGuincho')
      }
      
      return null
    }

    try {
      const projectId = '9d5678ec-d179-448b-b3db-aca915317964' // Your EAS project ID
      const token = await Notifications.getExpoPushTokenAsync({
        projectId,
      })
      
      this.token = token.data
      console.log('✅ Push notification token:', token.data)
      
      return token.data
    } catch (error) {
      console.error('❌ Error getting push token:', error)
      return null
    }
  }

  /**
   * Configure notification channels for Android
   */
  static async configureNotificationChannels() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('ride-notifications', {
        name: 'Notificações de Corridas',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FFCC00',
        sound: 'default',
        enableLights: true,
        enableVibrate: true,
      })

      await Notifications.setNotificationChannelAsync('general-notifications', {
        name: 'Notificações Gerais',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FFCC00',
        sound: 'default',
      })
    }
  }

  /**
   * Send the push token to the backend
   */
  static async sendTokenToBackend(token: string, userId: number, userRole: string, authToken?: string) {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      // Add authentication token if provided
      if (authToken) {
        headers['Authorization'] = `Token ${authToken}`
      }

      const response = await fetch(`${ENV.BASE_URL}/notifications/register-token/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          token,
          platform: Platform.OS,
        }),
      })

      const responseData = await response.json()

      if (response.ok) {
        console.log('✅ Token sent to backend successfully:', responseData.message)
        return { success: true, message: responseData.message }
      } else {
        console.error('❌ Failed to send token to backend:', responseData)
        return { success: false, error: responseData.error || 'Unknown error' }
      }
    } catch (error) {
      console.error('❌ Error sending token to backend:', error)
      return { success: false, error: String(error) }
    }
  }

  /**
   * Schedule a local notification (for testing or fallback)
   */
  static async scheduleLocalNotification(
    title: string,
    body: string,
    data?: any,
    seconds: number = 0
  ) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
        categoryIdentifier: 'ride-notification',
      },
      trigger: seconds > 0 ? { seconds } : null,
    })
  }

  /**
   * Handle notification response (when user taps on notification)
   */
  static addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(callback)
  }

  /**
   * Handle notification received while app is in foreground
   */
  static addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
  ) {
    return Notifications.addNotificationReceivedListener(callback)
  }

  /**
   * Get the current push token
   */
  static getToken(): string | null {
    return this.token
  }

  /**
   * Clear all notifications
   */
  static async clearAllNotifications() {
    await Notifications.dismissAllNotificationsAsync()
  }

  /**
   * Set notification badge count (iOS)
   */
  static async setBadgeCount(count: number) {
    await Notifications.setBadgeCountAsync(count)
  }
} 