import { IEnterprise, IUser, IVehicle } from '@/@types/User'
import { IUserLoginDTO } from '@/services/api/Auth/types'


interface IResponseAPIFactory {
  factoryData: IUser
  token: string
}

export function factoryLogin(data: IUserLoginDTO): IResponseAPIFactory {
  const enterprise = {
    id: data.enterprise.id || 0,
    name: data.enterprise.name || 'none',
    description: data.enterprise.description || 'none',
    created_at: data.enterprise.created_at || '0000-00-00T00:00:00.000000Z',
    updated_at: data.enterprise.updated_at || '0000-00-00T00:00:00.000000Z',
    is_active: data.enterprise.is_active || false,
    km_base_price: data.enterprise.km_base_price || '0',
    km_price: data.enterprise.km_price || '0',
    max_km: data.enterprise.max_km || 0,
  } satisfies IEnterprise
  const vehicle = {
    id: data.vehicle.id || 0,
    brand: data.vehicle.brand || 'none',
    model: data.vehicle.model || 'none',
    year: data.vehicle.year || 'none',
    plate: data.vehicle.plate || 'none',
    created_at: data.vehicle.created_at || '0000-00-00T00:00:00.000000Z',
    updated_at: data.vehicle.updated_at || '0000-00-00T00:00:00.000000Z',
    is_active: data.vehicle.is_active || false,
  } satisfies IVehicle

  return {
    factoryData: {
      id: data.id || 0,
      vehicle,
      enterprise,
      last_login: data.last_login === null ? null : data.last_login === undefined ? null : data.last_login,
      date_joined: data.date_joined || '0000-00-00T00:00:00.000000Z',
      username: data.username || 'none',
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
      full_name: data.full_name || 'none',
      role: data.role || 'none',
      email: data.email || 'none',
      document: data.document || '',
      cnh: data.cnh || '',
      phone: data.phone || '',
    },
    token: data.token
  } satisfies IResponseAPIFactory
}
