import { IHistoryRides, IPicture, IResultRides } from '@/@types/history'
import { IClient, IDriver, IEnterprise, IVehicle } from '@/@types/rides'
import { IHistoryRidesDTO } from '@/services/api/History/types'


export function factory(data: IHistoryRidesDTO): IHistoryRides {
  // const { count, next, previous, results } = data

  // console.log('DADOS DA API ==>', JSON.stringify(teste, null, 2))

  const results = data.results.map(item => {
    const enterprise = {
      id: item.driver.enterprise.id || 0,
      name: item.driver.enterprise.name || 'none',
      description: item.driver.enterprise.description || 'none',
      created_at: item.driver.enterprise.created_at || '0000-00-00T00:00:00.000000Z',
      updated_at: item.driver.enterprise.updated_at || '0000-00-00T00:00:00.000000Z',
      is_active: item.driver.enterprise.is_active || false,
      km_base_price: item.driver.enterprise.km_base_price || '0',
      km_price: item.driver.enterprise.km_price || '0',
      max_km: item.driver.enterprise.max_km || 0,
    } satisfies IEnterprise
    const vehicle = {
      id: item.driver.vehicle.id || 0,
      brand: item.driver.vehicle.brand || 'none',
      model: item.driver.vehicle.model || 'none',
      year: item.driver.vehicle.year || 'none',
      plate: item.driver.vehicle.plate || 'none',
      created_at: item.driver.vehicle.created_at || '0000-00-00T00:00:00.000000Z',
      updated_at: item.driver.vehicle.updated_at || '0000-00-00T00:00:00.000000Z',
      is_active: item.driver.vehicle.is_active || false,
    } satisfies IVehicle
    const driver = {
      id: item.driver.id || 0,
      enterprise,
      vehicle,
      date_joined: item.driver.date_joined || '0000-00-00T00:00:00.000000Z',
      username: item.driver.username || 'none',
      latitude: item.driver.latitude || 0,
      longitude: item.driver.longitude || 0,
      full_name: item.driver.full_name || 'none',
      role: item.driver.role || 'none',
      email: item.driver.email || 'none',
      document: item.driver.document || 'none',
      cnh: item.driver.cnh || 'none',
      phone: item.driver.phone || 'none',
    } satisfies IDriver
    const client = {
      full_name: item.client.full_name || 'none',
      vehicle: item.client.vehicle || 'none',
      plate: item.client.plate || 'none',
    } satisfies IClient
    const pictures = item.pictures.map(pic => ({
      id: pic.id || 0,
      picture: pic.picture || 'none'
    } satisfies IPicture))

    return {
      id: item.id || 0,
      driver,
      client,
      pictures,
      description: item.description || 'none',
      status: item.status || 'none',
      created_at: item.created_at || '0000-00-00T00:00:00.000000Z',
      updated_at: item.updated_at === null
        ? null
        : item.updated_at || '0000-00-00T00:00:00.000000Z',
      accepted_at: item.accepted_at === null
        ? null
        : item.accepted_at || '0000-00-00T00:00:00.000000Z',
      completed_at: item.completed_at === null
        ? null
        : item.completed_at || '0000-00-00T00:00:00.000000Z',
      pickup_location: item.pickup_location || 'none',
      pickup_lat: item.pickup_lat || 0,
      pickup_long: item.pickup_long || 0,
      delivery_address: item.delivery_address || 'none',
      delivery_lat: item.delivery_lat || 0,
      delivery_long: item.delivery_long || 0,
      driver_lat: item.driver_lat || 0,
      driver_long: item.driver_long || 0,
      pickup_time: item.pickup_time || '',
      delivery_time: item.delivery_time || '',
      price: item.price || '0',
      km: item.km || 0,
      service: item.service || 'none',
    } satisfies IResultRides
  })

  return {
    count: data.count || 0,
    next: data.next === null ? null : data.next || 'none',
    previous: data.previous === null ? null : data.next || 'none',
    results
  }
}
