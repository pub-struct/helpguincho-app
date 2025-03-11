//@ts-ignore
import ApiFactory from '@/infra/http/factories/ApiFactory'
import { UserLoginRequestDTO } from './dto/requests/user-login-request-dto'
import { UserLoginResponseDTO } from './dto/responses/user-login-response-dto'
export default class AuthService {
  private httpClient = ApiFactory()

  public async login(data: UserLoginRequestDTO): Promise<HttpResponse<UserLoginResponseDTO>> {
    console.log(data)
    return this.httpClient.request({
      url: '/api/v1/auth/login/',
      method: 'post',
      body: data,
    })
  }
  public async session(): Promise<HttpResponse<UserLoginResponseDTO>> {
    return this.httpClient.request({
      method: 'post',
      url: '/api/v1/auth/session/',
    })
  }
  public async logout(): Promise<HttpResponse<void>> {
    return this.httpClient.request({
      method: 'post',
      url: '/api/v1/auth/logout/',
    })
  }
}
