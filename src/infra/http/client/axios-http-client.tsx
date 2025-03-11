import { BACKEND_URL } from '@/infra'
import { getToken } from '@/infra/services/token'
import axios, { ResponseType } from 'axios'

interface CreateHeadersProps {
  token?: string | null
  headers?: any
}
export class AxiosHttpClient implements IHttpClient {
  private baseUrl: string | undefined

  constructor() {
    this.baseUrl = BACKEND_URL
  }
  private createHeaders({ token, headers }: CreateHeadersProps) {
    const tokenAuth = token ? { Authorization: `Token ${token}` } : null
    return {
      'Content-Type': 'application/json',
      ...tokenAuth,
      ...(headers && headers),
    }
  }
  async request(data: IHttpRequest): Promise<HttpResponse> {
    try {
      const response = await axios.request({
        baseURL: data.baseURL || this.baseUrl,
        url: data.url,
        method: data.method,
        data: data.body,
        params: data.params,
        headers: this.createHeaders({
          token: await getToken(),
          headers: data.headers,
        }),
        timeoutErrorMessage: 'timeout',
        responseType: data.responseType as ResponseType | undefined,
      })
      return {
        statusCode: response.status,
        body: response.data,
      }
    } catch (err: any) {
      return {
        statusCode: err?.response?.status,
        body: err?.response?.data,
      }
    }
  }
}
