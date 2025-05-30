import { IClient, IDriver } from './rides'


export interface IHistoryRides {
  count: number
  next: string | null
  previous: string | null
  results: IResultRides[]
}

export interface IResultRides {
  id: number
  driver: IDriver
  client: IClient
  pictures: IPicture[]
  description: string
  status: string
  created_at: string
  updated_at: string | null
  accepted_at: string | null
  completed_at: string | null
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

export interface IPicture {
  id: number
  picture: string
}
