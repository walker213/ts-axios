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
  url?: string  // axios作为对象使用，axios.get()时url变为可选
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


// 该接口描述 Axios 类中的公共方法
export interface Axios {
  request(config: AxiosRequestConfig): AxiosPromise  // 不必改写为支持函数重载的形式，函数具体实现是兼容这种形式的就行

  get(url: string, config?: AxiosRequestConfig): AxiosPromise
  delete(url: string, config?: AxiosRequestConfig): AxiosPromise
  head(url: string, config?: AxiosRequestConfig): AxiosPromise
  options(url: string, config?: AxiosRequestConfig): AxiosPromise

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise
  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise
  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise
}

// 混合类型接口，本身是一个函数，同时继承Axios中的方法（可以看成是一个对象，可以同时做为函数和对象使用？）
export interface AxiosInstance extends Axios {
  (config: AxiosRequestConfig): AxiosPromise
  (url:string,config?:AxiosRequestConfig):AxiosPromise // 函数重载
}