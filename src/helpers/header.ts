import { isObject } from './util'
import { Method } from "../types";
import { deepMerge } from "./util";

// 处理headers大小写
function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(name => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')
  // 为普通对象添加content-type
  if (isObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }

  return headers
}

export function parseHeaders(headers: string): any {
  let parsed = Object.create(null)
  if (!headers) {
    return parsed
  }
  // 根据回车和换行转成数组
  headers.split('\r\n').forEach(line => {
    let [key, val] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    if (val) {
      val = val.trim()
    }
    parsed[key] = val
  })

  return parsed
}


export function flattenHeaders(headers: any, method: Method): any{
  if (!headers) {
    return headers
  }

  headers = deepMerge(headers.common, headers[method],headers)  // 把headers.common,headers[method]中的属性深拷贝到headers第一层

  const methodsToDelete = ['delete','get','head','options','post','put','patch','common']
  
  methodsToDelete.forEach(method => {
    delete headers[method]
  })

  return headers
}