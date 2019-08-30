export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'

export interface AxiosRequestConfig {
  url: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
}

// 期望最后拿到的response格式
export interface AxiosResponse {
  data: any
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

export interface AxiosPromise extends Promise<AxiosResponse> {
  // Promise泛型接口，resolve的值应是AxiosResponse
}

// 导出接口给 axios catch到的e使用
export interface AxiosError extends Error {
  config: AxiosRequestConfig
  code?: string | null    // 错误代码
  request?: any   // XHLHttpRequest对象实例
  response?: AxiosResponse
  isAxiosError: boolean
}
