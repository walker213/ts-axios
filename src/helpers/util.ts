const toString = Object.prototype.toString

// 类型保护
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

export function isObject(val: any): val is Object {
  // 判断一切对象，包括：FormData Blob等等
  return val !== null && typeof val === 'object'   
}


export function isPlainObject(val: any): val is Object {
  // 判断普通对象
  return toString.call(val) === '[object Object]'
}