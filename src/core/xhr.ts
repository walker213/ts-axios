import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/header'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from "../helpers/url";
import cookie from '../helpers/cookie';
import { isFormData } from "../helpers/util";

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType, timeout, cancelToken, withCredentials, xsrfCookieName, xsrfHeaderName, onDownloadProgress, onUploadProgress, auth, validateStatus } = config

    // 与配置相关
    function configureRequest(): void {
      if (responseType) {
        request.responseType = responseType   // 手动设置返回数据的类型
      }

      if (timeout) {
        request.timeout = timeout
      }

      // 设置withCredentials后,跨域请求其它域 B，可以带上被请求的域 B 下的cookies
      if (withCredentials) {
        request.withCredentials = withCredentials
      }

      if (auth) {
        // 查看 Authorization 文档
        headers['Authorization'] = 'Basic' + btoa(auth.username + auth.password)
      }
    }

    // 与事件监听相关
    function addEvents(): void {
      request.onreadystatechange = function handleLoad() {
        if (request.readyState !== 4) {
          return
        }
        // 网络异常或超时
        if (request.status === 0) {
          return
        }

        // 请求完成，拿到响应
        const responseHeaders = parseHeaders(request.getAllResponseHeaders())  // 把res headers字符串转成 对象
        const responseData =
          responseType && responseType !== 'text' ? request.response : request.responseText
        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        }
        handleResponse(response)
      }

      // 网络出现异常（比如不通）时会触发onerror
      request.onerror = function handleError() {
        reject(createError('Network Error', config, null, request))
      }

      // 设置了timeout，请求超时时会自动终止，并触发ontimeout
      request.ontimeout = function handleTimeout() {
        reject(
          createError(`Timeout of ${config.timeout} ms exceeded`, config, 'ECONNABORTED', request)
        )
      }

      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }
      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    // 与req header相关设置
    function processHeaders(): void {
      // 如果data是FormData类型，删除原来设置的Content-Type，让浏览器自动设置
      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      const isSameOriginOrWithCredentials = withCredentials || isURLSameOrigin(url!)
      if (isSameOriginOrWithCredentials && xsrfCookieName) {
        // 从cookie中读出token，添加到headers中
        const xsrfValue = cookie.read(xsrfCookieName)
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }

      Object.keys(headers).forEach(name => {
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    // 与取消请求相关
    function processCancel(): void {
      // request是异步的，数据返回前都可以通过request.abort()中止，插入一个pendding状态的promise对象，使得外部可以通过调用一个可以改变该promise的状态的函数，
      // 从而调用request.abort()中止请求
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)  // reason是Cancel实例，可以用来判断是不是因为中止请求产生的错误
        })
      }
    }

    // 处理非200状态码的错误
    function handleResponse(response: AxiosResponse) {
      // 如果用户把validateStatus重置为空，则默认所有status都是正确响应
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }


    // 创建一个 xhr 流程
    const request = new XMLHttpRequest()

    request.open(method.toUpperCase(), url!, true)

    configureRequest()
    addEvents()
    processHeaders()
    processCancel()

    request.send(data)
  })
}
