import https from 'https'

import axios, { AxiosRequestConfig } from 'axios'

import { stringifyQueryParams } from '@/utils/stringifyQueryParams'

export const createAxiosClient = (config?: AxiosRequestConfig) => {
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  })

  const { ...axiosConfig } = config ?? {}

  const instance = axios.create({
    timeout: 90000,
    httpsAgent,
    headers: {
      'Content-Type': 'application/json',
      accpet: 'application/json',
    },
    paramsSerializer: (params: any) => stringifyQueryParams(params),
    ...axiosConfig,
  })

  return instance
}
