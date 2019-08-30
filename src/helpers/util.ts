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

// 把from中的属性及方法拷贝到to中
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    //  (to as T&U)[key] = from[key] as any  , 注意括号的位置
    (<T & U>to)[key] = <any>from[key]  // 必须把to断言成T&U才能把 from的属性赋值给to,  (U不能赋值给T&U所以要断言成any??)
  }
  return <T & U>to
}