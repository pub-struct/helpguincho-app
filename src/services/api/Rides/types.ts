export interface IRideDetailsDTO {
  id: number
  driver: IDriverDTO
  client: IClientDTO
  pictures: string[]
  description: string
  status: 'pending'
  | 'accepted'
  | 'rejected'
  | 'completed'
  | 'cancelled'
  created_at: string
  updated_at: string
  accepted_at: string
  completed_at: string
  pickup_location: string
  pickup_lat: number
  pickup_long: number
  delivery_address: string
  delivery_lat: number
  delivery_long: number
  driver_lat: number
  driver_long: number
  pickup_time: string
  delivery_time: string
  price: string
  km: number
  service: 'private'
  | 'indication'
  | 'enterprise'
}

export interface IDriverDTO {
  id: number
  enterprise: IEnterpriseDTO
  vehicle: IVehicleDTO
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

export interface IEnterpriseDTO {
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

export interface IVehicleDTO {
  id: number
  brand: string
  model: string
  year: string
  plate: string
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface IClientDTO {
  full_name: string
  vehicle: string
  plate: string
}
