export interface IUser {
  id: number
  vehicle: IVehicle
  enterprise: IEnterprise
  last_login: null | string
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
