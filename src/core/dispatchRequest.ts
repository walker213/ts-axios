import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { flattenHeaders } from '../helpers/header'
import transform from './transform'


export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
	throwIfcancellationRequested(config)
	processConfig(config)
	return xhr(config).then(res => {
		return transformResponseData(res)
	})
}

function processConfig(config: AxiosRequestConfig): void {
	config.url = transformURL(config)
	config.data = transform(config.data,config.headers,config.transformRequest)
	config.headers = flattenHeaders(config.headers,config.method!)
}

function transformURL(config: AxiosRequestConfig): string {
	const { url, params } = config
	return buildURL(url!, params)  // ！断言不为空
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
	res.data = transform(res.data,res.headers,res.config.transformResponse)
	return res
}

// 检测config.cancelToken，是否已经使用过一次取消，若已取消过，直接报错，不发送请求
function throwIfcancellationRequested(config:AxiosRequestConfig):void {
	if (config.cancelToken) {
		config.cancelToken.throwIfRequested()
	}
}