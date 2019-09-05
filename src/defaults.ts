import { AxiosRequestConfig } from "./types";

const defaults: AxiosRequestConfig = {
	method: 'get',
	timeout: 0,
	headers: {
		common: {
			Accept: 'application/json, text/plain, */*'
		}
	}
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