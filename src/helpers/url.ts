import { isDate, isPlainObject } from './util'

function encode(val: string): string {
  return encodeURIComponent(val) // 把特殊字符再次转换回来
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+') // 空格转为+
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any): string {
  if (!params) {
    return url
  }

  const parts: string[] = []

  Object.keys(params).forEach(key => {
    const val = params[key]
    if (val === null || typeof val === 'undefined') {
      return
    }
    let values = []
    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val]
    }
    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })

  let serializeParams = parts.join('&')

  if (serializeParams) {
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      // 检查原url有无哈希
      url = url.slice(0, markIndex)
    }
    url += (url.includes('?') ? '&' : '?') + serializeParams
  }

  return url
}
