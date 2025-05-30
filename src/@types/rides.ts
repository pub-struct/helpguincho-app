export interface ISocketRide {
  id: number
  body: IBodyRide
  room: string
  created_at: string
}

interface IBodyRide {
  type: string
  price: number
  client: number
  driver: string
  ride_id: number
  driver_id: number
  pickup_address: string
  delivery_address: string
}

export interface IRideDetails {
  id: number
  driver: IDriver
  client: IClient
  pictures: string[]
  description: string | 'none'
  status: 'pending'
  | 'accepted'
  | 'rejected'
  | 'completed'
  | 'cancelled'
  | 'none'
  created_at: string
  updated_at: string
  accepted_at: string
  completed_at: string
  pickup_location: string | 'none'
  pickup_lat: number
  pickup_long: number
  delivery_address: string | 'none'
  delivery_lat: number
  delivery_long: number
  driver_lat: number
  driver_long: number
  pickup_time: string | null
  delivery_time: string | null
  price: string
  km: number
  service: 'private'
  | 'indication'
  | 'enterprise'
  | 'none'
}

export interface IDriver {
  id: number
  enterprise: IEnterprise
  vehicle: IVehicle
  date_joined: string
  username: string
  latitude: number
  longitude: number
  full_name: string
  role: string
  email: string
  document: string
  cnh: string
  phone: string
}

export interface IEnterprise {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
  is_active: boolean
  km_base_price: string
  km_price: string
  max_km: number
}

export interface IVehicle {
  id: number
  brand: string
  model: string
  year: string
  plate: string
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface IClient {
  full_name: string
  vehicle: string
  plate: string
}

export interface IRideState {
  id: number
  status: 'pending'
  | 'accepted'
  | 'rejected'
  | 'completed'
  | 'cancelled'
  | 'none'
  pickup_location: string | 'none'
  pickup_lat: number
  pickup_long: number
  delivery_address: string | 'none'
  delivery_lat: number
  delivery_long: number
  km: string
  time: number
}

export type TUpdateRideState = Omit<IRideDetails, 'km'> & {
  km: string
  time: number
}
