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
export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {
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
  // 添加interceptors定义
  interceptors: {
    request:AxiosInterceptorManager<AxiosRequestConfig>
    response:AxiosInterceptorManager<AxiosResponse>
  }
  
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>  // 不必改写为支持函数重载的形式，函数具体实现是兼容这种形式的就行

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

// 混合类型接口，本身是一个函数，同时继承Axios中的方法（可以看成是一个对象，可以同时做为函数和对象使用？）
export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> // 函数重载
}


// 拦截器管理器
export interface AxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number  // 创建一个拦截器，并返回该拦截器的id

  eject(id: number): void
}

export interface ResolvedFn<T> {  // 这里T就两种 AxiosRequestConfig 以及 AxiosResponse
  (val: T): T | Promise<T>   // 同步逻辑返回T，异步逻辑返回Promise<T> ，但通过promise.then调用后都会变成promise
}

export interface RejectedFn {
  (error: any): any
}