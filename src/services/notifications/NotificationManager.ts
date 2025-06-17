import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

export class NotificationManager {
  private static token: string | null = null

  /**
   * Request notification permissions explicitly (always shows dialog)
   */
  static async requestNotificationPermissions(): Promise<{ granted: boolean; status: string }> {
    if (!Device.isDevice) {
      console.warn('Push notifications only work on physical devices')
      return { granted: false, status: 'unavailable' }
    }

    try {
      console.log('🔔 Requesting notification permissions...')
      
      // Always request permissions to show the dialog
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowDisplayInCarPlay: true,
          allowCriticalAlerts: false,
          provideAppNotificationSettings: true,
          allowProvisional: false,
        },
      })

      console.log('📱 Permission status:', status)
      
      const granted = status === 'granted'
      return { granted, status }
    } catch (error) {
      console.error('❌ Error requesting permissions:', error)
      return { granted: false, status: 'error' }
    }
  }

  /**
   * Register for push notifications and get the token
   */
  static async registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) {
      console.warn('Push notifications only work on physical devices')
      return null
    }

    // Check current permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    console.log('📋 Current permission status:', existingStatus)
    
    let finalStatus = existingStatus

         // Request permissions if not granted
     if (existingStatus !== 'granted') {
       const permissionResult = await this.requestNotificationPermissions()
       finalStatus = permissionResult.status as any // Type assertion since we know it's a valid PermissionStatus
     }

    if (finalStatus !== 'granted') {
      console.warn('❌ Notification permissions not granted. Status:', finalStatus)
      
      // On iOS, show alert to guide user to settings
      if (Platform.OS === 'ios') {
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
      trigger: seconds > 0 ? { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds } : null,
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