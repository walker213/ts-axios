import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { processHeaders } from '../helpers/header'
import { transformRequest, transformResponse } from '../helpers/data'


export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
	processConfig(config)
	return xhr(config).then(res => {
		return transformResponseData(res)
	})
}

function processConfig(config: AxiosRequestConfig): void {
	config.url = transformURL(config)
	config.headers = transformHeaders(config)
	config.data = transformRequestData(config)
}

function transformURL(config: AxiosRequestConfig): string {
	const { url, params } = config
	return buildURL(url!, params)  // ！断言不为空
}

function transformHeaders(config: AxiosRequestConfig) {
	const { headers = {}, data } = config
	return processHeaders(headers, data)
}

function transformRequestData(config: AxiosRequestConfig): any {
	return transformRequest(config.data)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
	res.data = transformResponse(res.data)
	return res
}
