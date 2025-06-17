import { Platform } from 'react-native'
import { NotificationManager } from './NotificationManager'
import { tryRegisterNotificationToken } from '../api/Notifications'
import { rethrowIfAppError } from '../errors/rethrowIfAppError'

export interface IPushNotificationData {
  type: 'new_ride' | 'ride_update' | 'general'
  rideId?: number
  message: string
  title: string
}

export class NotificationService {
  /**
   * Request notification permissions explicitly (always shows dialog)
   */
  static async requestNotificationPermissions(): Promise<{ granted: boolean; status: string }> {
    return NotificationManager.requestNotificationPermissions()
  }

  /**
   * Register for push notifications and get the token
   */
  static async registerForPushNotifications(): Promise<string | null> {
    return NotificationManager.registerForPushNotifications()
  }

  /**
   * Configure notification channels for Android
   */
  static async configureNotificationChannels() {
    await NotificationManager.configureNotificationChannels()
  }

  /**
   * Send the push token to the backend using the new API pattern
   */
  static async sendTokenToBackend(token: string) {
    try {
      const response = await tryRegisterNotificationToken({
        token,
        platform: Platform.OS as 'ios' | 'android',
      })

      console.log('✅ Token sent to backend successfully:', response.message)
      return { success: true, message: response.message }
    } catch (error) {
      console.error('❌ Failed to send token to backend:', error)
      rethrowIfAppError(error)
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
    await NotificationManager.scheduleLocalNotification(title, body, data, seconds)
  }

  /**
   * Handle notification response (when user taps on notification)
   */
  static addNotificationResponseListener(
    callback: (response: import('expo-notifications').NotificationResponse) => void
  ) {
    return NotificationManager.addNotificationResponseListener(callback)
  }

  /**
   * Handle notification received while app is in foreground
   */
  static addNotificationReceivedListener(
    callback: (notification: import('expo-notifications').Notification) => void
  ) {
    return NotificationManager.addNotificationReceivedListener(callback)
  }

  /**
   * Get the current push token
   */
  static getToken(): string | null {
    return NotificationManager.getToken()
  }

  /**
   * Clear all notifications
   */
  static async clearAllNotifications() {
    await NotificationManager.clearAllNotifications()
  }

  /**
   * Set notification badge count (iOS)
   */
  static async setBadgeCount(count: number) {
    await NotificationManager.setBadgeCount(count)
  }
} 