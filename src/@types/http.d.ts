type IHttpMethod = 'post' | 'get' | 'put' | 'delete' | 'patch'

type IHttpRequest = {
  baseURL?: string
  url: string
  method: IHttpMethod
  body?: any
  params?: any
  headers?: any
  responseType?: ResponseType | undefined
}

type HttpResponse<T = any> = {
  statusCode: number
  body: T
}

interface IHttpClient<R = any> {
  request: (data: IHttpRequest) => Promise<HttpResponse<R>>
}
