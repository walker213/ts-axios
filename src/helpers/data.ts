import { isPlainObject } from './util'

// Blob FormData等不需要转换，原生支持，只有普通object才需要转成字符串
export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

// 在不传入responseType：json的情况下尝试把json字符串转成对象
export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // do nothing
    }
  }
  return data
}
