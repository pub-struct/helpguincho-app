import ViewSet from '@/infra/viewset'

export default class RidesService extends ViewSet<Ride> {
  constructor() {
    super('/api/v1/rides')
  }
  public async acceptRide(ride: string | number) {
    return await this.httpClient.request({
      url: `${this.basePath}/${ride}/accept_ride/`,
      method: 'patch',
    })
  }
}
