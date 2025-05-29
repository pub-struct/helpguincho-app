import { IClientDTO, IDriverDTO } from '../Rides/types'


export interface IHistoryRidesDTO {
  count: number
  next: string
  previous: string
  results: IResultRidesDTO[]
}

export interface IResultRidesDTO {
  id: number
  driver: IDriverDTO
  client: IClientDTO
  pictures: IPictureDTO[]
  description: string
  status: string
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
  pickup_time: string | null
  delivery_time: string | null
  price: string
  km: number
  service: string
}

export interface IPictureDTO {
  id: number
  picture: string
}
