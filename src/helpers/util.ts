const toString = Object.prototype.toString

// 类型保护
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

export function isObject(val: any): val is Object {
  // 判断一切对象，包括：FormData Blob等等
  return val !== null && typeof val === 'object'
}


// 判断普通对象
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

// 判断请求data是不是FormData
export function isFormData(val:any): val is FormData {
  return typeof val !== undefined && val instanceof FormData
}

// 判断params是不是URLSearchParams
export function isURLSearchParams(val:any): val is URLSearchParams {
  return typeof val !== undefined && val instanceof URLSearchParams
}

// 把from中的属性及方法拷贝到to中
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    //  (to as T&U)[key] = from[key] as any  , 注意括号的位置
    (<T & U>to)[key] = <any>from[key]  // 必须把to断言成T&U才能把 from的属性赋值给to,  (U不能赋值给T&U所以要断言成any??)
  }
  return <T & U>to
}


export function deepMerge(...objs:any[]):any {
  const result = Object.create(null)

  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key=>{
        const val = obj[key]    // headers{key:val}
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {  // result[key]可能已经存在了，因为objs传入了多个headers，所以先判断
            result[key]=deepMerge(result[key],val)
          } else {
            result[key]=deepMerge(val)
          }
        } else {
          result[key]=val
        }
      })
    }
  })

  return result
}