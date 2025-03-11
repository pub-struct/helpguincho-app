interface TNotification {
  id: number
  body: Body
  room: string
  created_at: string
}

interface Body {
  type: string
  price: number
  client: number
  driver: string
  ride_id: number
  driver_id: number
  pickup_address: string
  delivery_address: string
  time: string
}
