// services/ridesService.ts
import ViewSet from '@/infra/viewset'
//import { Ride } from '@/domain/models/Ride' // ajuste o caminho conforme sua estrutura

export default class RidesService extends ViewSet<Ride> {
  constructor() {
    super('/api/v1/rides')
  }

  public async acceptRide(rideId: string | number) {
    return await this.httpClient.request({
      url: `${this.basePath}/${rideId}/accept_ride/`,
      method: 'patch',
    })
  }

  public async updateRideStatus(rideId: string | number, newStatus: 'rejected' | 'completed') {
    return await this.httpClient.request({
      url: `${this.basePath}/${rideId}/update_ride_status/`,
      method: 'patch',
      body: {
        client: {
          full_name: '',
          vehicle: '',
          plate: '',
        },
        pictures: [{ picture: '' }],
        description: '',
        status: newStatus,
        accepted_at: null,
        completed_at: null,
        pickup_location: '',
        pickup_lat: 1,
        pickup_long: 1,
        delivery_address: '',
        delivery_lat: 1,
        delivery_long: 1,
        driver_lat: 1,
        driver_long: 1,
        pickup_time: null,
        delivery_time: null,
        price: null,
        km: 1,
        service: 'private',
      }
    })
  }
}
