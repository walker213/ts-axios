import { AxiosRequestConfig } from './types'
import xhr from './xhr'
import { buildURL } from './helpers/url'
import { processHeaders } from './helpers/header'
import { transformRequest } from './helpers/data'

function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

function transformHeaders(config: AxiosRequestConfig) {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
}

function axios(config: AxiosRequestConfig): void {
  processConfig(config)
  xhr(config)
}

export default axios
