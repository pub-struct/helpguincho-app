import { IEnterpriseDTO, IVehicleDTO } from '../Rides/types'


export interface IUserLoginDTO {
  id: number
  token: string
  enterprise: IEnterpriseDTO
  vehicle: IVehicleDTO
  last_login: null | string
  first_name: string
  last_name: string
  date_joined: string
  username: string
  latitude: number
  longitude: number
  full_name: string
  role: string
  email: string
  document: string
  cnh: string
  is_active: boolean
  phone: string
}
