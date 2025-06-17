export interface IPushNotificationData {
  type: 'new_ride' | 'ride_update' | 'general'
  rideId?: number
  message: string
  title: string
}

export interface INotificationTokenDTO {
  token: string
  platform: 'ios' | 'android' | 'web'
}

export interface INotificationTokenResponseDTO {
  message: string
  success: boolean
} 