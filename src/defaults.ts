import { AxiosRequestConfig } from "./types";
import { processHeaders } from "./helpers/header";
import { transformRequest, transformResponse } from "./helpers/data";

const defaults: AxiosRequestConfig = {
	method: 'get',
	timeout: 0,
	headers: {
		common: {
			Accept: 'application/json, text/plain, */*'
		}
	},

	xsrfCookieName: 'XSRF-TOKEN',
	xsrfHeaderName: 'X-XSRF-TOKEN',

	
	// transformRequest 在将请求数据发送到服务器之前对其进行修改，只适用于 put 、post 、patch
	// 如果值是数组，则数组中的最后一个函数必须返回一个字符串或者FormData、UrlSearchParams、Blob等类型作为xhr.send方法的参数
	// 而且在transform过程中可以修改headers对象

	transformRequest: [
		function(data:any,headers:any):any {
			processHeaders(headers,data)   // headers是一个引用，修改后config.header也会跟着修改
			return transformRequest(data)
		}
	],

	// 而transformResponse允许你在把响应数据传递给then或者catch之前对他们进行修改
	// 而值为数组时，数组的每一个函数都是一个转换函数，数组中的函数像管道一样一次执行，前者的输出作为后者的输入

	transformResponse: [
		function(data:any): any {
			return transformResponse(data)
		}
	]
	
}

const methodNoData = ['delete','get','head','options']
methodNoData.forEach(method => {
	defaults.headers[method] = {}
})

const methodWithData = ['post','put','patch']
methodWithData.forEach(method => {
	defaults.headers[method] = {
		'Content-Type': 'applicaion/x-www-form-urlencoded'
	}
})

export default defaults