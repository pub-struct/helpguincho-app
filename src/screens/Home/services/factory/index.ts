import { IRideDetailsDTO } from '@/services/api/Rides/types'
import { IClient, IDriver, IEnterprise, IRideDetails, IVehicle } from '@/@types/rides'


export function factoryRide(data: IRideDetailsDTO): IRideDetails {
  const enterprise = {
    id: data.driver.enterprise.id || 0,
    name: data.driver.enterprise.name || 'none',
    description: data.driver.enterprise.description || 'none',
    created_at: data.driver.enterprise.created_at || '0000-00-00T00:00:00.000000Z',
    updated_at: data.driver.enterprise.updated_at || '0000-00-00T00:00:00.000000Z',
    is_active: data.driver.enterprise.is_active || false,
    km_base_price: data.driver.enterprise.km_base_price || '0',
    km_price: data.driver.enterprise.km_price || '0',
    max_km: data.driver.enterprise.max_km || 0,
  } satisfies IEnterprise
  const vehicle = {
    id: data.driver.vehicle.id || 0,
    brand: data.driver.vehicle.brand || 'none',
    model: data.driver.vehicle.model || 'none',
    year: data.driver.vehicle.year || 'none',
    plate: data.driver.vehicle.plate || 'none',
    created_at: data.driver.vehicle.created_at || '0000-00-00T00:00:00.000000Z',
    updated_at: data.driver.vehicle.updated_at || '0000-00-00T00:00:00.000000Z',
    is_active: data.driver.vehicle.is_active || false,
  } satisfies IVehicle
  const driver = {
    id: data.driver.id || 0,
    enterprise,
    vehicle,
    date_joined: data.driver.date_joined || '0000-00-00T00:00:00.000000Z',
    username: data.driver.username || 'none',
    latitude: data.driver.latitude || 0,
    longitude: data.driver.longitude || 0,
    full_name: data.driver.full_name || 'none',
    role: data.driver.role || 'none',
    email: data.driver.email || 'none',
    document: data.driver.document || 'none',
    cnh: data.driver.cnh || 'none',
    phone: data.driver.phone || 'none',
  } satisfies IDriver
  const client = {
    full_name: data.client.full_name || 'none',
    vehicle: data.client.vehicle || 'none',
    plate: data.client.plate || 'none',
  } satisfies IClient
  // console.log('RIDE DETAIL ===>', JSON.stringify(data, null, 2))
  return {
    id: data.id || 0,
    driver,
    client,
    pictures: data.pictures || [],
    description: data.description || 'none',
    status: data.status || 'none',
    created_at: data.created_at || '0000-00-00T00:00:00.000000Z',
    updated_at: data.updated_at || '0000-00-00T00:00:00.000000Z',
    accepted_at: data.accepted_at || '0000-00-00T00:00:00.000000Z',
    completed_at: data.completed_at || '0000-00-00T00:00:00.000000Z',
    pickup_location: data.pickup_location || 'none',
    pickup_lat: data.pickup_lat || 0,
    pickup_long: data.pickup_long || 0,
    delivery_address: data.delivery_address || 'none',
    delivery_lat: data.delivery_lat || 0,
    delivery_long: data.delivery_long || 0,
    driver_lat: data.driver_lat || 0,
    driver_long: data.driver_long || 0,
    pickup_time: data.pickup_time === null ? null : data.pickup_time || '',
    delivery_time: data.delivery_time === null ? null : data.delivery_time || '',
    price: data.price || '0',
    km: data.km || 0,
    service: data.service || 'none',
  } satisfies IRideDetails
}
