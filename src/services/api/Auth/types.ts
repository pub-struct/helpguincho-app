export interface UserLoginResponse {
  id: number
  token: string
  enterprise: InsuranceCompany
  vehicle: IVehicle
  last_login: null | string
  first_name: string
  last_name: string
  date_joined: string
  username: string
  full_name: string
  role: string
  email: string
  document: string
  cnh: string
  is_active: boolean
  phone: string
}
