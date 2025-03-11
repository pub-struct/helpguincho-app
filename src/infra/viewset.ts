import ApiFactory from '@/infra/http/factories/ApiFactory'

interface QueryParams {
  page?: number | string | null
  page_size?: number | string | null
  [key: string]: any
}
export default class ViewSet<T> {
  public httpClient = ApiFactory()
  public basePath: string

  constructor(basePath: string) {
    this.basePath = basePath
  }

  /**
   * List all resources with  pagination and filtering
   */
  public async list(params?: QueryParams): Promise<HttpResponse<PaginatedResponse<T>>> {
    return this.httpClient.request({
      url: this.basePath + '/',
      method: 'get',
      params,
    })
  }

  /**
   * List all resources with  pagination and filtering
   */
  public async list_without_pagination(params?: QueryParams): Promise<HttpResponse<T[]>> {
    return this.httpClient.request({
      url: this.basePath + '/',
      method: 'get',
      params,
    })
  }

  /**
   * Get a single resource by ID
   */
  public async get(id: string | number): Promise<HttpResponse<T>> {
    return this.httpClient.request({
      url: `${this.basePath}/${id}/`,
      method: 'get',
    })
  }

  /**
   * Create a new resource
   */
  public async create(data: Partial<T>): Promise<HttpResponse<T>> {
    return this.httpClient.request({
      url: `${this.basePath}/`,
      method: 'post',
      body: data,
    })
  }

  /**
   * Update an existing resource
   */
  public async update(id: string | number, data: Partial<T>): Promise<HttpResponse<T>> {
    return this.httpClient.request({
      url: `${this.basePath}/${id}/`,
      method: 'put',
      body: data,
    })
  }

  /**
   * Partially update an existing resource
   */
  public async patch(id: string | number, body: Partial<T>): Promise<HttpResponse<T>> {
    return this.httpClient.request({
      url: `${this.basePath}/${id}/`,
      method: 'patch',
      body,
    })
  }

  /**
   * Delete a resource
   */
  public async delete(id: string | number): Promise<HttpResponse<void>> {
    return this.httpClient.request({
      url: `${this.basePath}/${id}/`,
      method: 'delete',
    })
  }
}
