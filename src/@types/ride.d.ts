type Ride = {
  id: number
  driver: User
  client: Client
  description: string
  status: string
  created_at: string
  updated_at: string
  completed_at: any
  pickup_location: string
  pickup_lat: number
  pickup_long: number
  delivery_address: string
  delivery_lat: number
  delivery_long: number
  driver_lat: number
  driver_long: number
  pickup_time: any
  delivery_time: any
  price: string
  pictures?: Picture[]
}
type Client = {
  full_name: string
  vehicle: string
  plate: string
}
type Picture = {
  id: number
  picture: string
}
