import { Axios, AxiosRequestConfig, AxiosResponse, Method } from 'axios'

export enum HttpServer {
  StripeCheckout = 'SC',
}

export type HttpClientRequestConfig<T = any> = {
  url: string
  method: Method
  server: HttpServer
} & Omit<AxiosRequestConfig<T>, 'url' | 'method'>

export type HttpResponse<T> = {
  data: T
  status: number
}

export type HttpClient = {
  request<T = any, D = any>(config: HttpClientRequestConfig<D>): Promise<AxiosResponse<T>>
} & Pick<Axios, 'interceptors'>
